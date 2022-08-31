import { Options, ScriptParser } from './ScriptParser.js';
import { generateUndefineValue, Value } from '../entity/Value.js';
import { RegisterFactory } from './ScriptRegisterParser.js';
import { Syntax, Properties, Feature, Type, Visibility, CompositionProperties, CompositionHooks, CompositionFeature } from '../lib/Enum.js';
import { CompositionValueOptions, generateName } from './AbstractParser.js';
import { CommentParser } from './CommentParser.js';

import { Parser } from '../../types/Parser.js';
import { Entry } from '../../types/Entry.js';
import { File } from '../../types/FileSystem.js';

import * as Babel from '@babel/types';

export type ParseDataValueOptions = {
  name: string;
  value: Value;
  nodeTyping: any;
  nodeComment: any;
};

const generateVarName = generateName('var');
const fallbackComposition: Parser.CompiledComposition = Object.freeze({
  fname: 'undefined',
  feature: 'data',
});

const SPECIFIC_COMPOSITION_PROPERTIES = Object.values(CompositionProperties);
const DEFINE_COMPONENT_CALL_EXPRESSIONS = [
  'defineComponent',
  'defineCustomElement',
  'defineAsyncComponent',
];

const EXPLICIT_EXPOSE_CALL_EXPRESSION = [
  'defineExpose',
  'expose',
];

function hasDefineExposeStatement(bodyNode): boolean {
  return bodyNode.body.some((item: Babel.Node) => {
    if (item.type === Syntax.ExpressionStatement) {
      if (item.expression.type === Syntax.CallExpression && 'name' in item.expression.callee) {
        return EXPLICIT_EXPOSE_CALL_EXPRESSION.includes(item.expression.callee.name);
      }
    }

    return item.type === Syntax.ReturnStatement;
  });
}

function hasCompositionProperties(node) {
  return node.properties.some(({ key: { name } }) => SPECIFIC_COMPOSITION_PROPERTIES.includes(name));
}

function checkExpliciExpose(bodyNode) {
  return hasDefineExposeStatement(bodyNode) || CompositionParser.isCompositionScript(bodyNode);
}

export class CompositionParser extends ScriptParser {
  shouldEmitOnDeclarations: boolean;
  publicProperties: null | string[];
  effectScopes: string[];

  constructor(
    root: Parser.Interface,
    source: Required<Parser.Script>,
    file: Readonly<File>,
    options: Options,
    createRegister: RegisterFactory
  ) {
    super(root, source, file, options, createRegister);

    this.shouldEmitOnDeclarations = !checkExpliciExpose(source.ast.program);
    this.publicProperties = null;
    this.effectScopes = [];
    this.defaultModelPropName = 'modelValue';
    this.enableNestedEventsParsing = false;
  }

  static isComponentCallExpression(node) {
    return DEFINE_COMPONENT_CALL_EXPRESSIONS.includes(node.callee.name);
  }

