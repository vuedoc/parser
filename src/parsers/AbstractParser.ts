import { Value, generateUndefineValue, generateNullGenerator, generateObjectGenerator, generateArrayGenerator, generateAnyGenerator } from '../entity/Value.js';
import { Syntax, Type, CompositionTypes, Feature, CompositionFeature } from '../lib/Enum.js';
import { clear, get } from '@b613/utils/lib/object.js';
import { Entry } from '../../types/Entry.js';
import { Parser } from '../../types/Parser.js';
import { FileSystem } from '../../types/FileSystem.js';
import { Composition } from '../lib/Composition.js';
import { PropType } from '@b613/utils/typings.js';
import { DTS } from '../lib/DTS.js';

import * as Babel from '@babel/types';

export type CompositionValueOptions = Required<Pick<Babel.VariableDeclarator, 'init'>> & {
  key?: string;
  local?: string;
  id: {
    type: Babel.Node['type'];
    typeAnnotation?: Babel.Node;
    extra?: Partial<PropType<Parser.AST.Node, 'extra'>>;
  };
};

type CompositionValue = {
  ref?: Parser.Value<any>;
  node?: Babel.Node;
  argument?: Babel.Node;
  tsValue?: Parser.AST.TSValue;
  composition?: Parser.CompiledComposition;
};

const NATIVE_OBJECTS = ['Symbol', 'BigInt', 'Boolean', 'Number'];
const DUPLICATED_SPACES_RE = /\s+/g;
const BOOLEAN_OPERATORS = ['&&', '||', '==', '===', '!=', '!==', 'in', 'instanceof', '>', '>=', '<', '<='];
const BITWISE_OPERATORS = ['&', '|', '^', '<<', '>>', '>>>', '|>'];
const NUMERIC_OPERATORS = ['*', '+', '-', '/', '**', '%'];
const IGNORED_SCOPED_TYPES: string[] = [Type.any, Type.unknown];

const FUNCTION_EXPRESSIONS = [
  Syntax.ObjectMethod,
  Syntax.ClassMethod,
  Syntax.ClassPrivateMethod,
  Syntax.ObjectMethod,
  Syntax.FunctionExpression,
  Syntax.ArrowFunctionExpression,
  Syntax.FunctionDeclaration,
  Syntax.TSDeclareMethod,
  Syntax.TSDeclareFunction,
  Syntax.TSFunctionType,
];

const TS_FUNCTION_EXPRESSIONS = [
  Syntax.TSDeclareMethod,
  Syntax.TSDeclareFunction,
  Syntax.TSFunctionType,
  Syntax.TSDeclareFunction,
];

export function* generateName(prefix: string): Generator<string, string> {
  let index = 0;

  while (true) {
    yield `${prefix}$${index++}`;
  }
}

const LEFT_SIDEPART_KEY = '$leftSidePart';
const generateObjectName = generateName('object');
const generateArrayName = generateName('array');

function normalizeType(item: { type: Parser.Type | Parser.Type[] }) {
  item.type = item.type instanceof Array
    ? item.type.map(Value.parseNativeType)
    : Value.parseNativeType(item.type);
}

function copyComments(dest: Babel.Node, source: Babel.Node) {
  if (source.extra.comment && !dest.extra.comment) {
    dest.extra.comment = source.extra.comment;
  }
}

export class AbstractParser<Source extends Parser.Source, Root> {
  readonly fs: FileSystem;
  root: Root;
  emitter: Parser.Interface;
  source: Source;
  features: Parser.Feature[];
  parserOptions: Parser.Options;
  scope: Parser.Scope<any, any>;
  private scopeRef: Parser.Scope<any, any>;
  composition: Composition;

  constructor(root: Root, emitter: Parser.Interface, source: Source, scope: Parser.Scope<any, any>) {
    this.root = root;
    this.emitter = emitter;
    this.source = source;
    this.parserOptions = emitter.options;
    this.composition = emitter.composition;
    this.features = emitter.features;
    this.fs = emitter.fs;
    this.scopeRef = scope;
    this.scope = { ...scope };
  }

  static isFunction(node: { type: string }) {
    return FUNCTION_EXPRESSIONS.includes(node.type);
  }

  static isTsFunction(node: Babel.Node) {
    if (TS_FUNCTION_EXPRESSIONS.includes(node.type)) {
      return true;
    }

    if ('typeAnnotation' in node) {
      return AbstractParser.isTsFunction(node.typeAnnotation);
    }

    return false;
  }

  static hasComments(node: Babel.Node) {
    // TODO Handle node.innerComments
    return 'leadingComments' in node || 'trailingComments' in node;
  }

  reset() {
    clear(this.scope);
    Object.assign(this.scope, this.scopeRef);
  }

  sync(scope: Parser.Scope<any, any> = {}) {
    this.scope = { ...this.scopeRef, ...this.scope, ...scope };

    return this;
  }

  emit(entry: Entry.Type) {
    if (this.root) {
      if ('type' in entry) {
        normalizeType(entry);
      }

      if ('params' in entry) {
        entry.params.forEach(normalizeType);
        normalizeType(entry.returns);
      }

      if ('arguments' in entry) {
        entry.arguments.forEach(normalizeType);
      }

      (this.root as any).emit(entry);
    }
  }

  emitWarning(message: string) {
    this.emitter.emitWarning(message);
  }

  emitError(message: string) {
    this.emitter.emitError(message);
  }

  parse(node) {
    switch (node.type) {
      case Syntax.ObjectProperty:
        this.parseObjectProperty(node);
        break;

      case Syntax.ObjectExpression:
        this.parseObjectExpression(node);
        break;

      case Syntax.CallExpression:
        this.parseCallExpression(node);
        break;

      case Syntax.ArrayExpression:
        this.parseArrayExpression(node);
        break;

      case Syntax.Identifier:
        this.parseIdentifier(node);
        break;

      case Syntax.ExpressionStatement:
        this.parseExpressionStatement(node);
        break;

      default:
        if (AbstractParser.isFunction(node)) {
          this.parseFunctionExpression(node.body);
        }
        break;
    }
  }

  parseFunctionDeclaration(node: Babel.FunctionDeclaration) {
    this.registerFunctionDeclaration(node);
  }

  registerFunctionDeclaration(node) {
    if (node.id) {
      const fname = this.parseKey(node);
      const value = generateUndefineValue.next().value;

      this.setScopeValue(fname, node, value);
    }
  }

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseEntryComment(_entry: Entry.Type, _node) {}

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseArrayExpression(_node: Babel.ArrayExpression) {}

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseCallExpression(_node: Babel.CallExpression) {}

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseFunctionExpression(_node: Babel.FunctionExpression) {}

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseExpressionStatement(_node: Babel.ExpressionStatement) {}

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseObjectExpression(_node: Babel.ObjectExpression) {}

