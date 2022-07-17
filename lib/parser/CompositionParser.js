import { get } from '@b613/utils/lib/object.js';

import { ScriptParser } from './ScriptParser.js';
import { PropParser } from './PropParser.js';
import { DataParser } from './DataParser.js';
import { SetupParser } from './SetupParser.js';
import { ComputedParser } from './ComputedParser.js';
import { MethodParser } from './MethodParser.js';
import { EventParser } from './EventParser.js';

import { Value } from '../entity/Value.js';

import { Syntax, Properties, Feature, Type, Visibility, CompositionAPI, CompositionHooks, RouterKeys, CompositionProperties, CompositionAPIComputedValues } from '../Enum.js';

const SPECIFIC_COMPOSITION_PROPERTIES = Object.values(CompositionProperties);
const DEFINE_COMPONENT_CALL_EXPRESSIONS = [
  'defineComponent',
  'defineCustomElement',
  'defineAsyncComponent',
];

function hasDefineExposeStatement(ast) {
  return ast.program.body.some((item) => {
    return item.type === Syntax.ExpressionStatement
      && item.expression.type === Syntax.CallExpression
      && item.expression.callee.name === 'defineExpose';
  });
}

function hasCompositionProperties(node) {
  return node.properties.some(({ key: { name } }) => SPECIFIC_COMPOSITION_PROPERTIES.includes(name));
}

export class CompositionParser extends ScriptParser {
  /**
   * @param {Parser} parser - The Parser object
   */
  constructor(root, ast, data, options = {}) {
    super(root, ast, data, options);

    this.hasDefineExposeStatement = hasDefineExposeStatement(ast);
    this.hasDefaultExportCallExpression = CompositionParser.isCompositionScript(ast);
    this.shouldEmitOnDeclarations = !this.hasDefineExposeStatement && !this.hasDefaultExportCallExpression;
    this.publicProperties = null;
  }

  static isComponentCallExpression(node) {
    return DEFINE_COMPONENT_CALL_EXPRESSIONS.includes(node.callee.name);
  }

  static isCompositionScript(ast) {
    const node = ast.program.body.find((item) => item.type === Syntax.ExportDefaultDeclaration);

    if (node) {
      switch (node.declaration.type) {
        case Syntax.ObjectExpression:
          return hasCompositionProperties(node.declaration);

        case Syntax.CallExpression:
          if (CompositionParser.isComponentCallExpression(node.declaration) && node.declaration.arguments.length) {
            if (node.declaration.arguments[0].type === Syntax.ObjectExpression) {
              return hasCompositionProperties(node.declaration.arguments[0]);
            }
          }
          break;
      }
    }

    return false;
  }

  get compositionComputedKeys() {
    return CompositionAPIComputedValues.concat(this.options.composition.computed);
  }

  parseAst(node) {
    node.body.forEach((item) => this.parseAstItem(item));
  }

  parseAstItem(item) {
    switch (item.type) {
      case Syntax.FunctionDeclaration:
        this.parseFunctionDeclaration(item);
        break;

      default:
        super.parseAstItem(item);
        break;
    }
  }

  parseCallExpression(node) {
    if (node.callee.type === Syntax.MemberExpression) {
      if (this.effectScopes.includes(node.callee.object.name) && node.callee.property.name === 'run') {
        node.arguments[0]?.body.body.forEach((item) => this.parseAstItem(item));
      }
    } else {
      switch (node.callee.name) {
        case 'withDefaults':
          if (this.features.includes(Feature.props)) {
            new PropParser(this).parseWithDefaultsCall(node);
          }
          break;

        case 'defineProps':
          if (this.features.includes(Feature.props)) {
            new PropParser(this).parse(node.arguments[0] || node);
          }
          break;

        case 'defineEmits':
          if (this.features.includes(Feature.events)) {
            new EventParser(this).parse(node.arguments[0] || node);
          }
          break;

        case 'defineExpose':
          if (node.arguments.length) {
            this.parseExposeCallExpression(node.arguments[0]);
          }
          break;

        case 'createApp':
          if (node.arguments.length) {
            this.parseExportDefaultDeclaration(node.arguments[0]);
          }
          break;

        default:
          if (CompositionParser.isComponentCallExpression(node)) {
            this.parseExportDefaultDeclaration(node.arguments[0] || node);
          } else {
            super.parseCallExpression(node);
          }
          break;
      }
    }
  }

  parseExposeCallExpression(node) {
    node.properties.forEach((property) => this.parseData(property));
  }

  parseData(property) {
    const name = this.parseKey(property);
    const propertyValue = property?.value || property;
    const value = this.getValue(propertyValue);

    this.parseDataValue({
      name,
      value,
      nodeTyping: propertyValue,
      nodeComment: property,
    });
  }

  parseDataValue({ name, value, nodeTyping, nodeComment }) {
    if (this.compositionComputedKeys.includes(value.$kind)) {
      this.parseDataValueComputed({ name, value, nodeTyping, nodeComment });
    } else if (value.type === Type.function) {
      this.parseDataValueMethod({ name, value, nodeTyping, nodeComment });
    } else {
      new SetupParser(this).parseDataValueRaw({ name, value, nodeTyping, nodeComment });
    }
  }