  static isCompositionScript(bodyNode): boolean {
    const node = bodyNode.body.find((item) => item.type === Syntax.ExportDefaultDeclaration);

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

  emit(entry: Entry.Type) {
    this.parseExposedEntry(entry);
    super.emit(entry);
  }

  emitScopeEntry(feature: Parser.CompositionFeature, ref: Parser.ScopeEntry<any, any, any>) {
    switch (feature) {
      case Feature.methods:
        ref.node.value.id = { name: ref.key };

        this.parsers.methods.sync().parseMethodProperty(ref.node.value, ref.node.value, ref.node.value, {
          parseEvents: false,
          hooks: CompositionHooks,
        });
        break;

      default:
        super.emitScopeEntry(feature, ref);
        break;
    }
  }

  parse() {
    this.parseComponentComment();
    super.parse();
  }

  parseComponentComment() {
    if (this.shouldEmitOnDeclarations && this.source.ast.comments?.length && typeof this.source.ast.comments[0].end === 'number' && typeof this.source.ast.program.body[0]?.start === 'number') {
      const topLevelCommentBlock = this.source.ast.comments[0].end < this.source.ast.program.body[0]?.start
        ? this.source.ast.comments[0]
        : null;

      if (topLevelCommentBlock?.value) {
        const { description, keywords } = CommentParser.parse(topLevelCommentBlock.value);

        this.parseComment(description, keywords);
      }
    }
  }

  parseAst(node: Babel.Node) {
    if ('body' in node) {
      if (node.body instanceof Array) {
        for (const item of node.body) {
          this.parseAstStatement(item);
        }

        return;
      }
    }

    this.parseAstStatement(node);
  }

  parseAstStatement(item) {
    switch (item.type) {
      case Syntax.FunctionDeclaration:
        this.parseFunctionDeclaration(item);
        break;

      case Syntax.ReturnStatement:
        this.parseReturnStatement(item);
        break;

      default:
        super.parseAstStatement(item);
        break;
    }
  }

  parseReturnStatement(node) {
    switch (node.argument.type) {
      case Syntax.ObjectExpression: {
        this.parseReturnObjectExpression(node.argument);
        break;
      }
    }
  }

  parseObjectProperty(node: Babel.ObjectProperty) {
    if (node.value.type === Syntax.Identifier) {
      this.parseIdentifier(node.value);
    }
  }

  parseReturnObjectExpression(node: Babel.ObjectExpression) {
    for (const property of node.properties) {
      if (property.type === Syntax.SpreadElement) {
        // TODO Handle spread object
      } else {
        if (property.type === Syntax.ObjectProperty) {
          this.parseObjectProperty(property);
        }

        if ('value' in property && this.features.length) {
          let callExpressionNode: Babel.CallExpression;
          let propertyKey: string;

          switch (property.value.type) {
            case Syntax.Identifier: {
              const ref = this.getScopeValue(property.value.name);

              if (ref?.composition) {
                this.parseCompositionFeatureEntry(ref.key, ref.composition, {
                  id: property as any,
                });
                continue;
              } else if (ref?.node.value.type === Syntax.CallExpression) {
                callExpressionNode = ref.node.value;
                propertyKey = ref.key;
              }
              break;
            }

            case Syntax.CallExpression:
              callExpressionNode = property.value;

              if ('name' in property.key) {
                propertyKey = property.key.name;
              }
              break;
          }

          if (callExpressionNode?.type === Syntax.CallExpression && propertyKey) {
            const result = this.parseCompositionCallExpression(propertyKey, {
              id: property as any,
              init: callExpressionNode,
            });

            if (result) {
              continue;
            }
          }
        }

        this.parseData(property);
      }
    }
  }

  parseCompositionCallExpression(key: string, options: Required<Pick<CompositionValueOptions, 'id' | 'init'>>) {
    const decoratorValue = this.getDeclaratorValue(options);

    if (decoratorValue.ref && decoratorValue.composition) {
      this.setScopeValue(key, decoratorValue.node || options.id, decoratorValue.ref);
      this.parseCompositionFeatureEntry(key, decoratorValue.composition, options);

      return true;
    }

    return false;
  }

  parseSetupScope(node: Babel.BlockStatement | Babel.ObjectExpression) {
    if (node.type === Syntax.BlockStatement) {
      const shouldEmitOnDeclarationsBackup = this.shouldEmitOnDeclarations;

      this.shouldEmitOnDeclarations = !checkExpliciExpose(node);
      node.body.forEach((item) => this.parseAstStatement(item));
      this.shouldEmitOnDeclarations = shouldEmitOnDeclarationsBackup;
    } else if (node.type === Syntax.ObjectExpression) {
      this.parseReturnObjectExpression(node);
    }
  }

  parseCallExpression(node) {
    if (node.callee.type === Syntax.MemberExpression) {
      if (this.effectScopes.includes(node.callee.object.name) && node.callee.property.name === 'run' && node.arguments[0]) {
        this.parseSetupScope(node.arguments[0].body);
      }
    } else {
      switch (node.callee.name) {
        case 'withDefaults':
          if (this.features.includes(Feature.props)) {
            this.parsers.props.sync().parseWithDefaultsCall(node);
          }
          break;

        case 'expose':
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
          } else if (this.hasLeftSidePart(node)) {
            this.parseCompositionFeature(node.callee.name, node);
          } else {
            const key = generateVarName.next().value;
            const options: CompositionValueOptions = {
              id: node,
              init: node,
            };

            const decoratorValue = this.getDeclaratorValue(options);

            if (decoratorValue.ref && decoratorValue.composition) {
              this.setScopeValue(key, decoratorValue.argument || options.id, decoratorValue.ref);
              this.parseCompositionFeatureEntry(key, decoratorValue.composition, options);
            }
          }
          break;
      }
    }
  }