  parseObjectProperty(node: Babel.ObjectProperty) {
    this.parse(node.value);
  }

  parseIdentifier(node: Babel.Identifier) {
    const ref = this.getScopeValue(node.name);

    if (ref && ref.node.value !== node) {
      this.parse(ref.node.value);
    }
  }

  parseVariableDeclaration(node: Parser.AST.VariableDeclaration) {
    node.declarations
      .filter(({ type }) => type === Syntax.VariableDeclarator)
      .forEach((declaration) => this.parseVariableDeclarator(declaration, node));
  }

  parseNonCompositionRef(decoratorValue: CompositionValue, ref: Parser.Value<any>, nodeTyping: Babel.Node, initNode: Babel.Node) {
    if (!decoratorValue.composition) {
      const tsType = this.getTSType(nodeTyping, this.getNodeType(initNode));

      if (tsType !== Type.unknown) {
        ref.type = tsType;
      }
    }
  }

  parseVariableDeclarator(declarator: Parser.AST.VariableDeclarator, node: Parser.AST.VariableDeclaration) {
    if (declarator.init) {
      this.setLeftSidePart(declarator.init, node, declarator);
    }

    switch (declarator.id.type) {
      case Syntax.ArrayPattern:
        this.parseVariableDeclarationArrayPattern(declarator, declarator.id);
        break;

      case Syntax.ObjectPattern:
        this.parseVariableDeclarationObjectPattern(declarator, declarator.id);
        break;

      default: {
        const name = declarator.id.name;
        const decoratorValue = this.getDeclaratorValue({
          id: declarator.id as any,
          init: declarator.init,
        });

        const ref = decoratorValue.ref || generateUndefineValue.next().value;
        const initNode = declarator.init ? declarator.init : declarator;
        const nodeValue = decoratorValue.argument || initNode;
        const nodeComment = node.declarations.length > 1 ? declarator : node;
        const nodeTyping = declarator.init && 'typeParameters' in declarator.init
          ? declarator.init.typeParameters
          : 'typeAnnotation' in declarator.id
            ? declarator.id?.typeAnnotation
            : declarator;

        this.parseNonCompositionRef(decoratorValue, ref, nodeTyping, initNode);
        this.setScopeValue(name, nodeValue, ref, {
          nodeTyping,
          nodeComment,
          tsValue: decoratorValue.tsValue,
          composition: decoratorValue.composition,
          isFunction: AbstractParser.isFunction(initNode) || AbstractParser.isTsFunction(initNode),
        });
        break;
      }
    }
  }

  parseVariableDeclarationArrayPattern(declarator: Parser.AST.VariableDeclarator, id: Babel.ArrayPattern) {
    const array = generateArrayGenerator.next().value;

    declarator.id.name = generateArrayName.next().value;

    this.setScopeValue(declarator.id.name, declarator.init, array);
    this.parseVariableDeclarationElements(id.elements, declarator as any);
  }

  parseVariableDeclarationObjectPattern(declarator: Parser.AST.VariableDeclarator, id: Babel.ObjectPattern) {
    const object = generateObjectGenerator.next().value;

    declarator.id.name = generateObjectName.next().value;

    this.setScopeValue(declarator.id.name, declarator.init, object);
    this.parseVariableDeclarationElements(id.properties, declarator as any);
  }

  getVariableDeclarationElementIdentifier(
    key: string | number,
    options: CompositionValueOptions,
    defaultValue?: Parser.Value<any>
  ) {
    const decoratorValue = this.getDeclaratorValue({
      init: options.init,
      id: options.id as any,
    });

    const memberObject = decoratorValue?.ref || this.getValue(options.init);
    const memberValue = memberObject?.value ? memberObject?.value[key] : undefined;

    if (typeof memberValue === 'undefined' && defaultValue) {
      return defaultValue;
    }

    const memberType = memberValue === null || memberValue === undefined ? Type.unknown : typeof memberValue;
    const memberRawValue = JSON.stringify(memberValue) || '';

    return new Value(memberType, memberValue, memberRawValue);
  }

  parseVariableDeclarationElements(
    // eslint-disable-next-line max-len
    elements: Array<Babel.ObjectProperty | Babel.ObjectMethod | Babel.SpreadElement | Babel.Identifier | Babel.MemberExpression | Babel.AssignmentPattern | Babel.ArrayPattern | Babel.ObjectPattern | Babel.TSParameterProperty | Babel.TSAsExpression | Babel.TSTypeAssertion | Babel.TSNonNullExpression | Babel.RestElement>,
    options: CompositionValueOptions
  ) {
    for (let index = 0; index < elements.length; index++) {
      const element = elements[index];

      if (element === null) {
        continue;
      }

      switch (element.type) {
        case Syntax.Identifier: {
          const name = element.name;
          const memberRef = this.getVariableDeclarationElementIdentifier(index, options);

          this.setScopeValue(name, element, memberRef);
          break;
        }

        case Syntax.AssignmentPattern: {
          const name = this.getValue(element.left).value;
          const defaultValue = this.getValue(element.right);
          const memberRef = this.getVariableDeclarationElementIdentifier(index, options, defaultValue);

          this.setScopeValue(name, element, memberRef);
          break;
        }

        case Syntax.ArrayPattern: {
          const tsValue = this.getTSValue(options.init);
          const node = tsValue.kind === Type.array && 'elements' in tsValue.node ? (tsValue.node as Babel.ArrayExpression).elements[index] : {
            type: Syntax.NullLiteral,
          };

          this.parseVariableDeclarationElements(element.elements, {
            id: element,
            init: node as any,
          });
          break;
        }

        case Syntax.ObjectProperty: {
          let name: string | undefined;
          let source: string;
          let nodeComment;
          let defaultValue: Value | undefined;
          let defaultNode: Babel.Expression | undefined;

          if ('key' in element) {
            source = this.parseKey(element);
          }

          switch (element.value.type) {
            case Syntax.Identifier:
              name = element.value.name;
              nodeComment = element;
              break;

            case Syntax.AssignmentPattern:
              name = this.getValue(element.value.left).value;
              nodeComment = element.value.left;
              defaultValue = this.getValue(element.value.right);
              defaultNode = element.value.right;
              break;

            case Syntax.ObjectPattern: {
              const tsValue = this.getTSValue(options.init);
              const properties = 'type' in tsValue.node && tsValue.node.type === Syntax.ObjectExpression
                ? tsValue.node.properties
                : [];
              const node: Babel.ObjectProperty | null = properties.find((property) => this.parseKey(property as any) === source) as any || null;

              this.parseVariableDeclarationElements(element.value.properties, {
                id: element,
                init: node?.value as any,
              });

              name = null;
              break;
            }
          }

          if (name) {
            switch (options.init.type) {
              case Syntax.MemberExpression: {
                const memberKey = source || name;
                const memberValue = this.getMemberValue(options.init, memberKey)
                  || defaultValue
                  || generateUndefineValue.next().value;
                const memberNode = memberValue === defaultValue ? defaultNode : element;

                this.setScopeValue(name, memberNode, memberValue, { source, nodeComment });
                break;
              }

              case Syntax.ArrayExpression: {
                break;
              }

              case Syntax.ObjectExpression: {
                const propertyValue: Babel.ObjectProperty = options.init.properties.find((item) => {
                  return 'key' in item && this.getValue(item.key).value === name;
                }) || defaultNode as any;

                if (defaultValue && defaultValue.raw !== Type.undefined) {
                  this.setScopeValue(name, propertyValue, defaultValue, { source, nodeComment });
                } else if (propertyValue) {
                  const ref = 'value' in propertyValue
                    ? this.getValue(propertyValue.value)
                    : generateUndefineValue.next().value;

                  this.setScopeValue(name, propertyValue, ref, { source, nodeComment });
                } else {
                  const ref = generateUndefineValue.next().value;

                  this.setScopeValue(name, options.init, ref, { source, nodeComment });
                }
                break;
              }

              default: {
                const decoratorValue = this.getDeclaratorValue({
                  key: source,
                  local: name,
                  init: options.init,
                  id: options.id,
                });

                const ref = defaultValue || decoratorValue.ref || generateUndefineValue.next().value;
                const initNode = decoratorValue.node || element;
                const nodeValue = decoratorValue.argument || initNode;

                element.extra.$declarator = options;

                if (decoratorValue.node) {
                  copyComments(nodeComment, decoratorValue.node);
                }

                this.parseNonCompositionRef(decoratorValue, ref, element, initNode);
                this.setScopeValue(name, nodeValue, ref, {
                  source,
                  nodeComment,
                  nodeTyping: element,
                  composition: decoratorValue.composition,
                  tsValue: decoratorValue.tsValue,
                });
                break;
              }
            }
          }
          break;
        }

        case Syntax.RestElement:
        case Syntax.SpreadElement:
          this.parseVariableDeclarationElementsRest(element, options);
          break;
      }
    }
  }

