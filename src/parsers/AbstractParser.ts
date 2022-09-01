import { RestValue } from '../entity/RestValue.js';
import { Value, generateUndefineValue, generateNullGenerator, generateObjectGenerator, generateArrayGenerator } from '../entity/Value.js';
import { Syntax, Type, TypeList, CompositionTypes, Feature, CompositionFeature } from '../lib/Enum.js';
import { clear, get } from '@b613/utils/lib/object.js';
import { Entry } from '../../types/Entry.js';
import { Parser } from '../../types/Parser.js';
import { FileSystem } from '../../types/FileSystem.js';
import { Composition } from '../lib/Composition.js';
import { PropType } from '@b613/utils/typings.js';
import { DTS } from '../lib/DTS.js';

import * as Babel from '@babel/types';

export type CompositionValueOptions = Pick<Babel.VariableDeclarator, 'init'> & {
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
  Syntax.TSDeclareFunction,
  Syntax.TSFunctionType,
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
  if (AbstractParser.hasComments(source) && !AbstractParser.hasComments(dest)) {
    dest.leadingComments = source.leadingComments;
    // dest.trailingComments = source.trailingComments;
    // dest.innerComments = source.innerComments;
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
    if (node.type === Syntax.TSFunctionType) {
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

  static parseTsValueType(tsValue: Parser.AST.TSValue) {
    if (typeof tsValue.type === 'string' || tsValue.type instanceof Array) {
      return tsValue.type;
    }

    const raw = {};

    for (const key in tsValue.type) {
      const type = tsValue.type[key];

      raw[key] = Array.isArray(type) ? type.join('|') : type;
    }

    return JSON.stringify(raw);
  }

  getTypeParameterValue(node: Babel.Node, typeParameterIndex: number) {
    if (typeParameterIndex >= 0 && 'typeParameters' in node && 'params' in node.typeParameters) {
      if (typeParameterIndex < node.typeParameters.params.length) {
        const tsValue = this.getTSValue(node.typeParameters.params[typeParameterIndex]);

        return AbstractParser.parseTsValueType(tsValue);
      }
    }

    return null;
  }

  parseNodeRef(
    rawType: string | string[] | Record<string, string>,
    rawNode: Babel.Node | Babel.Node[] | Record<string, Babel.Node>
  ): Parser.Value<any> {
    let ref: Parser.Value<any>;

    if (rawNode instanceof Array) {
      ref = new Value(rawType as string[], [], '[]');
      ref.value = rawNode.map((item) => this.getValue(item).value);
      ref.raw = JSON.stringify(ref.value);
    } else if (typeof rawType === 'string') {
      ref = this.getValue(rawNode as Babel.Node);
      ref.type = rawType;
    } else {
      const typeMap = {};
      const nodeMap = rawNode as Record<string, Babel.Node>;

      ref = generateObjectGenerator.next().value;

      for (const key in rawType) {
        const type = rawType[key];
        const node = nodeMap[key];
        const currentRef = this.parseNodeRef(type, node);

        typeMap[key] = currentRef.type;
        ref.value[key] = currentRef.value;
        ref.rawObject[key] = currentRef;
        ref.rawNode[key] = node;
      }

      ref.type = DTS.parseType(ref.value);
      ref.raw = JSON.stringify(ref.value);
    }

    return ref;
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

      case Syntax.FunctionDeclaration:
        this.parseFunctionDeclaration(node);
        break;

      default:
        if (AbstractParser.isFunction(node)) {
          this.parseFunctionExpression(node.body);
        }
        break;
    }
  }

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseFunctionDeclaration(_node: Babel.FunctionDeclaration) {}

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

        this.setScopeValue(name, nodeValue, ref, {
          nodeTyping,
          nodeComment,
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
    this.parseVariableDeclarationElements(id.elements, declarator);
  }

  parseVariableDeclarationObjectPattern(declarator: Parser.AST.VariableDeclarator, id: Babel.ObjectPattern) {
    const object = generateObjectGenerator.next().value;

    declarator.id.name = generateObjectName.next().value;

    this.setScopeValue(declarator.id.name, declarator.init, object);
    this.parseVariableDeclarationElements(id.properties, declarator);
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
          const node = tsValue.type === Type.array ? (tsValue.node as Babel.ArrayExpression).elements[index] : {
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
                  id: options.id as any,
                });

                const ref = defaultValue || decoratorValue.ref || generateUndefineValue.next().value;
                const initNode = decoratorValue.node || element;
                const nodeValue = decoratorValue.argument || initNode;

                element.extra.$declarator = options;

                if (decoratorValue.node) {
                  copyComments(nodeComment, decoratorValue.node);
                }

                this.setScopeValue(name, nodeValue, ref, {
                  source,
                  nodeComment,
                  nodeTyping: element,
                  composition: decoratorValue.composition,
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
      function: isFunction,
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
        scopeValue.composition = ref.composition;
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

      if (!('$ns' in ref)) {
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

  getReturnType(node: Babel.Node, defaultType: Parser.Type = Type.unknown): Parser.Type | Parser.Type[] {
    let type: Parser.Type | Parser.Type[] = defaultType;
    const _node = node as any;

    if (_node.returnType) {
      type = this.getValue(_node.returnType.typeAnnotation).value;
    } else if (_node.typeAnnotation?.typeAnnotation) {
      type = _node.typeAnnotation.typeAnnotation.type === Syntax.TSFunctionType
        ? this.getTSValue(_node.typeAnnotation.typeAnnotation.typeAnnotation).type as string
        : this.getTSValue(_node.typeAnnotation.typeAnnotation).type as string;
    } else if (AbstractParser.isFunction(_node)) {
      const blockNode = _node.body?.body || _node.body;
      const returnNode: Babel.Node = blockNode instanceof Array
        ? blockNode.length === 1 ? blockNode[0] : blockNode.find((node) => node.type === Syntax.ReturnStatement)
        : blockNode;

      if (returnNode) {
        switch (returnNode.type) {
          case Syntax.ReturnStatement:
            if ('argument' in returnNode) {
              const returnValue = this.getValue(returnNode.argument);

              type = returnValue.type;
            } else {
              type = Type.unknown;
            }
            break;

          case Syntax.Identifier:
            type = this.getValue(returnNode).type;
            break;

          case Syntax.MemberExpression:
            type = this.getMemberExpression(returnNode).type;
            break;

          case Syntax.ConditionalExpression: {
            const consequentType = this.getNodeType(returnNode.consequent);
            const alternateType = this.getNodeType(returnNode.alternate);

            if (consequentType && alternateType && consequentType === alternateType) {
              type = consequentType;
            }
            break;
          }

          default:
            type = this.getNodeType(returnNode, Type.void);
            break;
        }
      } else {
        type = Type.void;
      }

      if (_node.async) {
        type = `${Type.Promise}<${type}>`;
      }
    }

    return type;
  }

  getNodeType(node: Babel.Node, defaultType?: Parser.Type) {
    let type: Parser.Type | Parser.Type[] = defaultType;

    switch (node.type) {
      case Syntax.Identifier:
        type = this.getValue(node).type;
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
        type = Type.array;
        break;

      case Syntax.NullLiteral:
        type = Type.null;
        break;

      case Syntax.MemberExpression:
        type = node.property.type === Syntax.Identifier && node.property.name === 'length'
          ? Type.number
          : Type.object;
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

  parseCompositionTypeParameters(init: Babel.CallExpression) {
    if (init.typeParameters && 'name' in init.callee) {
      const ref = this.getScopeValue(init.callee.name);

      if (ref?.node.value.typeParameters) {
        if (ref.node.value.returnType?.typeAnnotation?.typeParameters) {
          const originalParams = ref.node.value.returnType.typeAnnotation.typeParameters.params;

          ref.node.value.returnType.typeAnnotation.typeParameters.params = init.typeParameters.params;
          ref.node.value.extra.$tsvalue = this.getTSValue(ref.node.value, true);
          ref.node.value.returnType.typeAnnotation.typeParameters.params = originalParams;
        }
      }
    }
  }

  getCompositionValue(options: CompositionValueOptions): CompositionValue {
    let ref: Parser.Value<any>;
    let refNode: Babel.Node;
    let argumentNode: Babel.Node;
    let tsValue = this.getDeclaratorType(options);
    const init: Babel.Node = options.init.type === Syntax.TSAsExpression
      ? options.init.expression
      : options.init;

    if (init.type === Syntax.CallExpression && 'callee' in init && 'name' in init.callee) {
      const fname = init.callee.name;
      const composition = this.composition.get(fname, [
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
        } else if (!tsValue && init.typeParameters) {
          if (composition.typeParameterIndex >= 0 && composition.typeParameterIndex < init.typeParameters.params.length) {
            tsValue = this.getTSValue(init.typeParameters.params[composition.typeParameterIndex]);
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

        this.parseCompositionTypeParameters(init);

        if ('parseEntryValue' in composition && typeof composition.parseEntryValue === 'function') {
          ref = composition.parseEntryValue(init, this as any);
        } else if (typeof composition.valueIndex === 'number' && composition.valueIndex >= 0 && composition.valueIndex < init?.arguments?.length) {
          const argument = init.arguments.at(composition.valueIndex);

          ref = this.getValue(argument);
          argumentNode = argument;

          if (tsValue) {
            ref.type = this.getTypeParameterValue(argumentNode, composition.typeParameterIndex)
              || AbstractParser.parseTsValueType(tsValue);

            if (options.key) {
              if (typeof tsValue.type === 'object') {
                ref.type = Array.isArray(tsValue.type) ? tsValue.type : tsValue.type[options.key];
              }
            } else if (options.id.type === Syntax.Identifier || options.id.type === Syntax.ObjectProperty) {
              ref.type = this.getTypeParameterValue(argumentNode, composition.typeParameterIndex)
                || AbstractParser.parseTsValueType(tsValue);
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

        if (options.key) {
          if (tsValue) {
            const keyType = typeof tsValue.type === 'string'
              ? tsValue.type
              : tsValue.type[options.key];

            if (!ref) {
              const keyref = this.getScopeValue(options.key);

              if (keyref) {
                ref = keyref.value;
                tsValue = keyref.tsValue;
                refNode = keyref.node.value;
              } else {
                ref = generateUndefineValue.next().value;
              }
            }

            if (typeof tsValue.type === Type.object && typeof ref.value === 'object') {
              const rawRef = options.key in ref.rawObject
                ? ref.rawObject[options.key]
                : generateUndefineValue.next().value;

              ref.value = rawRef.value;
              ref.raw = rawRef.raw;

              if (typeof ref.value === 'undefined' && keyType instanceof Array && keyType.includes(Type.undefined)) {
                ref.raw = 'undefined';
              }
            }

            ref.type = keyType;
            refNode = tsValue.node[options.key];
          } else if (ref?.type === Type.object) {
            ref = options.key in ref.rawObject
              ? ref.rawObject[options.key]
              : generateUndefineValue.next().value;
          }
        }

        if (!ref && tsValue) {
          ref = DTS.parseValue(tsValue.type);
        }

        if (ref && refNode) {
          ref.function = AbstractParser.isFunction(refNode) || AbstractParser.isTsFunction(refNode);
        }

        return { ref, tsValue, composition, node: refNode, argument: argumentNode };
      }
    }

    ref = this.getValue(options.init);
    ref.function = AbstractParser.isFunction(options.init) || AbstractParser.isTsFunction(options.init);

    if (tsValue) {
      ref.type = AbstractParser.parseTsValueType(tsValue);
    }

    if (options.id.type !== Syntax.Identifier && options.init?.type === Syntax.CallExpression) {
      ref.value = '';
      ref.raw = '';
    }

    return { ref, tsValue };
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

  parseType(node: any) {
    const ref = this.getValue(node);

    return ref.kind;
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

      case Syntax.TSDeclareFunction:
        if ('returnType' in node) {
          type = this.getTSTypeRaw(node.returnType, defaultType);
        }
        break;

      case Syntax.StringLiteral:
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
        type = Type.array;
        break;

      case Syntax.NullLiteral:
        type = Type.null;
        break;

      default:
        if ('typeAnnotation' in node && 'typeAnnotation' in node.typeAnnotation) {
          type = this.getInlineSourceString(node.typeAnnotation.typeAnnotation);
        } else if (node.type.startsWith('TS')) {
          type = this.getInlineSourceString(node);
        }
        break;
    }

    return type;
  }

  getTSInterfaceBody(node: Babel.TSInterfaceBody) {
    const ref = {};

    for (const item of node.body) {
      const key = this.parseKey(item as any);
      const tsValue = this.getTSValue(item);

      ref[key] = tsValue;
    }

    return ref;
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

      case Syntax.TSInterfaceDeclaration:
        node.extra.$tsvalue = { node, type: this.getTSInterfaceBody(node.body) };
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

          node.extra.$tsvalue = { ...ref, computed: true };
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
          ? (ref.tsValue ? ref.tsValue : this.getTSValue(ref.node.value))
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

      case Syntax.TSDeclareFunction:
        if ('returnType' in node) {
          copyComments(node.returnType, node);
          node.extra.$tsvalue = this.getTSValue(node.returnType, force);
        }
        break;
    }

    if (!node.extra.$tsvalue) {
      node.extra.$tsvalue = { node, type: this.getTSType(node) };
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

  getObjectExpressionValue(node): Value<object> {
    const object = generateObjectGenerator.next().value;

    for (const item of node.properties) {
      switch (item.type) {
        case Syntax.ObjectProperty: {
          const ref = this.getValue(item.value);
          const refNode = item.value.type === Syntax.Identifier && item.value.name in this.scope && 'node' in this.scope[item.value.name]
            ? (this.scope[item.value.name] as Parser.ScopeEntry).node.value
            : item.value;

          object.value[item.key.name] = ref.value;
          object.rawObject[item.key.name] = ref;
          object.rawNode[item.key.name] = refNode;

          if (item.value.type === Syntax.Identifier && !(item.key.name in this.scope)) {
            this.setScopeValue(item.key.name, item.value, ref);
          }
          break;
        }

        case Syntax.SpreadElement:
          object.value[item.argument.name] = new RestValue(Type.object, item.argument.name);
          break;

        default: {
          const ref = this.getValue(item);
          const refNode = item.type === Syntax.Identifier && item.name in this.scope && 'node' in this.scope[item.name]
            ? (this.scope[item.name] as Parser.ScopeEntry).node.value
            : item;

          object.value[item.key.name] = ref.value;
          object.rawObject[item.key.name] = ref;
          object.rawNode[item.key.name] = refNode;
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

  getSourceValue(node, type = node.type) {
    const value = this.getSourceString(node);

    return new Value(type, value);
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

  getUnaryExpression(node): Value {
    let type;
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
          type = typeof value;
        } catch (e) {
          value = raw;

          switch (raw[0]) {
            case '!':
              type = Type.boolean;
              break;

            case '~':
              type = Type.binary;
              break;

            default:
              type = Type.unknown;
              break;
          }
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
      : Type.object;

    if (type === Type.object) {
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

    if (typeof member.value === 'object' && key in member.value) {
      return member.rawObject[key];
    }

    return null;
  }

  getCallExpression(node: Babel.CallExpression): Parser.Value<any> {
    const type = node.callee.type === Syntax.Identifier && TypeList.includes(node.callee.name.toLowerCase() as any)
      ? node.callee.name
      : Type.unknown;

    return this.getSourceValue(node, type);
  }

  getExpressionType(node: Babel.BinaryExpression | Babel.LogicalExpression | Babel.AssignmentExpression) {
    if (BITWISE_OPERATORS.includes(node.operator)) {
      return Type.binary;
    }

    const types = [this.parseType(node.left), this.parseType(node.right)];

    if (types.includes(Type.string)) {
      return Type.string;
    }

    if (NUMERIC_OPERATORS.includes(node.operator)) {
      return Type.number;
    }

    if (types[0] === types[1]) {
      return BOOLEAN_OPERATORS.includes(node.operator) ? Type.boolean : types[0];
    }

    if (BOOLEAN_OPERATORS.includes(node.operator)) {
      return Type.boolean;
    }

    return types[0];
  }

  getExpressionValue(node: Babel.BinaryExpression | Babel.LogicalExpression | Babel.AssignmentExpression): Value {
    const type = this.getExpressionType(node);
    const value = this.getSourceString(node);

    return new Value(type, value, value);
  }

  getArrayExpression(node: Babel.ArrayExpression): Value<any[]> {
    const output = generateArrayGenerator.next().value;

    output.value = node.elements.map((element) => this.getValue(element).value);
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
        return new Value(Type.bigint, node.extra?.raw as string);

      case Syntax.RegExpLiteral:
        return new Value(Type.regexp, node.extra?.raw as string);

      case Syntax.ArrayExpression:
        return this.getArrayExpression(node);

      case Syntax.NullLiteral:
        return generateNullGenerator.next().value;

      case Syntax.UnaryExpression:
        return this.getUnaryExpression(node);

      case Syntax.BinaryExpression:
      case Syntax.LogicalExpression:
      case Syntax.AssignmentExpression:
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
