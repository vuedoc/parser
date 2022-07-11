import { parse as BabelParser } from '@babel/parser';

import { AbstractParser } from './AbstractParser.js';
import { SlotParser } from './SlotParser.js';
import { NameParser } from './NameParser.js';
import { ModelParser } from './ModelParser.js';
import { PropParser } from './PropParser.js';
import { DataParser } from './DataParser.js';
import { ComputedParser } from './ComputedParser.js';
import { MethodParser } from './MethodParser.js';
import { EventParser } from './EventParser.js';
import { CommentParser } from './CommentParser.js';
import { InheritAttrsParser } from './InheritAttrsParser.js';
import { InlineTemplateParser } from './InlineTemplateParser.js';

import { NameEntry } from '../entity/NameEntry.js';
import { DescriptionEntry } from '../entity/DescriptionEntry.js';
import { KeywordsEntry } from '../entity/KeywordsEntry.js';

import { Syntax, Properties, Feature, Tag, PropTypesTag } from '../Enum.js';
import { KeywordsUtils } from '../utils/KeywordsUtils.js';
import { JSXParser } from './JSXParser.js';
import { UndefinedValue, Value } from '../entity/Value.js';
import { get } from '@b613/utils/lib/object.js';

const EXCLUDED_KEYWORDS = [Tag.name, Tag.slot, Tag.mixin];

const ALLOWED_EXPORTED_PROPERTIES = [
  { object: 'module', property: 'exports' },
  { object: 'exports', property: 'default' },
];

const BABEL_DEFAULT_PLUGINS = [
  'asyncGenerators',
  'bigInt',
  'classPrivateMethods',
  'classPrivateProperties',
  'classProperties',
  'decorators-legacy',
  'doExpressions',
  'dynamicImport',
  'exportDefaultFrom',
  'exportNamespaceFrom',
  // 'flow',
  'flowComments',
  'functionBind',
  'functionSent',
  'importMeta',
  'logicalAssignment',
  'nullishCoalescingOperator',
  'numericSeparator',
  'objectRestSpread',
  'optionalCatchBinding',
  'optionalChaining',
  'partialApplication',
  ['pipelineOperator', { proposal: 'smart' }],
  'placeholders',
  'privateIn',
  'throwExpressions',
  'topLevelAwait',
  'typescript',
];

const COMPOSITION_API_DATA = [
  'ref',
  'unref',
  'reactive',
  'computed',
  'readonly',
  'shallowRef',
  'shallowReactive',
  'shallowReadonly',
  'triggerRef',
  'toRaw',
  'markRaw',
  'toRef',
];

export class ScriptParser extends AbstractParser {
  /**
   * @param {Parser} parser - The Parser object
   */
  constructor(root, data, options = {}) {
    super(root);

    data.content = data.content?.trim() || '';
    this.source = data;
    this.options = options;

    this.types = {};
    this.declarations = {};
    this.eventsEmmited = {};
    this.ignoredMothods = [];
    this.effectScopes = [];
  }

  get babelPlugins() {
    return this.options.jsx
      ? [...BABEL_DEFAULT_PLUGINS, 'jsx']
      : BABEL_DEFAULT_PLUGINS;
  }

  getCallExpression(node) {
    if (this.source.attrs.setup) {
      let value;

      switch (node.callee.name) {
        case 'defineProps':
        case 'defineEmits':
          value = node.arguments.length ? this.getValue(node.arguments[0]) : UndefinedValue;
          break;

        case 'effectScope':
          value = UndefinedValue;
          break;

        case 'withDefaults':
          value = node.arguments.length ? this.getValue(node.arguments[1]) : UndefinedValue;
          break;

        default:
          if (COMPOSITION_API_DATA.includes(node.callee.name)) {
            value = node.arguments.length ? this.getValue(node.arguments[0]) : UndefinedValue;
          }
      }

      if (value) {
        value.$kind = node.callee.name;

        return value;
      }
    }

    return super.getCallExpression(node);
  }

  findComment({ trailingComments = [], leadingComments = trailingComments, ...node }) {
    const leadingComment = leadingComments.reverse()[0];

    if (leadingComment) {
      return leadingComment.start > node.end ? null : leadingComment.value;
    }

    return null;
  }