  parseVariableDeclarationElementsRest(
    element: Babel.RestElement | Babel.SpreadElement,
    options: CompositionValueOptions
  ) {
    switch (element.argument.type) {
      case Syntax.Identifier: {
        const decoratorValue = this.getDeclaratorValue({
          init: options.init,
          id: options.id as any,
        });

        const rest = decoratorValue.ref || this.getValue(options.init);

        this.setScopeValue(element.argument.name, element, rest, {
          nodeTyping: element,
          composition: decoratorValue.composition,
          tsValue: decoratorValue.tsValue,
        });
        break;
      }
    }
  }

  setScopeValue(
    key: string,
    node,
    value: Parser.Value<any>,
    {
      source = undefined,
      nodeComment = node,
      nodeTyping = node,
      isFunction = false,
      forceType = false,
      global = false,
      tsValue = undefined,
      composition = undefined,
    } = {}
  ) {
    if (!forceType) {
      const ref = this.getScopeValue(key);

      if (ref && ref.value.type !== value.type) {
        if ((typeof ref.value.type === 'string' && !IGNORED_SCOPED_TYPES.includes(ref.value.type))
          || (ref.value.type instanceof Array && ref.value.type.some((item) => !IGNORED_SCOPED_TYPES.includes(item)))
        ) {
          value.type = Type.unknown;
        }
      }
    }

    const scopeValue: Parser.ScopeEntry = {
      key,
      value,
      source,
      tsValue,
      function: isFunction || value.function,
      computed: node.computed || node.extra.computed,
      composition,
      node: {
        type: nodeTyping || node,
        value: node,
        comment: nodeComment || node,
      },
    };

    if (source) {
      scopeValue.source = source;
    }

    if (key in this.scope) {
      const ref = this.getScopeValue(key);

      if (ref?.composition) {
        scopeValue.composition = { ...scopeValue.composition, ...ref.composition };
      }
    }

    this.scope[key] = scopeValue;

    if (global && this.root) {
      (this.root as any).scope[key] = this.scope[key];
    }
  }

  getScopeValue(key: string): Parser.ScopeEntry<any, any, any> | null {
    if (key in this.scope) {
      const ref = this.scope[key];

      if ('node' in ref) {
        return ref;
      }
    }

    return null;
  }

  setLeftSidePart(node: Babel.Expression, parent: Parser.AST.VariableDeclaration, declarator: Parser.AST.VariableDeclarator) {
    node.extra[LEFT_SIDEPART_KEY] = { declarator, parent };
  }

  getLeftSidePart<T = null>(node, defaultResult: T = null): T | { parent: Babel.Node, declarator: Parser.AST.VariableDeclarator } {
    return node.extra[LEFT_SIDEPART_KEY] || defaultResult;
  }

  hasLeftSidePart(node: Parser.AST.Node) {
    return LEFT_SIDEPART_KEY in node.extra;
  }

  getReturnNode(node: Babel.Node): Babel.Node | null {
    const _node = node as any;

    if (AbstractParser.isFunction(_node)) {
      const blockNode = _node.body?.body || _node.body;
      const returnNode: Babel.Node = blockNode instanceof Array
        ? blockNode.length === 1 ? blockNode[0] : blockNode.find((node) => node.type === Syntax.ReturnStatement)
        : blockNode;

      return returnNode?.type === Syntax.ReturnStatement ? returnNode.argument : returnNode;
    }

    return null;
  }

  getReturnType(node: Babel.Node, defaultType: Parser.Type = Type.unknown): Parser.Type | Parser.Type[] {
    let type: Parser.Type | Parser.Type[] = defaultType;
    const _node = node as any;

    if (_node.returnType) {
      type = this.getValue(_node.returnType.typeAnnotation).value;
    } else if (_node.typeAnnotation?.typeAnnotation) {
      type = _node.typeAnnotation.typeAnnotation.type === Syntax.TSFunctionType
        ? this.getTSValue(_node.typeAnnotation.typeAnnotation.typeAnnotation).type as string
        : this.getTSValue(_node.typeAnnotation.typeAnnotation).type as string;
    } else if (AbstractParser.isFunction(node)) {
      const returnNode: Babel.Node = this.getReturnNode(node);

      if (returnNode) {
        switch (returnNode.type) {
          case Syntax.Identifier:
            type = this.getValue(returnNode).type;
            break;

          case Syntax.MemberExpression:
            type = this.getMemberExpression(returnNode).type;
            break;

          default:
            type = this.getNodeType(returnNode, Type.void);
            break;
        }
      } else {
        type = Type.void;
      }

      if ('async' in node && node.async) {
        type = `${Type.Promise}<${type}>`;
      }
    }

    return type;
  }