  parseCompositionFeature(fname: string, node, nameToHandle?: string) {
    const { declarator = node.extra.$declarator || node } = this.getLeftSidePart(node, {} as any);

    if (declarator.init?.type === Syntax.CallExpression) {
      this.parseImportedDeclarator(declarator);
    }

    const composition = this.composition.getDeclarations(fname)
      .find((composition) => this.features.includes(composition.feature));

    if (composition) {
      const elements = [];

      switch (declarator.id?.type) {
        case Syntax.ArrayPattern:
          elements.push(...declarator.id.elements);
          break;

        case Syntax.ObjectPattern:
          elements.push(...declarator.id.properties);
          break;
      }

      if (elements.length) {
        if (nameToHandle) {
          const ref = this.getScopeValue(nameToHandle);
          const source = ref?.source || nameToHandle;
          const element = elements.find((element) => element.key.name === source);

          if (element) {
            this.parseCompositionFeatureNode(
              composition,
              declarator,
              nameToHandle
            );

            return;
          }
        }

        for (const element of elements) {
          this.parseCompositionFeatureNode(
            composition,
            declarator,
            element.key.name
          );
        }
      } else {
        if (!declarator.id) {
          declarator.id = {
            name: generateVarName.next().value,
            extra: {
              file: node.extra.file,
            },
          };
        }

        this.parseCompositionFeatureNode(
          composition,
          declarator,
          nameToHandle
        );
      }

      return;
    }

    if (declarator.id) {
      if (nameToHandle) {
        const ref = this.getScopeValue(nameToHandle);

        if (ref) {
          this.parseImportedDeclarator(declarator);
          const scopeNodeValue = ref.node.value;

          if (scopeNodeValue.type === Syntax.CallExpression && scopeNodeValue !== node) {
            this.parseCompositionFeature(fname, scopeNodeValue, nameToHandle);

            return;
          }
        }
      }

      this.parseCompositionFeatureNode(
        fallbackComposition,
        declarator,
        nameToHandle
      );
    }
  }

  parseCompositionFeatureEntry(
    key: string,
    composition: Readonly<Parser.CompiledComposition>,
    options: Pick<CompositionValueOptions, 'id'>
  ) {
    if (options.id.type === Syntax.Identifier && composition.ignoreVariableIdentifier) {
      return;
    }

    const ref = this.getScopeValue(key);
    const feature = ref && (ref.function || CompositionParser.isTsFunction(ref.node.value))
      ? CompositionFeature.methods
      : composition.feature;

    this.emitScopeEntry(feature, ref);
  }

  parseCompositionFeatureNode(
    composition: Readonly<Parser.CompiledComposition>,
    declarator,
    nameToHandle?: string
  ) {
    if (declarator.id.type === Syntax.Identifier && composition.ignoreVariableIdentifier) {
      return;
    }

    const name = this.parseKey(declarator);
    const ref = this.getScopeValue(nameToHandle) || this.getScopeValue(name);

    if (ref) {
      this.emitScopeEntry(composition.feature, ref);
    }
  }

  parseExposeCallExpression(node) {
    node.properties.forEach((property) => this.parseData(property));
  }

  parseData(property) {
    const name = this.parseKey(property);
    let nodeTyping = property?.value || property;
    let nodeComment = property;
    const ref = this.getScopeValue(name);

    if (ref) {
      nodeTyping = ref.node.type;
      nodeComment = ref.node.comment;

      if (ref.node.value.type === Syntax.CallExpression) {
        this.parseCompositionFeature(ref.node.value.callee.name, ref.node.value, name);

        return;
      }

      if (ref.composition) {
        this.parseCompositionFeature(ref.composition.fname, ref.node.value, name);

        return;
      }

      if (ref.node.value.extra?.$declarator?.init?.type === Syntax.CallExpression) {
        const fname = ref.node.value.extra.$declarator.init.callee.name;

        this.parseIdentifierName(fname);

        if (ref.composition) {
          this.parseCompositionFeature(ref.composition.fname, ref.node.value, name);
        } else {
          this.parseCompositionFeature(fname, ref.node.value, name);
        }

        return;
      }

      if (CompositionParser.isFunction(ref.node.value) || CompositionParser.isTsFunction(ref.node.value)) {
        this.parseDataValueMethod({ name, value: ref.value, nodeTyping: ref.node.type, nodeComment: ref.node.comment });

        return;
      }

      this.parseDataValue({ name, value: ref.value, nodeTyping, nodeComment });

      return;
    }

    if (property.value?.type === Syntax.CallExpression) {
      this.setLeftSidePart(property.value, property, {
        ...property,
        id: property.key || {
          name,
          extra: {
            file: property.extra.file,
          },
        },
      });

      this.parseCompositionFeature(property.value.callee.name, property.value, name);

      return;
    }

    const propertyValue = property?.value || property;
    const value = this.getValue(propertyValue);

    this.parseDataValue({ name, value, nodeTyping, nodeComment });
  }