  hasExplicitMixinKeyword(node) {
    const comment = this.findComment(node);

    if (comment) {
      const { keywords } = CommentParser.parse(comment);

      return keywords.some(({ name }) => name === Tag.mixin);
    }

    return false;
  }

  parse() {
    let node = null;

    try {
      const ast = BabelParser(this.source.content, {
        allowImportExportEverywhere: true,
        allowAwaitOutsideFunction: true,
        allowReturnOutsideFunction: true,
        allowSuperOutsideMethod: true,
        allowUndeclaredExports: true,
        createParenthesizedExpressions: false,
        errorRecovery: false,
        plugins: this.babelPlugins,
        sourceType: 'module',
        strictMode: false,
        ranges: true,
        tokens: false,
      });

      node = ast.program;
    } catch (error) {
      this.emitter.emit('error', error);
    }

    if (node) {
      this.parseAst(node);
    }
  }

  parseCommentNode(node) {
    const comment = this.findComment(node);

    if (comment) {
      const { description, keywords } = CommentParser.parse(comment);

      this.parseComment(description, keywords);
    }
  }

  parseComment(description, keywords) {
    if (this.root.features.includes(Feature.name)) {
      if (keywords.length) {
        const nameKeywords = KeywordsUtils.extract(keywords, Tag.name, true);
        const nameKeyword = nameKeywords.pop();

        if (nameKeyword && nameKeyword.description) {
          this.emit(new NameEntry(nameKeyword.description));
        }
      }
    }

    if (this.root.features.includes(Feature.description)) {
      const entry = { description, keywords };

      if (entry.description) {
        this.emit(new DescriptionEntry(entry.description));
      }
    }

    if (keywords.length) {
      if (this.root.features.includes(Feature.slots)) {
        SlotParser.extractSlotKeywords(keywords).forEach((slot) => this.emit(slot));
      }

      if (this.root.features.includes(Feature.keywords)) {
        this.emit(new KeywordsEntry(keywords.filter(({ name }) => !EXCLUDED_KEYWORDS.includes(name))));
      }
    }
  }

  parseComponent(node, declaration) {
    this.parseExportDefaultDeclaration(declaration);
    this.parseCommentNode(node);
  }

  parseAst(node) {
    node.body.forEach((item) => this.parseAstItem(item));
  }

  parseAstItem(item) {
    switch (item.type) {
      case Syntax.ClassDeclaration:
        this.setScopeValue(item.id.name, item);

        this.types[item.id.name] = item;
        break;

      case Syntax.VariableDeclaration:
        this.parseVariableDeclaration(item);
        break;

      case Syntax.ExportNamedDeclaration:
        if (this.hasExplicitMixinKeyword(item)) {
          this.parseExplicitMixinDeclaration(item);
        } else {
          this.parseAstItem(item.declaration);
        }
        break;

      case Syntax.ExportDefaultDeclaration:
        if (this.hasExplicitMixinKeyword(item)) {
          this.parseExplicitMixinDeclaration(item);
        } else {
          this.parseComponent(item, item.declaration);
        }
        break;

      case Syntax.ExpressionStatement:
        this.parseExpressionStatement(item);
        break;

      case Syntax.ImportDeclaration:
        this.parseImportDeclaration(item);
        break;

      case Syntax.TSTypeAliasDeclaration:
        this.parseTSTypeAliasDeclaration(item);
        break;

      case Syntax.TSInterfaceDeclaration:
        this.parseTSInterfaceDeclaration(item);
        break;

      case Syntax.TSEnumDeclaration:
        this.parseTSEnumDeclaration(item);
        break;
    }
  }

  parseTSTypeAliasDeclaration(item) {
    this.types[item.id.name] = item.typeAnnotation;
  }

  parseTSInterfaceDeclaration(item) {
    this.types[item.id.name] = item.body;
  }

  parseTSEnumDeclaration(item) {
    this.types[item.id.name] = item;
  }

  parseImportDeclaration(item) {
    if (this.source.attrs.setup) {
      if (item.importKind === 'value' && item.source.value === 'vue') {
        item.specifiers
          .filter(({ imported }) => COMPOSITION_API_DATA.includes(imported.name))
          .forEach(() => {});
        // console.log('>>>', item.specifiers)
      }
    }
  }