  getNodeType(node: Babel.Node, defaultType?: Parser.Type | Parser.Type[]) {
    let type: Parser.Type | Parser.Type[] = defaultType;

    switch (node.type) {
      case Syntax.Identifier: {
        const ref = this.getScopeValue(node.name);

        type = ref ? ref.value.type : this.getValue(node).type;
        break;
      }

      case Syntax.ReturnStatement:
        type = node.argument ? this.getNodeType(node.argument, defaultType) : defaultType;
        break;

      case Syntax.CallExpression:
        type = 'object' in node.callee && 'name' in node.callee.object && node.callee.object.name === 'Math'
          ? Type.number
          : Type.unknown;
        break;

      case Syntax.UpdateExpression:
        type = Type.number;
        break;

      case Syntax.StringLiteral:
      case Syntax.TemplateLiteral:
        type = Type.string;
        break;

      case Syntax.BooleanLiteral:
        type = Type.boolean;
        break;

      case Syntax.LogicalExpression:
      case Syntax.BinaryExpression:
      case Syntax.AssignmentExpression:
        type = this.getExpressionType(node);
        break;

      case Syntax.ConditionalExpression:
        type = this.getConditionalExpressionType(node);
        break;

      case Syntax.NumericLiteral:
        type = Type.number;
        break;

      case Syntax.BigIntLiteral:
        type = Type.bigint;
        break;

      case Syntax.RegExpLiteral:
        type = Type.regexp;
        break;

      case Syntax.ArrayExpression:
        type = DTS.parseType(this.getValue(node));
        break;

      case Syntax.ObjectExpression:
        type = DTS.parseType(this.getValue(node));
        break;

      case Syntax.NullLiteral:
        type = Type.unknown;
        break;

      case Syntax.UnaryExpression:
        type = this.getUnaryExpressionType(node);
        break;

      case Syntax.NewExpression:
        type = 'name' in node.callee
          ? Value.parseNativeType(node.callee.name)
          : Type.unknown;
        break;

      case Syntax.MemberExpression:
        type = this.getMemberExpression(node).type;
        break;

      default:
        if (AbstractParser.isFunction(node)) {
          type = Type.function;
        }
        break;
    }

    return type;
  }

  private getCompositionReturnType(argument: Babel.Node, options: CompositionValueOptions) {
    if ('typeAnnotation' in options.id && options.id.typeAnnotation) {
      return this.getTSValue(options.id.typeAnnotation).type as string;
    }

    if ('returnType' in argument) {
      return this.getTSValue(argument.returnType).type as string;
    }

    return this.getReturnType(argument, Type.unknown);
  }

  getTypeParameterDeclaration(node: Babel.Node): Required<Babel.TypeParameterDeclaration> {
    return 'typeParameters' in node && node.typeParameters && 'params' in node.typeParameters
      ? node.typeParameters as Required<Babel.TypeParameterDeclaration>
      : null;
  }

  getTypeParameterValue(functionDeclaration: Babel.Node, callExpression: Babel.CallExpression) {
    const functionHasTypeParameters = !!this.getTypeParameterDeclaration(functionDeclaration);

    if (functionHasTypeParameters) {
      const callTypeParameters = this.getTypeParameterDeclaration(callExpression);

      if (callTypeParameters) {
        if ('returnType' in functionDeclaration && 'typeAnnotation' in functionDeclaration.returnType && 'typeParameters' in functionDeclaration.returnType.typeAnnotation) {
          const originalParams = [...functionDeclaration.returnType.typeAnnotation.typeParameters.params];

          functionDeclaration.returnType.typeAnnotation.typeParameters.params.splice(
            0,
            callTypeParameters.params.length,
            ...callTypeParameters.params
          );

          const tsValue = this.getTSValue(functionDeclaration, true);

          functionDeclaration.returnType.typeAnnotation.typeParameters.params = originalParams as any;
          delete functionDeclaration.extra.$tsvalue;

          return DTS.parseTsValueType(tsValue);
        }
      }
    }

    return null;
  }

  getCompositionValue(options: CompositionValueOptions): CompositionValue {
    let ref: Parser.Value<any>;
    let refNode: Babel.Node;
    let argumentNode: Babel.Node;
    let tsValue = this.getDeclaratorType(options);
    let fname: string;
    const init: Babel.Node = options.init.type === Syntax.TSAsExpression
      ? options.init.expression
      : options.init;

    if (init.type === Syntax.CallExpression && 'callee' in init && 'name' in init.callee) {
      fname = init.callee.name;
      let composition = this.composition.get(fname, [
        // order is important
        CompositionFeature.props,
        CompositionFeature.data,
        CompositionFeature.computed,
        CompositionFeature.methods,
        CompositionFeature.events,
      ]);

      if (composition) {
        if (composition.returningType) {
          tsValue = {
            type: composition.returningType,
            node: options.id as any,
          };

          ref = generateUndefineValue.next().value;
          ref.type = composition.returningType;
        }

        if (init.typeParameters) {
          if (composition.typeParameterIndex >= 0 && composition.typeParameterIndex < init.typeParameters.params.length) {
            tsValue = this.getTSValue(init.typeParameters.params[composition.typeParameterIndex]);

            if (ref) {
              ref.type = DTS.parseTsValueType(tsValue);
            }
          }
        }

        if (!ref && composition.valueCanBeUndefined) {
          ref = generateUndefineValue.next().value;
        }

        if (typeof tsValue?.type === 'string') {
          const tsref = this.getScopeValue(tsValue.type);

          if (tsref) {
            tsValue = this.getTSValue(tsref.node.value);
          }
        }

        if ('parseEntryValue' in composition && typeof composition.parseEntryValue === 'function') {
          ref = composition.parseEntryValue(init, this as any);
        } else if (typeof composition.valueIndex === 'number' && composition.valueIndex >= 0 && composition.valueIndex < init?.arguments?.length) {
          const argument = init.arguments.at(composition.valueIndex);

          ref = this.getValue(argument);
          argumentNode = argument;

          if (argument.type === Syntax.CallExpression) {
            const nested = this.getCompositionValue({ ...options, init: argument });

            if (nested.ref) {
              ref = nested.ref;
            }

            if (nested.node) {
              argumentNode = nested.node;
            }

            if (nested.tsValue) {
              tsValue = nested.tsValue;
            }

            if (nested.composition) {
              composition = nested.composition;
            }
          }

          if (tsValue) {
            ref.type = this.getTypeParameterValue(argumentNode, init)
              || DTS.parseTsValueType(tsValue);

            if (options.key) {
              if (typeof tsValue.type === 'object') {
                ref.type = Array.isArray(tsValue.type) ? tsValue.type : tsValue.type[options.key];
              }
            } else if (options.id.type === Syntax.Identifier || options.id.type === Syntax.ObjectProperty) {
              ref.type = this.getTypeParameterValue(argumentNode, init)
                || DTS.parseTsValueType(tsValue);
            }
          } else if (composition.feature === Feature.computed) {
            if (AbstractParser.isFunction(argument)) {
              ref.type = this.getCompositionReturnType(argument, options);
            } else if (argument.type === Syntax.ObjectExpression) {
              const property = argument.properties.find((property) => {
                return property.type !== Syntax.SpreadElement && this.parseKey(property) === 'get';
              });

              if (property && AbstractParser.isFunction(property)) {
                ref.type = this.getCompositionReturnType(property, options);
              }
            }
          }
        }

        return this.getCallExpressionComposition(fname, options, { ref, tsValue, composition, node: refNode, argument: argumentNode });
      }
    }

    ref = this.getValue(options.init);
    ref.function = AbstractParser.isFunction(options.init) || AbstractParser.isTsFunction(options.init);

    if (tsValue) {
      ref.type = DTS.parseTsValueType(tsValue);
    }

    if (options.id.type !== Syntax.Identifier && options.init?.type === Syntax.CallExpression) {
      ref.value = '';
      ref.raw = '';
    }

    return fname
      ? this.getCallExpressionComposition(fname, options, { ref, tsValue })
      : {};
  }

