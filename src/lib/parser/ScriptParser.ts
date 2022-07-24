import { parse as BabelParser, ParseResult, ParserPlugin } from '@babel/parser';

import { AbstractSourceParser } from './AbstractSourceParser.js';
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
import { UndefinedValue } from '../entity/Value.js';

import { Syntax, Properties, Feature, Tag, PropTypesTag, CompositionAPIValues } from '../Enum.js';
import { KeywordsUtils } from '../utils/KeywordsUtils.js';
import { JSXParser } from './JSXParser.js';
import type { Parser } from './Parser.js';
import { Vuedoc } from '../../../types/index.js';

import * as Babel from '@babel/types';

import {
  TSTypeAliasDeclaration,
  TSInterfaceDeclaration,
  TSEnumDeclaration,
  ImportDeclaration
} from '@babel/types';

const EXCLUDED_KEYWORDS = [Tag.name, Tag.slot, Tag.mixin];

const ALLOWED_EXPORTED_PROPERTIES = [
  { object: 'module', property: 'exports' },
  { object: 'exports', property: 'default' },
];

const BABEL_DEFAULT_PLUGINS: ParserPlugin[] = [
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

export function parseAst(content: string, options: Options) {
  return BabelParser(content, {
    allowImportExportEverywhere: true,
    allowAwaitOutsideFunction: true,
    allowReturnOutsideFunction: true,
    allowSuperOutsideMethod: true,
    allowUndeclaredExports: true,
    createParenthesizedExpressions: false,
    errorRecovery: false,
    plugins: options.jsx
      ? [...BABEL_DEFAULT_PLUGINS, 'jsx']
      : BABEL_DEFAULT_PLUGINS,
    sourceType: 'module',
    strictMode: false,
    ranges: true,
    tokens: false,
  });
}

export type Options = {
  jsx: boolean;
  composition: Vuedoc.Parser.ParsingComposition;
};

export class ScriptParser<ParseNode = void, Root = never> extends AbstractSourceParser<Vuedoc.Parser.Script, Root> {
  options: Options;
  ast: Vuedoc.Parser.AST.Result;
  ignoredMothods: never[];
  defaultModelPropName = 'value';

  constructor(emitter: Parser, ast: Vuedoc.Parser.AST.Result, source: Vuedoc.Parser.Script, options: Options) {
    super(null as never, emitter, source, emitter.scope);

    this.source = source;
    this.options = options;

    this.ast = ast;
    this.ignoredMothods = [];
  }

  findComment({ trailingComments = [], leadingComments = trailingComments, ...node }: Babel.Node) {
    const leadingComment = leadingComments?.reverse()[0];

    if (leadingComment) {
      return leadingComment.start && node.end && leadingComment.start > node.end ? null : leadingComment.value;
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

  parse(node: ParseNode) {
    this.parseAst(this.ast.program);
  }

  parseCommentNode(node: Babel.Node) {
    const comment = this.findComment(node);

    if (comment) {
      const { description, keywords } = CommentParser.parse(comment);

      this.parseComment(description, keywords);
    }
  }

  parseComment(description: string, keywords: Vuedoc.Entry.Keyword[]) {
    if (this.features.includes(Feature.name)) {
      if (keywords.length) {
        const nameKeywords = KeywordsUtils.extract(keywords, Tag.name, true);
        const nameKeyword = nameKeywords.pop();

        if (nameKeyword && nameKeyword.description) {
          this.emit(new NameEntry(nameKeyword.description));
        }
      }
    }

    if (this.features.includes(Feature.description) && description) {
      this.emit(new DescriptionEntry(description));
    }

    if (keywords.length) {
      if (this.features.includes(Feature.slots)) {
        SlotParser.extractSlotKeywords(keywords).forEach((slot) => this.emit(slot));
      }

      if (this.features.includes(Feature.keywords)) {
        this.emit(new KeywordsEntry(keywords.filter(({ name }) => !EXCLUDED_KEYWORDS.includes(name))));
      }
    }
  }

  parseComponent(node, declaration) {
    this.parseExportDefaultDeclaration(declaration);
    this.parseCommentNode(node);
  }

  parseAst(node: Vuedoc.Parser.AST.Program) {
    node.body.forEach((item) => this.parseAstStatement(item));
  }

  parseAstStatement(item: Vuedoc.Parser.AST.Statement) {
    switch (item.type) {
      case Syntax.ClassDeclaration:
        this.setScopeValue(item.id.name, item, this.getValue(item));
        break;

      case Syntax.VariableDeclaration:
        this.parseVariableDeclaration(item as any);
        break;

      case Syntax.ExportNamedDeclaration:
        if (this.hasExplicitMixinKeyword(item)) {
          this.parseExplicitMixinDeclaration(item);
        } else if (item.declaration) {
          this.parseAstStatement(item.declaration);
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

  parseTSTypeAliasDeclaration(item: TSTypeAliasDeclaration) {
    this.setScopeValue(item.id.name, item.typeAnnotation, UndefinedValue);
  }

  parseTSInterfaceDeclaration(item: TSInterfaceDeclaration) {
    this.setScopeValue(item.id.name, item.body, UndefinedValue);
  }

  parseTSEnumDeclaration(item: TSEnumDeclaration) {
    this.setScopeValue(item.id.name, item, UndefinedValue);
  }

  parseImportDeclaration(item: ImportDeclaration) {
    // TODO Handle ImportDeclaration
    // if (item.importKind === 'value' && item.source.value === 'vue') {
    //   item.specifiers
    //     .filter(({ imported }) => CompositionAPIValues.includes(imported.name))
    //     .forEach(() => {});
    //   // console.log('>>>', item.specifiers)
    // }
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

  parseExpressionStatement(node) {
    switch (node.expression.type) {
      case Syntax.CallExpression:
        this.parseExportDefaultDeclaration(node.expression);
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
    this.parseExportDefaultDeclaration(node.body);
  }

  parseObjectExpression(node) {
    node.properties
      .filter(({ key }) => key.name in Properties)
      .forEach((property) => this.parseFeature(property));
  }

  parseExportDefaultDeclaration(node: Babel.Node) {
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

      case Syntax.ClassDeclaration:
        this.parseClassComponent(node);
        break;

      case Syntax.Identifier:
        if (node.name in this.scope && this.scope[node.name].node) {
          this.parseExportDefaultDeclaration(this.scope[node.name].node.value);
        }
        break;

      case Syntax.NewExpression:
        if ('name' in node.callee && node.callee.name === 'Vue') {
          // Vue Instance
          if (node.arguments.length) {
            this.parseExportDefaultDeclaration(node.arguments[0]);
          }
        }
        break;

      default:
        if (ScriptParser.isFunction(node)) {
          this.parseFunctionExpression(node);
        }
        break;
    }
  }

  parseBaseClassComponent(node: Babel.ClassDeclaration) {
    this.emitter.execAsync(async () => {
      const { ClassComponentParser } = await import('./ClassComponentParser.js');

      new ClassComponentParser(this, this.emitter, this.ast, this.source, this.options).parse(node);
    });
  }

  parseDecorator(node: Babel.Decorator) {
    switch (node.expression.type) {
      case Syntax.CallExpression: {
        if ('name' in node.expression.callee && node.expression.callee.name === PropTypesTag.Component) {
          if (node.expression.arguments.length) {
            this.parseExportDefaultDeclaration(node.expression.arguments[0]);
          }
        }
      }
    }
  }

  parseClassComponent(node: Babel.ClassDeclaration) {
    this.parseBaseClassComponent(node);

    if (node.decorators) {
      node.decorators.forEach((node) => this.parseDecorator(node));
    }
  }

  parseFeature(property) {
    switch (property.key.name) {
      case Properties.name:
        if (this.features.includes(Feature.name)) {
          new NameParser(this, this.emitter, this.source, this.scope).parse(property);
        }
        break;

      case Properties.inheritAttrs:
        new InheritAttrsParser(this, this.emitter, this.source, this.scope).parse(property);
        break;

      case Properties.model:
        if (this.features.includes(Feature.props)) {
          new ModelParser(this, this.emitter, this.source, this.scope).parse(property);
        }
        break;

      case Properties.data:
        new DataParser(this, this.emitter, this.source, this.scope).parse(property);
        break;

      case Properties.props:
        if (this.features.includes(Feature.props)) {
          new PropParser(this, this.emitter, this.source, this.scope).parse(property);
        }
        break;

      case Properties.computed:
        if (this.features.includes(Feature.computed)) {
          new ComputedParser(this, this.emitter, this.source, this.scope).parse(property);
        }
        break;

      case Properties.watch:
        if (this.features.includes(Feature.events)) {
          property.value.properties
            .filter((property) => ('value' in property && ScriptParser.isFunction(property.value)) || ScriptParser.isFunction(property))
            .forEach((watcher) => new EventParser(this, this.emitter, this.source, this.scope).parse(watcher));
        }
        break;

      case Properties.template:
        new InlineTemplateParser(this, this.emitter, this.source, this.scope).parse(property);
        break;

      case Properties.methods:
        new MethodParser(this).parse(property);
        break;

      case Properties.render:
        new JSXParser(this, this.emitter, this.source, this.scope).parse(property);
        break;

      default:
        if (this.features.includes(Feature.events)) {
          new EventParser(this, this.emitter, this.source, this.scope).parse(property);
        }
        break;
    }
  }
}