  parseDataValue({ name, value, nodeTyping, nodeComment }: ParseDataValueOptions) {
    if (value.type === Type.function) {
      this.parseDataValueMethod({ name, value, nodeTyping, nodeComment });
    } else {
      this.parsers.data.sync().parseDataValueRaw({ name, value, nodeTyping, nodeComment });
    }
  }

  parseDataValueMethod({ name, nodeTyping, nodeComment }: ParseDataValueOptions) {
    if (this.features.includes(Feature.methods)) {
      const ref = this.getScopeValue(name);

      if (ref) {
        const { value: node = nodeTyping, comment: nComment = nodeComment } = ref.node;

        if (!node.key) {
          node.key = node.id || nodeComment.key || nodeTyping.id || { name };
        }

        this.parsers.methods.sync().parseMethodProperty(node, node, nComment, {
          parseEvents: false,
          hooks: CompositionHooks,
        });
      } else if (CompositionParser.isFunction(nodeTyping)) {
        if (!nodeTyping.key) {
          nodeTyping.key = nodeTyping.id || nodeComment.key || nodeTyping.id || { name };
        }

        this.parsers.methods.sync().parseMethodProperty(nodeTyping, nodeTyping, nodeComment, {
          parseEvents: false,
          hooks: CompositionHooks,
        });
      }
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
        this.parsers.methods.sync().parseMethodProperty(node, node, node, {
          parseEvents: false,
          hooks: CompositionHooks,
        });
      }
    } else {
      this.registerFunctionDeclaration(node);
    }
  }

  registerFunctionDeclaration(node) {
    const fname = this.parseKey(node);
    const value = generateUndefineValue.next().value;

    this.setScopeValue(fname, node, value);
  }

  parseVariableDeclaration(node) {
    super.parseVariableDeclaration(node);

    node.declarations.forEach((declaration) => {
      const name = declaration.id.name;
      const ref = this.getScopeValue(name);

      if (ref?.value.$kind === 'effectScope') {
        this.effectScopes.push(name);
      }
    });

    if (this.shouldEmitOnDeclarations) {
      node.declarations.forEach((declaration) => {
        if (declaration.init.type === Syntax.CallExpression) {
          this.parseCallExpression(declaration.init);
        } else {
          const name = declaration.id.name;
          const ref = this.getScopeValue(name);

          if (ref) {
            const nodeTyping = declaration.init?.typeParameters || declaration.id?.typeAnnotation || declaration;
            const nodeComment = node.declarations.length > 1 ? declaration : node;

            this.parseVariableDeclarationValue(declaration, name, ref.value, nodeTyping, nodeComment);
          }
        }
      });
    }
  }

  parseVariableDeclarationValue(declaration, name, value, nodeTyping, nodeComment) {
    if (value.type === Type.function) {
      if (this.features.includes(Feature.methods)) {
        this.parsers.methods.sync().parseMethodProperty(declaration, declaration.init, nodeComment, {
          parseEvents: false,
          hooks: CompositionHooks,
        });
      }
    } else {
      this.parsers.data.sync()
        .parseDataValue({ name, value, nodeTyping, nodeComment });
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

  parseObjectExpression(node) {
    this.parseExposeProperty(node);
    super.parseObjectExpression(node);
  }

  parseFeature(property: Babel.ObjectMethod | Babel.ObjectProperty) {
    if ('name' in property.key) {
      switch (property.key.name) {
        case Properties.setup:
          if (property.type === Syntax.ObjectMethod) {
            this.parseSetupScope(property.body);
          }
          break;

        case Properties.model:
        case Properties.watch:
        case Properties.extends:
          // ignore this with Composition API
          break;

        case Properties.emits:
          if (this.features.includes(Feature.events)) {
            if (property.type === Syntax.ObjectProperty) {
              this.parsers.events.sync().parse(property.value);
            }
          }
          break;

        default:
          super.parseFeature(property);
          break;
      }
    }
  }
}