  private parseRaw(ref: Parser.Value<any>) {
    if (!ref.rawObject) {
      switch (ref.type) {
        case Type.object:
          ref.rawObject = {};
          break;

        case Type.array:
          ref.rawObject = [];
          break;
      }
    }

    if (!ref.rawNode) {
      switch (ref.type) {
        case Type.object:
          ref.rawNode = {};
          break;

        case Type.array:
          ref.rawNode = [];
          break;
      }
    }
  }

  private parseCallExpressionCompositionKey(options: CompositionValueOptions, result: CompositionValue) {
    if (options.key) {
      if (result.tsValue) {
        const keyType: string | Parser.AST.TSValue = typeof result.tsValue.type === 'string'
          ? result.tsValue.type
          : result.tsValue.type[options.key];

        if (!result.ref) {
          const keyref = this.getScopeValue(options.key);

          if (keyref) {
            result.ref = keyref.value;
            result.tsValue = keyref.tsValue;
            result.node = keyref.node.value;
          } else {
            result.ref = generateUndefineValue.next().value;
          }
        }

        if (typeof result.tsValue.type === 'object' && typeof result.ref.value === 'object') {
          this.parseRaw(result.ref);

          const rawRef = options.key in result.ref.rawObject
            ? result.ref.rawObject[options.key]
            : generateUndefineValue.next().value;

          result.ref.value = rawRef.value;
          result.ref.raw = rawRef.raw;

          if (typeof result.ref.value === 'undefined' && keyType instanceof Array && keyType.includes(Type.undefined)) {
            result.ref.raw = 'undefined';
          }
        }

        if (typeof keyType === 'string' || keyType instanceof Array) {
          result.ref.type = keyType;
        } else {
          result.ref.type = keyType.type as string;
          result.tsValue = keyType;
        }

        result.node = result.tsValue.node[options.key];
      } else if (result.ref?.type === Type.object) {
        this.parseRaw(result.ref);

        result.ref = options.key in result.ref.rawObject
          ? result.ref.rawObject[options.key]
          : generateUndefineValue.next().value;
      }
    }
  }

  private getCallExpressionComposition(fname: string, options: CompositionValueOptions, result: CompositionValue): CompositionValue {
    const refScope = this.getScopeValue(fname);

    if (refScope) {
      if (refScope.value.type === Type.function && result.composition && result.composition?.feature !== Feature.methods) {
        const tsValue = this.getTSValue(refScope.node.value);
        const value = generateUndefineValue.next().value;

        if (options.key) {
          if (typeof tsValue.type === 'object') {
            value.type = Array.isArray(tsValue.type) ? tsValue.type : tsValue.type[options.key];
            result.node = tsValue.node[options.key];
          }
        } else if (options.id.type === Syntax.Identifier || options.id.type === Syntax.ObjectProperty) {
          value.type = this.getTypeParameterValue(refScope.node.value, options.init as Babel.CallExpression) || DTS.parseTsValueType(tsValue);

          if (!Array.isArray(tsValue.node)) {
            result.node = tsValue.node as Babel.Node;
          }
        }

        if (result.ref) {
          result.ref.type = value.type;
        } else {
          result.ref = value;
          result.tsValue = tsValue;
          result.ref.type = this.getTypeParameterValue(refScope.node.value, options.init as Babel.CallExpression)
            || (result.ref.type === Type.unknown ? DTS.parseTsValueType(tsValue) : result.ref.type);
        }
      } else if (result.ref) {
        if (AbstractParser.isFunction(refScope.node.value)) {
          if (options.key) {
            const ref = this.getScopeValue(options.key);

            if (ref && 'node' in ref) {
              result.ref = ref.value;
              result.argument = ref.node.value;
              result.node = ref.node.comment;
            } else {
              const returnNode = this.getReturnNode(refScope.node.value);

              if (returnNode) {
                const returnValue = this.getValue(returnNode);

                if (returnValue.rawObject && options.key in returnValue.rawObject) {
                  result.ref = returnValue.rawObject[options.key];
                  result.argument = returnValue.rawNode[options.key];
                }
              }
            }
          }
        } else if (refScope.value.type === Type.function) {
          result.ref.type = this.getReturnType(refScope.node.value);
        } else if (refScope.value.type !== Type.unknown) {
          result.ref.type = refScope.value.type;
        }
      } else {
        result.ref = generateUndefineValue.next().value;
        result.tsValue = refScope.tsValue;

        if (result.tsValue) {
          result.ref.type = this.getTypeParameterValue(refScope.node.value, options.init as Babel.CallExpression)
            || DTS.parseTsValueType(result.tsValue);
        }
      }
    }

    this.parseCallExpressionCompositionKey(options, result);

    if (!result.ref && result.tsValue) {
      result.ref = DTS.parseValue(result.tsValue.type);
    }

    if (result.tsValue && AbstractParser.isTsFunction(result.tsValue.node as Babel.Node)) {
      result.ref.function = true;
      result.node = result.tsValue.node as Babel.Node;
    } else if (result.ref && result.node) {
      result.ref.function = AbstractParser.isFunction(options.init) || AbstractParser.isTsFunction(options.init);
    }

    return result;
  }

  getDeclaratorValue(options: CompositionValueOptions) {
    let declarationValue: CompositionValue;

    if (options.init) {
      if (options.init.type === Syntax.CallExpression) {
        if ('name' in options.init.callee) {
          declarationValue = this.getCompositionValue(options);

          if (declarationValue.ref) {
            declarationValue.ref.$kind = options.init.callee.name;
          }
        }
      }
    }

    if (!declarationValue) {
      declarationValue = {
        ref: options.init
          ? this.getValue(options.init)
          : generateUndefineValue.next().value,
      };
    }

    return declarationValue;
  }

