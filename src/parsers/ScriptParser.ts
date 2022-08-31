import { Import } from '../lib/Import.js';
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
import { RegisterFactory } from './ScriptRegisterParser.js';
import { CompositionValueOptions } from './AbstractParser.js';

import { NameEntry } from '../entity/NameEntry.js';
import { DescriptionEntry } from '../entity/DescriptionEntry.js';
import { KeywordsEntry } from '../entity/KeywordsEntry.js';
import { generateUndefineValue } from '../entity/Value.js';
import { ImportResolver } from '../../types/ImportResolver.js';

import { TSTypeAliasDeclaration, TSInterfaceDeclaration, TSDeclareFunction, TSEnumDeclaration, ImportDeclaration } from '@babel/types';
import { Syntax, Properties, Feature, Tag, PropTypesTag, Type } from '../lib/Enum.js';
import { KeywordsUtils } from '../utils/KeywordsUtils.js';
import { JSXParser } from './JSXParser.js';

import { File } from '../../types/FileSystem.js';
import { Entry } from '../../types/Entry.js';
import { Parser } from '../../types/Parser.js';
import { DTS } from '../lib/DTS.js';

import * as Babel from '@babel/types';

const EXCLUDED_KEYWORDS = [Tag.name, Tag.slot, Tag.mixin];

const ALLOWED_EXPORTED_PROPERTIES = [
  { object: 'module', property: 'exports' },
  { object: 'exports', property: 'default' },
];

export type Options = Required<Pick<Parser.Options, 'loaders'>> & {
  jsx: boolean;
  resolver?: ImportResolver;
  composition: Partial<Parser.ParsingComposition>;
  encoding?: string;
};