  parseDataValueComputed({ name, nodeTyping, nodeComment }) {
    if (this.features.includes(Feature.computed)) {
      new ComputedParser(this).parseComputedValue({
        name,
        node: this.nodes[name].node,
        nodeTyping,
        nodeComment,
      });
    }
  }

  parseDataValueMethod({ name, nodeTyping, nodeComment }) {
    if (this.features.includes(Feature.methods)) {
      const { node = nodeTyping, nodeComment: nComment = nodeComment } = this.nodes[name] || {};

      if (!node.key) {
        node.key = node.id || nodeComment.key || nodeTyping.id;
      }

      new MethodParser(this).parseMethodProperty(node, node, nComment, {
        parseEvents: false,
        hooks: CompositionHooks,
      });
    }
  }

  parseExpressionStatement(node) {
    switch (node.expression.type) {
      case Syntax.CallExpression:
        this.parseCallExpression(node.expression);
        break;

      default:
        super.parseExpressionStatement(node);
        break;
    }
  }

  parseFunctionDeclaration(node) {
    if (this.shouldEmitOnDeclarations) {
      if (this.features.includes(Feature.methods)) {
        new MethodParser(this).parseMethodProperty(node, node, node, {
          parseEvents: false,
          hooks: CompositionHooks,
        });
      }
    }
  }

  parseVariableDeclaration(node) {
    super.parseVariableDeclaration(node);

    if (this.shouldEmitOnDeclarations) {
      node.declarations.forEach((declaration) => {
        const name = declaration.id.name;
        const value = this.scope[declaration.id.name];
        const nodeTyping = declaration.init?.typeParameters || declaration.id?.typeAnnotation || declaration;
        const nodeComment = node.declarations.length > 1 ? declaration : node;

        if (declaration.init.type === Syntax.CallExpression) {
          this.parseCallExpression(declaration.init);
        }

        this.parseVariableDeclarationValue(declaration, name, value, nodeTyping, nodeComment);
      });
    }
  }

  parseVariableDeclarationValue(declaration, name, value, nodeTyping, nodeComment) {
    switch (value.$kind) {
      case 'useAttrs':
      case RouterKeys.useRoute:
      case RouterKeys.useRouter:
      case 'createApp':
        // ignoring declaration
        break;

      case 'defineProps':
      case 'defineEmits':
      case 'withDefaults':
        this.parseCallExpression(declaration.init);
        break;

      case 'effectScope':
        this.effectScopes.push(name);
        break;

      case CompositionAPI.computed:
      case CompositionAPI.$computed:
        if (this.features.includes(Feature.computed)) {
          new ComputedParser(this).parseComputedValue({
            name,
            node: declaration.init.arguments[0],
            nodeTyping,
            nodeComment,
          });
        }
        break;

      case CompositionAPI.toRef:
      case CompositionAPI.$toRef:
        if (this.features.includes(Feature.data)) {
          value = get(value.value, declaration.init.arguments[1].value);
          value = new Value(typeof value, value, JSON.stringify(value));

          new DataParser(this).parseDataValue({ name, value, nodeTyping, nodeComment });
        }
        break;

      default:
        if (value.type === Type.function) {
          if (this.features.includes(Feature.methods)) {
            new MethodParser(this).parseMethodProperty(declaration, declaration.init, nodeComment, {
              parseEvents: false,
              hooks: CompositionHooks,
            });
          }
        } else {
          new DataParser(this).parseDataValue({ name, value, nodeTyping, nodeComment });
        }
        break;
    }
  }

  parseExposedEntry(entry) {
    if (this.publicProperties) {
      if (this.publicProperties.includes(entry.name)) {
        entry.visibility = Visibility.public;
      } else {
        entry.visibility = Visibility.private;
      }
    }
  }

  parseExposeProperty(node) {
    const property = node.properties.find((property) => property.key.name === Properties.expose);

    if (property?.value) {
      const properties = this.getValue(property.value);

      if (properties.type === Type.array) {
        this.publicProperties = properties.value;
      }
    }
  }

  parseExtendsProperty(node) {
    const property = node.properties.find((property) => property.key.name === Properties.extends);

    if (property?.value) {
      const baseComponent = this.getValue(property.value);

      if (baseComponent.type === Type.object) {
        if (property.value.name in this.nodes) {
          const baseNode = this.nodes[property.value.name].node;

          if (baseNode?.type === Syntax.ObjectExpression) {
            node.properties.unshift(...baseNode.properties);
          }
        }
      }
    }
  }

  parseObjectExpression(node) {
    this.parseExposeProperty(node);
    this.parseExtendsProperty(node);

    node.properties
      .filter(({ key }) => key.name in Properties)
      .forEach((property) => this.parseFeature(property));
  }

  parseFeature(property) {
    switch (property.key.name) {
      case Properties.setup:
        new SetupParser(this).parse(property);
        break;

      case Properties.props:
        if (this.features.includes(Feature.props)) {
          new PropParser(this).parse(property);
        }
        break;

      case Properties.model:
      case Properties.watch:
        // ignore this with Composition API
        break;

      case Properties.emits:
        if (this.features.includes(Feature.events)) {
          new EventParser(this).parse(property.value);
        }
        break;

      default:
        super.parseFeature(property);
        break;
    }
  }
}