  getDeclaratorType(options: CompositionValueOptions) {
    let tsValue: Parser.AST.TSValue;

    if ('typeAnnotation' in options.id) {
      tsValue = this.getTSValue(options.id.typeAnnotation);
    }

    if (options.init) {
      if (options.init.type === Syntax.TSAsExpression) {
        tsValue = this.getTSValue(options.init.typeAnnotation);
      }
    }

    return tsValue;
  }

  getTSTypeLiteralValue(node: Babel.TSTypeLiteral) {
    const type = {};
    const members = {};

    for (const member of node.members) {
      const key = this.parseKey(member as any);
      const ts = this.getTSValue(member);

      const ref = this.getScopeValue(key);

      if (ref) {
        ref.node.comment = member;
      }

      member.extra.computed = ts.computed || (member as any).computed;

      members[key] = member;
      type[key] = 'optional' in member && member.optional
        ? [ts.type, Type.undefined]
        : ts.type;
    }

    return { type, members };
  }

  parseAssignmentExpression(node: Babel.AssignmentExpression) {
    if ('name' in node.left) {
      this.setScopeValue(node.left.name, node.right, this.getValue(node.right));
    }
  }

  parseKey({ computed = false, id = undefined, key = id, value = undefined, body = undefined }) {
    const keyName: string = key?.type === Syntax.PrivateName
      ? key.id.name
      : key?.name || key?.value;

    if (computed) {
      const $value = value || body;

      switch (key.type) {
        case Syntax.Identifier:
          if ($value && $value.type !== Syntax.Identifier) {
            const ref = this.getValue(key);

            if (ref.value !== undefined) {
              return `${ref.value}`;
            }
          }
          break;

        case Syntax.CallExpression:
        case Syntax.MemberExpression:
          return this.getValue(key).raw;
      }
    }

    return keyName;
  }

  getTSTypeRaw(node: Babel.Node, defaultType: Parser.Type | Parser.Type[] = Type.unknown) {
    let type = defaultType;

    switch (node.type) {
      case Syntax.TSAsExpression:
      case Syntax.TSTypeAnnotation:
        type = this.getTSType(node.typeAnnotation, defaultType);
        break;

      case Syntax.TSTypeParameterInstantiation:
        if (node.params.length) {
          type = this.getInlineSourceString(node.params[0]);
        }
        break;

      case Syntax.TSFunctionType:
      case Syntax.TSTypeReference:
        type = this.getInlineSourceString(node);
        break;

      case Syntax.TSUnionType:
        type = node.types.map((item) => this.getTSTypeRaw(item));
        break;

      case Syntax.TSDeclareMethod:
      case Syntax.TSDeclareFunction:
        if ('returnType' in node) {
          type = this.getTSTypeRaw(node.returnType, defaultType);
        }
        break;

      default: {
        if ('typeAnnotation' in node && 'typeAnnotation' in node.typeAnnotation) {
          type = this.getInlineSourceString(node.typeAnnotation.typeAnnotation);
        } else if (node.type.startsWith('TS')) {
          type = this.getInlineSourceString(node);
        } else {
          const guestType = this.getNodeType(node, type);

          if (guestType && guestType !== Type.unknown) {
            type = guestType;
          }
        }
        break;
      }
    }

    return type;
  }

  getElementsObjectType(elements: Array<Babel.TSTypeElement | Babel.ObjectProperty | Babel.ObjectMethod>) {
    const type = {};
    const node = {};

    for (const item of elements) {
      const key = this.parseKey(item as any);
      const tsValue = this.getTSValue(item);

      type[key] = tsValue;
      node[key] = item;
    }

    return { type, node };
  }

  getTSValue(node: Babel.Node, force = false): Parser.AST.TSValue {
    if (node.extra.$tsvalue && !force) {
      return node.extra.$tsvalue as Parser.AST.TSValue;
    }

    switch (node.type) {
      case Syntax.TSAsExpression:
      case Syntax.TSTypeAnnotation:
      case Syntax.TSPropertySignature:
        copyComments(node.typeAnnotation, node);
        node.extra.$tsvalue = this.getTSValue(node.typeAnnotation, force);
        break;

      case Syntax.CallExpression:
        if (node.typeParameters) {
          node.extra.$tsvalue = this.getTSValue(node.typeParameters, force);
        }
        break;

      case Syntax.ArrayExpression: {
        const result = this.getElementsObjectType(node.elements as any);

        node.extra.$tsvalue = { kind: Type.array, type: Object.values(result.type), node };
        break;
      }

      case Syntax.ObjectExpression:
        node.extra.$tsvalue = { kind: Type.object, ...this.getElementsObjectType(node.properties as any), node };
        break;

      case Syntax.ObjectMethod:
        node.extra.$tsvalue = { node, kind: Type.function, type: this.getNodeType(node) };
        break;

      case Syntax.ObjectProperty:
        node.extra.$tsvalue = this.getTSValue(node.value, force);
        break;

      case Syntax.TSInterfaceDeclaration:
        node.extra.$tsvalue = { kind: Type.object, ...this.getElementsObjectType(node.body.body) };
        break;

      case Syntax.TSTypeParameterInstantiation:
        if (node.params.length) {
          node.extra.$tsvalue = this.getTSValue(node.params[0], force);
        }
        break;

      case Syntax.TSTypeReference:
        if ('name' in node.typeName && CompositionTypes.includes(node.typeName.name) && node.typeParameters) {
          const ref = this.getTSValue(node.typeParameters, force);

          if (!Array.isArray(ref.node) && ref.node.type === Syntax.TSTypeParameterInstantiation) {
            ref.node = ref.node.params[0];
          }

          node.extra.$tsvalue = { ...ref, computed: true, compositionType: node.typeName.name };
        } else if (node.typeParameters) {
          const typeName = this.getSourceString(node.typeName);
          const params = node.typeParameters.params.map((param) => this.getInlineSourceString(param));

          node.extra.$tsvalue = { node, type: `${typeName}<${params.join(', ')}>` };
        } else {
          node.extra.$tsvalue = { node, type: this.getInlineSourceString(node) };
        }
        break;

      case Syntax.Identifier: {
        const ref = this.getScopeValue(node.name);

        node.extra.$tsvalue = ref
          ? (ref.tsValue ? ref.tsValue : this.getTSValue(ref.node.value, force))
          : { node, type: this.getInlineSourceString(node) };
        break;
      }

      case Syntax.TSUnionType:
        node.extra.$tsvalue = {
          node: node.types,
          type: node.types.map((item) => this.getTSTypeRaw(item)),
        };
        break;

      case Syntax.TSTypeParameter:
        if (node.constraint) {
          node.extra.$tsvalue = this.getTSValue(node.constraint, force);
        } else {
          node.extra.$tsvalue = { type: node.name, node };
        }
        break;

      case Syntax.TSTypeLiteral: {
        const result = this.getTSTypeLiteralValue(node);

        node.extra.$tsvalue = { ...result, node: result.members };
        break;
      }

      case Syntax.TSDeclareMethod:
      case Syntax.TSDeclareFunction:
        if ('returnType' in node) {
          copyComments(node.returnType, node);
          node.extra.$tsvalue = { ...this.getTSValue(node.returnType, force), kind: Type.function };
        }
        break;
    }

    if (!node.extra.$tsvalue) {
      node.extra.$tsvalue = { node, kind: Type.unknown, type: this.getTSType(node) };
    }

    return node.extra.$tsvalue as any;
  }