  parseExplicitMixinDeclaration(node) {
    switch (node.declaration.type) {
      case Syntax.VariableDeclaration:
        node.declaration.declarations
          .slice(0, 1)
          .forEach((declaration) => this.parseComponent(node, declaration.init));
        break;

      case Syntax.ObjectExpression:
        this.parseComponent(node, node.declaration);
        break;

      case Syntax.FunctionDeclaration:
        this.parseExplicitMixinDeclarationFunctionId(node.declaration);
        this.parseExplicitMixinDeclarationFunction(node.declaration);
        this.parseCommentNode(node);
        break;

      case Syntax.ArrowFunctionExpression:
        this.parseExplicitMixinDeclarationFunction(node.declaration);
        this.parseCommentNode(node);
        break;
    }
  }

  parseExplicitMixinDeclarationFunction(declaration) {
    switch (declaration.type) {
      case Syntax.FunctionDeclaration:
      case Syntax.ArrowFunctionExpression:
        this.parseExplicitMixinDeclarationFunctionBlockStatement(declaration.body);
        break;

      case Syntax.Identifier:
        this.parseIdentifier(declaration);
        break;
    }
  }

  parseExplicitMixinDeclarationFunctionId(declaration) {
    if (this.features.includes(Feature.name)) {
      const ref = this.getValue(declaration.id);
      const nameEntry = new NameEntry(ref.value);

      this.emit(nameEntry);
    }
  }