export class ScriptParser<ParseNode = void, Root = never>
  extends AbstractSourceParser<Required<Parser.Script>, Root>
  implements Parser.Context {
  options: Options;
  defaultModelPropName = 'value';
  enableNestedEventsParsing: boolean;
  imports: Record<string, Import> = {};
  createRegister: RegisterFactory;
  file: Readonly<File>;
  parsers: {
    data: DataParser;
    computed: ComputedParser;
    props: PropParser;
    events: EventParser;
    methods: MethodParser;
  };

  constructor(
    emitter: Parser.Interface,
    source: Required<Parser.Script>,
    file: Readonly<File>,
    options: Options,
    createRegister: RegisterFactory
  ) {
    super(null as never, emitter, source, emitter.scope);

    this.options = options;
    this.file = file;
    this.createRegister = createRegister;
    this.enableNestedEventsParsing = true;
    this.parsers = {
      data: new DataParser(this, this.emitter, this.source, this.scope),
      computed: new ComputedParser(this, this.emitter, this.source, this.scope),
      props: new PropParser(this, this.emitter, this.source, this.scope),
      events: new EventParser(this, this.emitter, this.source, this.scope),
      methods: new MethodParser(this),
    };
  }

  // TODO Handle node.innerComments
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

  isNamespace(ref: Parser.NS | Parser.ScopeEntry) {
    return '$ns' in ref;
  }

  createNamespace(): Parser.NS {
    return {
      $ns: Symbol('ns'),
      scope: {},
    };
  }

  emitEntryFeature({ feature, name, ref, node, nodeType = node, nodeComment = node }: Parser.EmitEntryFeatureOptions) {
    switch (feature) {
      case Feature.computed:
        this.parsers.computed.sync().parseComputedValue({
          name,
          node: node,
          nodeTyping: nodeType,
          nodeComment: nodeComment,
          type: ref.type,
        });
        break;

      case Feature.data:
        this.parsers.data.sync().parseDataValueRaw({
          name,
          value: ref,
          nodeTyping: nodeType,
          nodeComment: nodeComment,
          type: ref.type,
        });
        break;

      case Feature.props:
        this.emitEntryFeatureProps(name, ref.type, node, ref.raw);
        break;

      case Feature.events:
        this.parsers.events.sync().parse(node);
        break;

      case Feature.methods:
        if (!(node as any).key) {
          (node as any).key = (node as any).id || { name };
        }

        this.parsers.methods.sync().parseMethodProperty(node, node, node);
        break;
    }
  }

  emitEntryFeatureProps(name: string, type: Parser.Type | Parser.Type[], node: Babel.Node, raw: string) {
    switch (node.type) {
      case Syntax.ObjectExpression:
      case Syntax.ArrayExpression:
        this.parsers.props.sync().parse(node);
        break;

      default:
        this.parsers.props.sync().parseItem(node, name, type, raw);
        break;
    }
  }

  emitScopeEntry(feature: Parser.CompositionFeature, ref: Parser.ScopeEntry<any, any, any>) {
    this.emitEntryFeature({
      feature,
      name: ref.key,
      ref: ref.value,
      node: ref.node.value,
      nodeType: ref.node.type,
      nodeComment: ref.node.comment,
    });
  }

  setValue(key: string, ref: Parser.Value<any>, node: Babel.Node) {
    this.setScopeValue(key, node, ref);
  }

  setScopeEntry(ref: Parser.ScopeEntry) {
    this.scope[ref.key] = ref;
  }

  parse(_node: ParseNode) {
    this.parseAst(this.source.ast.program);
  }

  parseCommentNode(node: Babel.Node) {
    const comment = this.findComment(node);

    if (comment) {
      const { description, keywords } = CommentParser.parse(comment);

      this.parseComment(description, keywords);
    }
  }

  parseComment(description: string, keywords: Entry.Keyword[]) {
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

  parseAst(node: Parser.AST.Program) {
    node.body.forEach((item) => this.parseAstStatement(item));
  }

  parseAstStatement(item: Parser.AST.Statement) {
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

      case Syntax.TSDeclareFunction:
        this.parseTSDeclareFunction(item);
        break;

      case Syntax.TSEnumDeclaration:
        this.parseTSEnumDeclaration(item);
        break;
    }
  }

  parseTSTypeAliasDeclaration(item: TSTypeAliasDeclaration) {
    const tsValue = this.getTSValue(item.typeAnnotation);

    this.setScopeValue(item.id.name, item.typeAnnotation, generateUndefineValue.next().value, { tsValue });
  }

  parseTSInterfaceDeclaration(item: TSInterfaceDeclaration) {
    const tsValue = this.getTSValue(item);

    this.setScopeValue(item.id.name, item.body, generateUndefineValue.next().value, { tsValue });
  }

  parseTSDeclareFunction(item: TSDeclareFunction) {
    const tsValue = this.getTSValue(item);

    this.setScopeValue(item.id.name, item, generateUndefineValue.next().value, { tsValue });
  }

  parseTSEnumDeclaration(item: TSEnumDeclaration) {
    const tsValue = this.getTSValue(item);

    this.setScopeValue(item.id.name, item, generateUndefineValue.next().value, { tsValue });
  }

  parseImportDeclaration(node: ImportDeclaration) {
    if (node.importKind === 'value') {
      for (const specifier of node.specifiers) {
        this.imports[specifier.local.name] = new Import(
          this.fs,
          specifier,
          node,
          this.file,
          this.createRegister,
          this.options.resolver
        );
      }
    }

    if (node.importKind === 'value') {
      for (const item of node.specifiers) {
        if ('imported' in item) {
          this.syncImportDeclarationCompositions(item);
        }
      }
    }
  }

  syncImportDeclarationCompositions(item: Babel.ImportSpecifier) {
    const imported = 'name' in item.imported ? item.imported.name : item.imported.value;
    const local = item.local.name;

    if (imported !== local) {
      this.composition.createAlias(imported, local);
    }
  }

  parseIdentifier(identifier: Pick<Babel.Identifier, 'name'>) {
    this.parseIdentifierName(identifier.name);
  }

  getCompositionValue(options: CompositionValueOptions) {
    const result = super.getCompositionValue(options);

    if ('callee' in options.init && 'name' in options.init.callee && options.init.callee.name === result.composition?.fname) {
      this.parseIdentifierName(options.init.callee.name, options);

      if (options.init.callee.name in this.scope) {
        const ref = this.getScopeValue(options.init.callee.name);

        if (ref?.value.type === Type.function && result.composition?.feature !== Feature.methods) {
          this.parseCompositionTypeParameters(options.init as any);

          const tsValue = this.getTSValue(ref.node.value);
          const value = generateUndefineValue.next().value;

          if (options.key) {
            if (typeof tsValue.type === 'object') {
              value.type = Array.isArray(tsValue.type) ? tsValue.type : tsValue.type[options.key];
              result.node = tsValue.node[options.key];
            }
          } else if (options.id.type === Syntax.Identifier || options.id.type === Syntax.ObjectProperty) {
            value.type = ScriptParser.parseTsValueType(tsValue);

            if (!Array.isArray(tsValue.node)) {
              result.node = tsValue.node as Babel.Node;
            }
          }

          if (result.ref) {
            result.ref.type = value.type;
          } else {
            result.ref = value;
            result.tsValue = tsValue;
          }
        } else if (result.ref) {
          result.ref.type = ref.value.type;
        } else {
          result.ref = ref.value;
          result.tsValue = ref.tsValue;
        }

        if (result.node) {
          result.ref.function = ScriptParser.isFunction(result.node) || ScriptParser.isTsFunction(result.node);
        }
      }
    }

    return result;
  }

  parseIdentifierImport(node: Babel.Identifier) {
    if (node.name in this.imports && !(node.name in this.scope)) {
      this.parseIdentifierName(node.name, {
        key: node.name,
      });
    }
  }

  getIdentifierValue(node: Babel.Identifier): Parser.Value<any> | Parser.NS {
    this.parseIdentifierImport(node);

    return super.getIdentifierValue(node);
  }

  getIdentifier(node: Babel.Identifier): Parser.ScopeEntry | Parser.NS | null {
    this.parseIdentifierImport(node);

    if (node.name in this.scope) {
      return this.scope[node.name];
    }

    return null;
  }

  setScopeValue(key: string, node, value: Parser.Value<any>, options = {}) {
    if (node.type === Syntax.Identifier) {
      const identifier = this.getIdentifier(node);

      if (identifier && 'node' in identifier) {
        node = identifier.node.value;
      }
    }

    super.setScopeValue(key, node, value, options);
  }

  parseIdentifierName(fname: string, { key, local }: Pick<CompositionValueOptions, 'key' | 'local'> = {}) {
    let node: Babel.Node;
    const ref = this.getScopeValue(fname);

    if (ref) {
      const nodeValue: Babel.Node = ref.node.value;

      if (nodeValue.type !== Syntax.Identifier) {
        node = nodeValue;
      }
    }

    if (!node && fname in this.imports) {
      const importVar = this.imports[fname];

      try {
        importVar.load();

        if (importVar.specifier.ns) {
          this.scope[fname] = importVar.specifier.ns;

          return;
        }

        if (importVar.specifier.scopeEntry) {
          this.scope[fname] = importVar.specifier.scopeEntry;
          node = importVar.specifier.scopeEntry.node.value;

          if (node.type === Syntax.VariableDeclarator && node.init) {
            importVar.specifier.scopeEntry.node.value = node.init;
            node = node.init;
          }
        }
      } catch (err) {
        this.emitError(err.message);
      }
    }

    if (node && !node.extra?.$loaded) {
      node.extra.$loaded = true;

      if ('body' in node) {
        const register = this.createRegister();

        register.parseAst(node);
        Object.entries(register.exposedScope).forEach(([name, exposedScopeEntry]) => {
          if ((key && name !== key) || ('$ns' in exposedScopeEntry)) {
            return;
          }

          if (name in this.scope) {
            const scopeEntry = this.getScopeValue(local || name);

            if (scopeEntry) {
              const leftSidePart = this.getLeftSidePart(scopeEntry.node.value);

              scopeEntry.value = exposedScopeEntry.value;
              scopeEntry.node.type = exposedScopeEntry.node.type;
              scopeEntry.node.value = exposedScopeEntry.node.value;
              scopeEntry.composition = exposedScopeEntry.composition;

              if (ScriptParser.isFunction(scopeEntry.node.value)) {
                scopeEntry.value.type = Type.function;
              }

              if (!ScriptParser.hasComments(scopeEntry.node.comment)) {
                scopeEntry.node.comment = exposedScopeEntry.node.comment;
              }

              if (!ScriptParser.hasComments(scopeEntry.node.comment)) {
                if (leftSidePart?.declarator.init?.type === Syntax.CallExpression) {
                  if (ScriptParser.hasComments(leftSidePart.parent)) {
                    scopeEntry.node.comment = leftSidePart.parent;
                  }
                }
              }
            }
          } else {
            this.scope[local || name] = exposedScopeEntry;
          }
        });
      } else if (node.type === Syntax.TSDeclareFunction) {
        const ref = this.getTSValue(node);

        if (typeof ref.type === 'object') {
          for (const name in ref.type as object) {
            if (key && name !== key) {
              continue;
            }

            const type = ref.type[name];
            const value = DTS.parseValue(type);
            const itemNode = ref.node[name];
            const tsValue = this.getTSValue(itemNode);
            const isFunction = ScriptParser.isTsFunction(itemNode);
            const refNode = isFunction ? tsValue.node : itemNode;

            itemNode.extra.$composition = {
              fname: fname,
            } as Parser.CompositionDeclaration;

            this.scope[local || name] = {
              key: local || name,
              source: key,
              value,
              tsValue,
              function: isFunction,
              computed: itemNode.computed || itemNode.extra.computed,
              node: {
                value: refNode,
                type: refNode,
                comment: refNode,
              },
            };
          }
        }
      } else if (!(fname in this.scope)) {
        if (node.type === Syntax.VariableDeclarator && node.init) {
          node = node.init;
        }

        const value = this.getValue(node);

        this.setScopeValue(fname, node, value);
      }
    }
  }

  parseImportedDeclarator(declarator: Babel.VariableDeclarator) {
    if (declarator.init?.type === Syntax.CallExpression && 'name' in declarator.init.callee) {
      this.parseIdentifier(declarator.init.callee);
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

  parseMixinItem(node, mixinNode) {
    if (mixinNode.type === Syntax.Identifier) {
      this.parseIdentifier(mixinNode);
    }

    const baseNode = this.getScopeValue(mixinNode.name);

    if (baseNode?.node.value.type === Syntax.ObjectExpression) {
      node.properties.unshift(...baseNode.node.value.properties);
    }
  }

  parseExtendsProperty(node) {
    const property = node.properties.find((property) => property.key.name === Properties.extends);

    if (property?.value) {
      this.parseMixinItem(node, property.value);
    }
  }

  parseMixinsProperty(node) {
    const property: Babel.ObjectProperty = node.properties.find((property) => property.key.name === Properties.mixins);

    if (property && 'value' in property) {
      if (property.value.type === Syntax.ArrayExpression) {
        for (const item of property.value.elements) {
          this.parseMixinItem(node, item);
        }
      }
    }
  }

  parseObjectExpression(node: Babel.ObjectExpression) {
    this.parseMixinsProperty(node);
    this.parseExtendsProperty(node);

    const properties = this.parseElements(node.properties)
      .filter((property) => 'name' in property.key && property.key.name in Properties);

    for (const property of properties) {
      if ('value' in property) {
        if (typeof property.value === 'object') {
          switch (property.value.type) {
            case Syntax.Identifier:
              this.parseIdentifier(property.value);
              break;

            case Syntax.CallExpression: {
              const found = this.executeCallExpressionProperty(property.value, property);

              if (found) {
                continue;
              }
              break;
            }
          }
        }
      }

      this.parseFeature(property);
    }
  }

  parseElements<T extends Babel.Expression | Babel.ObjectProperty | Babel.ObjectMethod | Babel.SpreadElement>(elements: T[]) {
    return elements.reduce((accumulator, item) => {
      const node = item.type === Syntax.SpreadElement ? item.argument : item;

      switch (node.type) {
        case Syntax.Identifier: {
          const ref = this.getIdentifier(node);

          if ('node' in ref) {
            accumulator.push(...this.parseElements([ref.node.value as any]));
          }
          break;
        }

        case Syntax.ObjectExpression:
          accumulator.push(...this.parseElements(node.properties) as any);
          break;

        case Syntax.CallExpression:
          this.executeCallExpressionProperty(node, item);
          break;

        default:
          accumulator.push(item as Exclude<T, Babel.SpreadElement>);
          break;
      }

      return accumulator;
    }, [] as Array<Exclude<T, Babel.SpreadElement>>);
  }

  executeCallExpressionProperty(node: Babel.CallExpression, parent: Babel.Node) {
    const value = this.getCompositionValue({
      id: parent,
      init: node,
    });

    if (value.composition) {
      if (typeof value.composition.parseEntryNode === 'function') {
        value.composition.parseEntryNode(node, this);

        return true;
      }
    }

    return false;
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

      case Syntax.Identifier: {
        const ref = this.getScopeValue(node.name);

        if (ref) {
          this.parseExportDefaultDeclaration(ref.node.value);
        }
        break;
      }

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

      new ClassComponentParser(this, this.emitter, this.source, this.file, this.options).parse(node);
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

  parseCallExpressionAsFeature(feature: Parser.Feature, node: Babel.CallExpression) {
    if (node.arguments.length) {
      this.parsers[feature].sync().parse(node.arguments[0]);
    }
  }

  parseFeature(property: Babel.ObjectMethod | Babel.ObjectProperty) {
    if ('name' in property.key) {
      if (property.type === Syntax.ObjectProperty) {
        if (property.value.type === Syntax.ObjectExpression) {
          property.value.properties = this.parseElements(property.value.properties);
        }
      }

      switch (property.key.name) {
        case Properties.name:
          if (this.features.includes(Feature.name)) {
            new NameParser(this, this.emitter, this.source, this.scope).parse(property);
          }
          break;

        case Properties.inheritAttrs:
          if (property.type === Syntax.ObjectProperty) {
            new InheritAttrsParser(this, this.emitter, this.source, this.scope).parse(property);
          }
          break;

        case Properties.model:
          if (this.features.includes(Feature.props)) {
            new ModelParser(this, this.emitter, this.source, this.scope).parse(property);
          }
          break;

        case Properties.mixins:
          // already parsed on parseObjectExpression()
          break;

        case Properties.data:
          this.parsers.data.sync().parse(property);
          break;

        case Properties.props:
          if (this.features.includes(Feature.props)) {
            if (property.type === Syntax.ObjectProperty) {
              this.parsers.props.sync().parse(property.value);
            }
          }
          break;

        case Properties.computed:
          if (this.features.includes(Feature.computed)) {
            if (property.type === Syntax.ObjectProperty) {
              if (property.value?.type === Syntax.CallExpression) {
                this.parseCallExpressionAsFeature(Feature.computed, property.value);
              } else {
                this.parsers.computed.sync().parse(property.value);
              }
            }
          }
          break;

        case Properties.watch:
          if (this.features.includes(Feature.events) && this.enableNestedEventsParsing) {
            if (property.type === Syntax.ObjectProperty && property.value.type === Syntax.ObjectExpression) {
              property.value.properties
                .filter((property) => ('value' in property && ScriptParser.isFunction(property.value)) || ScriptParser.isFunction(property))
                .forEach((watcher) => this.parsers.events.sync().parse(watcher));
            }
          }
          break;

        case Properties.template:
          new InlineTemplateParser(this, this.emitter, this.source, this.scope).parse(property);
          break;

        case Properties.methods:
          if (property.type === Syntax.ObjectProperty) {
            if (property.value.type === Syntax.CallExpression) {
              this.parseCallExpressionAsFeature(Feature.methods, property.value);
            } else {
              this.parsers.methods.sync().parse(property.value);
            }
          }
          break;

        case Properties.render:
          new JSXParser(this, this.emitter, this.source, this.scope).parse(property);
          break;

        default:
          if (this.features.includes(Feature.events) && this.enableNestedEventsParsing) {
            this.parsers.events.sync().parse(property);
          }
          break;
      }
    }
  }
}