  getTSType(node, defaultType: Parser.Type | Parser.Type[] = Type.unknown) {
    if (node.extra.$tstype) {
      return node.extra.$tstype;
    }

    let type = this.getTSTypeRaw(node, defaultType);

    if (typeof type === 'string') {
      type = type.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')');
    }

    if (node.optional) {
      return [type, Type.undefined];
    }

    node.extra.$tstype = type;

    return type;
  }

  parseElements<T extends Babel.Expression | Babel.ObjectProperty | Babel.ObjectMethod | Babel.SpreadElement>(elements: T[]) {
    return elements.reduce((accumulator, element) => {
      const node = element.type === Syntax.SpreadElement ? element.argument : element as Exclude<T, Babel.SpreadElement>;
      const items = this.parseElementsItem(element, node);

      if (items.length) {
        accumulator.push(...items);
      } else if (element.type === Syntax.SpreadElement && element.argument?.type === Syntax.Identifier) {
        const varName = `...${element.argument.name}`;
        const ref = generateAnyGenerator.next().value;

        this.setScopeValue(varName, element, ref);
        accumulator.push({
          type: Syntax.Identifier,
          name: varName,
        });
      }

      return accumulator;
    }, [] as Array<Exclude<T, Babel.SpreadElement> | Babel.Identifier>);
  }

  parseElementsItem(
    _element: Babel.Expression | Babel.ObjectProperty | Babel.ObjectMethod | Babel.SpreadElement,
    item: Babel.Expression | Babel.ObjectProperty | Babel.ObjectMethod
  ) {
    switch (item.type) {
      case Syntax.Identifier: {
        const ref = this.getScopeValue(item.name);

        return ref && 'node' in ref
          ? this.parseElements([ref.node.value])
          : [];
      }

      case Syntax.ObjectExpression:
        return this.parseElements(item.properties);

      default:
        return [item];
    }
  }

  getObjectExpressionValue(node: Babel.ObjectExpression): Value<object> {
    const object = generateObjectGenerator.next().value;
    const setValue = (key: string, ref: Parser.Value, refNode: Babel.Node) => {
      object.value[key] = ref.expression ? ref : ref.value;
      object.rawObject[key] = ref;
      object.rawNode[key] = refNode;
    };

    for (const item of this.parseElements(node.properties)) {
      switch (item.type) {
        case Syntax.ObjectProperty: {
          const ref = this.getValue(item.value);
          const key = 'name' in item.key ? item.key.name : this.getValue(item.key).value;

          if (typeof key === 'string') {
            const refNode = item.value.type === Syntax.Identifier && item.value.name in this.scope && 'node' in this.scope[item.value.name]
              ? (this.scope[item.value.name] as Parser.ScopeEntry).node.value
              : item.value;

            setValue(key, ref, refNode);

            if (item.value.type === Syntax.Identifier && !(key in this.scope)) {
              this.setScopeValue(key, item.value, ref);
            }
          }
          break;
        }

        case Syntax.Identifier: {
          const ref = this.getValue(item);
          const refNode = item.name in this.scope && 'node' in this.scope[item.name]
            ? (this.scope[item.name] as Parser.ScopeEntry).node.value
            : item;

          setValue(item.name, ref, refNode);
          break;
        }

        default: {
          const ref = this.getValue(item);
          const key = 'name' in item.key ? item.key.name : this.getValue(item.key).value;

          setValue(key, ref, item);
          break;
        }
      }
    }

    object.raw = JSON.stringify(object.value);

    return object;
  }

  getObjectProperty(node: Babel.ObjectProperty) {
    const ref = this.getValue(node.value);

    return ref;
  }

  getFunctionExpressionValue(node) {
    return this.getSourceValue(node, Type.function);
  }

  getSourceString(node) {
    const source = (node as Parser.AST.Node).extra.file?.script?.content || this.source.content;

    return source.substring(node.start, node.end);
  }

  getInlineSourceString(node) {
    return this.getSourceString(node).replace(DUPLICATED_SPACES_RE, ' ');
  }

  getSourceValue(node, type: Parser.Type | Parser.Type[] = Type.unknown) {
    const value = this.getSourceString(node);

    return new Value(type, value, value);
  }

  getIdentifierValue(node: Babel.Identifier): Parser.Value<any> | Parser.NS {
    if (node.name in this.scope) {
      const ref = this.scope[node.name];

      return '$ns' in ref ? ref : ref.value;
    }

    if (node.name === Type.undefined) {
      return generateUndefineValue.next().value;
    }

    const type = Value.isNativeType(node.type)
      ? node.type
      : Type.unknown;

    return new Value(type, node.name, JSON.stringify(node.name));
  }

  getUnaryExpressionType(node: Babel.UnaryExpression) {
    let type;

    switch (node.operator) {
      case 'typeof':
      case '!':
        type = Type.boolean;
        break;

      case '~':
        type = Type.binary;
        break;

      case '+':
      case '-':
        type = Type.number;
        break;

      default:
        type = Type.unknown;
        break;
    }

    return type;
  }

  getUnaryExpression(node): Value {
    let type = this.getUnaryExpressionType(node);
    let raw;
    let value;

    switch (node.argument.type) {
      case Syntax.NullLiteral:
      case Syntax.StringLiteral:
      case Syntax.TemplateLiteral:
      case Syntax.BooleanLiteral:
      case Syntax.NumericLiteral:
        raw = `${node.operator}${node.argument.value}`;

        try {
          value = JSON.parse(raw);
        } catch (e) {
          value = raw;
        }
        break;

      default:
        raw = this.getSourceString(node);
        value = raw;
        type = Type.unknown;
    }

    return new Value(type, value, raw);
  }

  getMemberExpression(node: Babel.MemberExpression): Parser.Value<object | string> {
    const exp = this.getSourceString(node);
    const type = exp.startsWith('Math.') || exp.startsWith('Number.') || (node.property.type === Syntax.Identifier && node.property.name === 'length')
      ? Type.number
      : Type.unknown;

    if (type === Type.unknown) {
      switch (node.object.type) {
        case Syntax.Identifier: {
          const key = 'name' in node.property ? node.property.name : this.getValue(node.property).value as string;
          const identifier = this.getValue(node.object);

          if (identifier.type === Type.object && key in identifier.rawObject) {
            return identifier.rawObject[key];
          }

          if (node.object.name in this.scope) {
            const ref = this.scope[node.object.name];

            if ('$ns' in ref) {
              if (key in ref.scope) {
                return ref.scope[key].value;
              }
            } else {
              if (ref.composition?.identifierSuffixes && ref.composition.identifierSuffixes.includes(key)) {
                return ref.value;
              }

              const object = ref.value;
              const value = object.value instanceof Array
                ? object.rawObject[key]
                : get(object.rawObject, key);

              if (value) {
                return value;
              }
            }
          }
          break;
        }

        case Syntax.MemberExpression: {
          const key = 'name' in node.property ? node.property.name : this.getValue(node.property).value as string;
          const value = this.getMemberValue(node.object, key);

          if (value) {
            return value;
          }
          break;
        }
      }
    }

    return this.getSourceValue(node, type);
  }

  getMemberValue(node: Babel.MemberExpression, key: string) {
    const member = this.getMemberExpression(node);

    if (typeof member.rawObject === 'object' && key in member.rawObject) {
      return member.rawObject[key];
    }

    return null;
  }

  getCallExpression(node: Babel.CallExpression): Parser.Value<any> {
    let type: Parser.Type | Parser.Type[] = Type.unknown;

    if ('name' in node.callee) {
      const ref = this.getScopeValue(node.callee.name);

      if (ref && 'node' in ref) {
        type = this.getReturnType(ref.node.value, type);
      } else if (NATIVE_OBJECTS.includes(node.callee.name)) {
        type = Value.parseNativeType(node.callee.name);
      }
    }

    return this.getSourceValue(node, type);
  }

  getExpressionType(node: Babel.BinaryExpression | Babel.LogicalExpression | Babel.AssignmentExpression): Parser.Type | Parser.Type[] {
    if (BITWISE_OPERATORS.includes(node.operator)) {
      return Type.binary;
    }

    if (BOOLEAN_OPERATORS.includes(node.operator)) {
      return node.operator === '||' ? this.getExpressionTypeAlternate(node) : Type.boolean;
    }

    if (NUMERIC_OPERATORS.includes(node.operator)) {
      return node.operator === '+' ? this.getExpressionTypeAlternate(node) : Type.number;
    }

    return this.getExpressionTypeAlternate(node);
  }

  private getExpressionTypeAlternate(node: Babel.BinaryExpression | Babel.LogicalExpression | Babel.AssignmentExpression) {
    const types = [
      this.getNodeType(node.left, Type.unknown),
      this.getNodeType(node.right, Type.unknown),
    ];

    if (types.includes(Type.string)) {
      return Type.string;
    }

    if (BOOLEAN_OPERATORS.includes(node.operator)) {
      return Type.boolean;
    }

    if (node.operator === '+') {
      return types.every((item) => item === Type.number) ? Type.number : Type.string;
    }

    if (types[0] === types[1]) {
      return types[0];
    }

    return types as Parser.Type | Parser.Type[];
  }

  getConditionalExpressionType(node: Babel.ConditionalExpression) {
    const consequentType = this.getNodeType(node.consequent, Type.unknown);
    const alternateType = this.getNodeType(node.alternate, Type.unknown);

    return consequentType === alternateType
      ? consequentType
      : [consequentType, alternateType] as string[];
  }

  getExpressionValue(node: Babel.BinaryExpression | Babel.LogicalExpression | Babel.AssignmentExpression | Babel.ConditionalExpression): Value {
    const type = this.getNodeType(node, Type.unknown);
    const value = this.getSourceString(node);

    return new Value(type, value, value);
  }

  getArrayExpression(node: Babel.ArrayExpression): Value<any[]> {
    const output = generateArrayGenerator.next().value;

    output.value = node.elements.map((element) => {
      const ref = this.getValue(element);

      return ref.expression ? ref : ref.value;
    });

    output.rawObject = node.elements.map((element) => {
      const ref = this.getValue(element);

      if (Value.isNativeType(ref.type)) {
        return ref;
      }

      const value = this.getInlineSourceString(element);

      return new Value(element.type, value);
    });

    output.raw = `[${
      output.rawObject.map((ref) => ref.raw).join(',')
    }]`;

    return output;
  }

  getValue(node: Babel.Node | null): Parser.Value<any> {
    if (node === null) {
      return generateNullGenerator.next().value;
    }

    switch (node.type) {
      case Syntax.StringLiteral:
        return new Value(Type.string, node.value, JSON.stringify(node.value));

      case Syntax.BooleanLiteral:
        return new Value(Type.boolean, node.value, `${node.value}`);

      case Syntax.NumericLiteral:
        return new Value(Type.number, node.value, node.extra?.raw as string);

      case Syntax.BigIntLiteral:
        return new Value(Type.bigint, node.extra?.raw, node.extra?.raw as string);

      case Syntax.RegExpLiteral:
        return new Value(Type.regexp, node.extra?.raw as string, node.extra?.raw as string);

      case Syntax.ArrayExpression:
        return this.getArrayExpression(node);

      case Syntax.NullLiteral:
        return generateNullGenerator.next().value;

      case Syntax.UnaryExpression:
        return this.getUnaryExpression(node);

      case Syntax.BinaryExpression:
      case Syntax.LogicalExpression:
      case Syntax.AssignmentExpression:
      case Syntax.ConditionalExpression:
        return this.getExpressionValue(node);

      case Syntax.CallExpression:
        return this.getCallExpression(node);

      case Syntax.MemberExpression:
        return this.getMemberExpression(node);

      case Syntax.NewExpression: {
        const type = node.callee.type === Syntax.Identifier
          ? node.callee.name
          : Type.object;

        return this.getSourceValue(node, type);
      }

      case Syntax.ObjectPattern:
        return this.getSourceValue(node);

      case Syntax.TemplateLiteral:
      case Syntax.TaggedTemplateExpression:
        return this.getSourceValue(node, Type.string);

      case Syntax.ObjectExpression:
        return this.getObjectExpressionValue(node);

      case Syntax.ObjectProperty:
        return this.getObjectProperty(node);

      case Syntax.Identifier:
        return this.getIdentifierValue(node) as any;

      case Syntax.TSAsExpression:
        return this.getValue(node.expression);

      default:
        if (AbstractParser.isFunction(node)) {
          return this.getFunctionExpressionValue(node);
        }
        break;
    }

    return new Value(Type.unknown, this.getSourceString(node));
  }
}