  parseExplicitMixinDeclarationFunctionBlockStatement(node) {
    if (node.body instanceof Array) {
      node.body.forEach((item) => {
        switch (item.type) {
          case Syntax.VariableDeclaration:
            this.parseVariableDeclaration(item);
            break;

          case Syntax.ReturnStatement:
            this.parseExportDefaultDeclaration(item.argument);
            break;
        }
      });
    } else {
      this.parseExportDefaultDeclaration(node);
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

        case 'defineComponent':
          this.parseExportDefaultDeclaration(node.arguments[0] || node);
          break;

        default:
          super.parseCallExpression(node);
          break;
      }
    }
  }

  parseVariableDeclaration(node) {
    node.declarations.forEach((declaration) => {
      this.declarations[declaration.id.name] = declaration.init;
    });

    super.parseVariableDeclaration(node);

    if (this.source.attrs.setup) {
      node.declarations.forEach((declaration) => {
        const name = declaration.id.name;
        let value = this.scope[declaration.id.name];
        const nodeTyping = declaration.init?.typeParameters || declaration.id?.typeAnnotation || declaration;
        const nodeComment = node.declarations.length > 1 ? declaration : node;

        switch (value.$kind) {
          case 'defineProps':
          case 'defineEmits':
          case 'withDefaults':
            this.parseCallExpression(declaration.init);
            break;

          case 'effectScope':
            this.effectScopes.push(name);
            break;

          case 'computed':
            if (this.features.includes(Feature.computed)) {
              new ComputedParser(this).parseComputedValue({
                name,
                node: declaration.init.arguments[0],
                nodeTyping,
                nodeComment,
              });
            }
            break;

          case 'toRef':
            if (this.features.includes(Feature.data)) {
              value = get(value.value, declaration.init.arguments[1].value);
              value = new Value(typeof value, value, JSON.stringify(value));

              new DataParser(this).parseDataValue({ name, value, nodeTyping, nodeComment });
            }
            break;

          default:
            if (this.features.includes(Feature.data)) {
              new DataParser(this).parseDataValue({ name, value, nodeTyping, nodeComment });
            }
            break;
        }

        if (value.$kind) {
          delete value.$kind;
        }
      });
    }
  }

  parseExpressionStatement(node) {
    switch (node.expression.type) {
      case Syntax.CallExpression:
        if (this.source.attrs.setup) {
          this.parseCallExpression(node.expression);
        } else {
          this.parseExportDefaultDeclaration(node.expression);
        }
        break;

      case Syntax.AssignmentExpression: {
        const { type, object, property } = node.expression.left;

        if (type !== Syntax.MemberExpression) {
          break;
        }

        const isExportedComponent = ALLOWED_EXPORTED_PROPERTIES.some((item) => {
          if (item.object === object.name) {
            const ref = this.getValue(property);

            return ref.value === item.property;
          }

          return false;
        });

        if (isExportedComponent) {
          this.parseComponent(node.expression, node.expression.right);
          this.parseCommentNode(node);
        }
        break;
      }
    }
  }

  parseFunctionExpression(node) {
    switch (node.type) {
      case Syntax.FunctionExpression:
      case Syntax.ArrowFunctionExpression:
        this.parseExportDefaultDeclaration(node.body);
        break;
    }
  }

  parseObjectExpression(node) {
    node.properties
      .filter(({ key }) => Properties.hasOwnProperty(key.name))
      .forEach((property) => this.parseFeature(property, node.properties));
  }

  parseExportDefaultDeclaration(node) {
    switch (node.type) {
      case Syntax.ObjectExpression:
        this.parseObjectExpression(node);
        break;

      case Syntax.CallExpression:
        if (node.arguments.length) {
          if (this.source.attrs.setup) {
            this.parseCallExpression(node);
          } else {
            this.parseExportDefaultDeclaration(node.arguments[0]);
          }
        }
        break;

      case Syntax.FunctionExpression:
      case Syntax.ArrowFunctionExpression:
        this.parseFunctionExpression(node);
        break;

      case Syntax.ClassDeclaration:
        this.parseClassComponent(node);
        break;

      case Syntax.Identifier: {
        const identifierNode = this.nodes[node.name];

        if (identifierNode) {
          this.parseExportDefaultDeclaration(identifierNode);
        }
        break;
      }

      case Syntax.NewExpression:
        if (node.callee.name === 'Vue') {
          // Vue Instance
          if (node.arguments.length) {
            this.parseExportDefaultDeclaration(node.arguments[0]);
          }
        }
        break;

      default:
        // Ignore statement
    }
  }

  async parseBaseClassComponent(node) {
    // eslint-disable-next-line import/no-cycle
    const { ClassComponentParser } = await import('./ClassComponentParser.js');

    new ClassComponentParser(this).parse(node);
  }

  parseDecorator(node) {
    switch (node.type) {
      case Syntax.CallExpression: {
        switch (node.callee.name) {
          case PropTypesTag.Component:
            if (node.arguments.length) {
              this.parseExportDefaultDeclaration(node.arguments[0]);
            }
            break;
        }
        break;
      }
    }
  }

  parseClassComponent(node) {
    this.parseBaseClassComponent(node);

    if (node.decorators) {
      node.decorators.forEach((node) => this.parseDecorator(node.expression));
    }
  }

  parseFeature(property, properties) {
    switch (property.key.name) {
      case Properties.name:
        if (this.features.includes(Feature.name)) {
          new NameParser(this).parse(property);
        }
        break;

      case Properties.inheritAttrs:
        new InheritAttrsParser(this).parse(property);
        break;

      case Properties.model:
        if (!this.root.model) {
          // Make sure to load the model feature once
          new ModelParser(this).parse(property);
        }
        break;

      case Properties.data:
        if (this.features.includes(Feature.data)) {
          new DataParser(this).parse(property);
        }
        break;

      case Properties.props:
        if (this.features.includes(Feature.props)) {
          if (!this.root.model) {
            // Make sure to load the model feature before
            const modelProperty = properties.find(({ key }) => key.name === Properties.model);

            if (modelProperty) {
              this.parseFeature(modelProperty);
            }
          }

          new PropParser(this).parse(property);
        }
        break;

      case Properties.computed:
        if (this.features.includes(Feature.computed)) {
          new ComputedParser(this).parse(property);
        }
        break;

      case Properties.watch:
        if (this.features.includes(Feature.events)) {
          property.value.properties.forEach((watcher) => new EventParser(this).parse(watcher));
        }
        break;

      case Properties.template:
        new InlineTemplateParser(this).parse(property);
        break;

      case Properties.methods:
        new MethodParser(this).parse(property);
        break;

      case Properties.render:
        new JSXParser(this).parse(property);
        break;

      default:
        if (this.features.includes(Feature.events)) {
          new EventParser(this).parse(property);
        }
        break;
    }
  }
}
