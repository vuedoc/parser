import EventEmitter from 'events';

import { RestValue } from '../entity/RestValue.js';
import { Value, UndefinedValue, NullValue } from '../entity/Value.js';
import { Syntax, Type, TypedocTag, JSDocTag, TypeList, CompositionAPIValues, ScalarTypeList } from '../Enum.js';
import { get } from '@b613/utils/lib/object';

const DUPLICATED_SPACES_RE = /\s+/g;
const BOOLEAN_OPERATOR_RE = /(&&|\|\|)/;
const BINARY_OPERATOR_RE = /(&|\|)/;
const IGNORED_KEYWORDS = [TypedocTag.hidden, JSDocTag.ignore];
const NUMERIC_OPERATORS = ['*', '+', '-', '/', '^'];
const IGNORED_SCOPED_TYPES = [Type.any, Type.unknown];

const FUNCTION_EXPRESSIONS = [
  Syntax.ObjectMethod,
  Syntax.ClassMethod,
  Syntax.ClassPrivateMethod,
  Syntax.ObjectMethod,
  Syntax.FunctionExpression,
  Syntax.ArrowFunctionExpression,
  Syntax.FunctionDeclaration,
];

function* generateName(prefix) {
  let index = 0;

  while (true) {
    yield `${prefix}$${index++}`;
  }
}

const generateObjectName = generateName('object');
const generateArrayName = generateName('array');

export class AbstractParser {
  constructor(root, scope = root.scope, nodes = root.nodes) {
    this.root = root;
    this.emitter = root instanceof EventEmitter ? root : root.root;
    this.model = null;
    this.source = this.root.source;
    this.features = this.emitter.features;
    this.scope = { ...scope };
    this.nodes = { ...nodes };
    this.composition = root.options.composition
      ? CompositionAPIValues.concat(...Object.values(root.options.composition).flat())
      : CompositionAPIValues;
  }

  static isFunction(node) {
    return FUNCTION_EXPRESSIONS.includes(node.type);
  }

  emit(entry) {
    if (this.emitter.isIgnoredVisibility(entry.visibility)) {
      return;
    }

    if (entry.keywords) {
      const contentsAnIgnoredKeyword = entry.keywords.some(({ name }) => IGNORED_KEYWORDS.includes(name));

      if (contentsAnIgnoredKeyword) {
        return;
      }
    }

    if ('parseExposedEntry' in this.root) {
      this.root.parseExposedEntry(entry);
    }

    this.emitter.emit(entry.kind, entry);
  }

  emitWarning(message) {
    this.emitter.emit('warning', message);
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
  parseFunctionDeclaration(node) {}

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseEntryComment(entry, node) {}

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseArrayExpression(node) {}

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseCallExpression(node) {}

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseFunctionExpression(node) {}

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseExpressionStatement(node) {}

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseObjectExpression(node) {}

  parseObjectProperty(node) {
    this.parse(node.value);
  }

  parseIdentifier(node) {
    if (node.name in this.nodes) {
      this.parse(this.nodes[node.name].node);
    }
  }

  parseVariableDeclarationArrayPattern(id, init) {
    const array = new Value(Type.array, []);

    id.name = generateArrayName.next().value;
    this.scope[id.name] = array;

    id.elements.forEach((element, index) => {
      if (element === null) {
        return;
      }

      let name = null;
      let defaultValue;
      let nodeDefaultValue = init;

      switch (element.type) {
        case Syntax.Identifier:
          name = element.name;
          break;

        case Syntax.AssignmentPattern:
          name = element.left.name;
          defaultValue = this.getValue(element.right);
          nodeDefaultValue = element.right;
          break;
      }

      switch (init.type) {
        case Syntax.ArrayExpression: {
          const node = init.elements[index] || init;

          if (defaultValue && defaultValue !== UndefinedValue) {
            array.value.push(defaultValue.value);
            this.setScopeValue(name, node, defaultValue);
          } else {
            const ref = init.elements[index]
              ? this.getValue(init.elements[index])
              : UndefinedValue;

            array.value.push(ref.value);
            this.setScopeValue(name, node, ref);
          }
          break;
        }

        default:
          array.value.push(defaultValue?.value);

          if (defaultValue) {
            this.setScopeValue(name, nodeDefaultValue, defaultValue);
          } else {
            this.setScopeValue(name, nodeDefaultValue, UndefinedValue);
          }
          break;
      }
    });

    array.raw = JSON.stringify(array.value);

    this.setScopeValue(id.name, init, array);
  }

  parseVariableDeclarationObjectPattern(id, init) {
    const object = new Value(Type.object, {});

    id.name = generateObjectName.next().value;
    this.scope[id.name] = object;

    id.properties
      .filter((property) => property.value)
      .forEach((property) => {
        let name = null;
        let defaultValue;

        switch (property.value.type) {
          case Syntax.Identifier:
            name = this.getValue(property.key).value;
            break;

          case Syntax.AssignmentPattern:
            name = this.getValue(property.value.left).value;
            defaultValue = this.getValue(property.value.right);
            break;
        }

        switch (init.type) {
          case Syntax.ObjectExpression: {
            const propertyValue = init.properties.find(({ key }) => {
              return this.getValue(key).value === name;
            });

            if (defaultValue && defaultValue !== UndefinedValue) {
              object.value[name] = defaultValue.value;
              this.setScopeValue(name, init, defaultValue);
            } else {
              const ref = propertyValue
                ? this.getValue(propertyValue.value)
                : UndefinedValue;

              object.value[name] = ref.value;
              this.setScopeValue(name, init, ref);
            }
            break;
          }

          default:
            object.value[name] = defaultValue?.value;

            if (defaultValue) {
              this.setScopeValue(name, init, defaultValue);
            } else {
              this.setScopeValue(name, init, UndefinedValue);
            }
            break;
        }
      });

    object.raw = JSON.stringify(object.value);

    this.setScopeValue(id.name, init, object);
  }

  setScopeValue(key, node, value, { nodeComment = node, nodeTyping = node, forceType = false } = {}) {
    if (!forceType && key in this.scope && this.scope[key] && this.scope[key].type !== value.type) {
      if (!IGNORED_SCOPED_TYPES.includes(this.scope[key].type)) {
        value.type = Type.unknown;
      }
    }

    this.scope[key] = value;
    this.nodes[key] = { node, nodeComment, nodeTyping };
  }

  parseVariableDeclaration(node) {
    node.declarations
      .filter(({ type }) => type === Syntax.VariableDeclarator)
      .forEach((declaration) => {
        switch (declaration.id.type) {
          case Syntax.ArrayPattern:
            this.parseVariableDeclarationArrayPattern(declaration.id, declaration.init);
            break;

          case Syntax.ObjectPattern:
            this.parseVariableDeclarationObjectPattern(declaration.id, declaration.init);
            break;

          default: {
            const hasBeenInitialized = !!declaration.init;
            const initializedNode = hasBeenInitialized ? declaration.init : declaration;
            const declarationValue = hasBeenInitialized ? this.getValue(declaration.init) : UndefinedValue;

            this.setScopeValue(declaration.id.name, initializedNode, declarationValue, {
              nodeTyping: declaration.init?.typeParameters || declaration.id?.typeAnnotation || declaration,
              nodeComment: node.declarations.length > 1 ? declaration : node,
            });
            break;
          }
        }
      });
  }

  /**
   * @param {AssignmentExpression} node
   */
  parseAssignmentExpression(node) {
    this.setScopeValue(node.left.name, node.right, this.getValue(node.right));
  }

  parseKey({ computed, id, key = id, value, body }) {
    const keyName = key.type === Syntax.PrivateName
      ? key.id.name
      : key.name || key.value;

    if (computed) {
      const $value = value || body;

      switch (key.type) {
        case Syntax.Identifier:
          if ($value.type !== Syntax.Identifier) {
            const ref = this.getValue(key);

            if (ref !== UndefinedValue) {
              return `${ref.value}`;
            }
          }
          break;

        case Syntax.CallExpression:

        case Syntax.MemberExpression: {
          const ref = this.getValue(key);

          return ref.raw;
        }
      }
    }

    return keyName;
  }

  parseType(node) {
    const ref = this.getValue(node);

    return ref.kind;
  }

  getTSTypeRaw(node, defaultType = Type.unknown) {
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

      default:
        if (node.typeAnnotation) {
          type = this.getInlineSourceString(node.typeAnnotation.typeAnnotation);
        } else if (node.type.startsWith('TS')) {
          type = this.getInlineSourceString(node);
        }
        break;
    }

    return type;
  }

  getTSType(node, defaultType = Type.unknown) {
    const type = this.getTSTypeRaw(node, defaultType);

    return typeof type === 'string'
      ? type.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')')
      : type;
  }

  getObjectExpressionValue(node) {
    const value = {};
    const raw = {};

    for (const item of node.properties) {
      switch (item.type) {
        case Syntax.ObjectProperty: {
          const ref = this.getValue(item.value);

          value[item.key.name] = ref.value;
          raw[item.key.name] = AbstractParser.isFunction(ref)
            ? ref.value
            : ref.raw;

          if (item.value.type === Syntax.Identifier && !(item.key.name in this.nodes)) {
            this.setScopeValue(item.key.name, item.value, ref);
          }
          break;
        }

        case Syntax.SpreadElement:
          value[item.argument.name] = new RestValue(Type.object, item.argument.name);
          break;

        default: {
          const ref = this.getValue(item);

          value[item.key.name] = ref.value;
          raw[item.key.name] = ref.raw;
          break;
        }
      }
    }

    return new Value(Type.object, value, JSON.stringify(value), raw);
  }

  getFunctionExpressionValue(node) {
    return this.getSourceValue(node, Type.function);
  }

  getSourceString(node) {
    return this.source.content.substring(node.start, node.end);
  }

  getInlineSourceString(node) {
    return this.getSourceString(node).replace(DUPLICATED_SPACES_RE, ' ');
  }

  getSourceValue(node, type = node.type) {
    const value = this.getSourceString(node);

    return new Value(type, value);
  }

  getIdentifierValue(node) {
    if (node.name in this.scope) {
      return this.scope[node.name];
    }

    if (node.name === UndefinedValue.raw) {
      return UndefinedValue;
    }

    const type = TypeList.includes(node.type.toLowerCase())
      ? node.type
      : Type.unknown;

    return new Value(type, node.name, node.name);
  }

  getUnaryExpression(node) {
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

  getMemberExpression(node) {
    const exp = this.getSourceString(node);
    const type = exp.startsWith('Math.') || exp.startsWith('Number.')
      ? Type.number
      : Type.object;

    if (type === Type.object && node.object.name in this.scope) {
      const key = this.getValue(node.property);
      const object = this.scope[node.object.name];
      const value = object.value instanceof Array ? object.value[key.value] : get(object.value, key.value);
      const valueType = value instanceof Array ? Type.array : typeof value;
      const isAnObject = valueType === Type.array || valueType === Type.object;
      const isScalar = ScalarTypeList.includes(valueType)
        || Object.keys(value).every((key) => ScalarTypeList.includes(typeof value[key]));

      const raw = isScalar
        ? JSON.stringify(value)
        : isAnObject ? this.getInlineSourceString(node) : UndefinedValue.raw;

      if (value || raw) {
        return new Value(valueType, value, raw);
      }
    }

    return this.getSourceValue(node, type);
  }

  getCallExpression(node) {
    let value;

    switch (node.callee.name) {
      case 'useAttrs':
      case 'useSlots':
      case 'createApp':
        value = UndefinedValue;
        break;

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
        if (this.composition.includes(node.callee.name)) {
          value = node.arguments.length ? this.getValue(node.arguments[0]) : UndefinedValue;
        }
        break;
    }

    if (value) {
      value.$kind = node.callee.name;

      return value;
    }

    const type = node.callee && node.callee.name && TypeList.includes(node.callee.name.toLowerCase())
      ? node.callee.name
      : Type.unknown;

    return this.getSourceValue(node, type);
  }

  getAssignmentExpression(node) {
    let type;

    if (BOOLEAN_OPERATOR_RE.test(node.operator)) {
      type = Type.boolean;
    } else if (BINARY_OPERATOR_RE.test(node.operator)) {
      type = Type.binary;
    } else {
      type = this.parseType(node.left);
    }

    return new Value(type, this.getSourceString(node));
  }

  getBinaryExpression(node) {
    const type = NUMERIC_OPERATORS.includes(node.operator)
      ? this.parseType(node.left)
      : Type.binary;

    return new Value(type, this.getSourceString(node));
  }

  getArrayExpression(node) {
    const value = node.elements.map((element) => this.getValue(element).value);
    const raw = node.elements.map((element) => {
      const ref = this.getValue(element);

      return ScalarTypeList.includes(ref.type)
        ? ref.raw
        : this.getInlineSourceString(element);
    });

    return new Value(Type.array, value, `[${raw.join(',')}]`, raw);
  }

  getValue(node) {
    if (node === null) {
      return NullValue;
    }

    switch (node.type) {
      case Syntax.StringLiteral:
        return new Value(Type.string, node.value, JSON.stringify(node.value));

      case Syntax.Template:
        return new Value(typeof node.value, node.value, `${node.value}`);

      case Syntax.LogicalExpression:
        return new Value(Type.boolean, this.getSourceString(node));

      case Syntax.BooleanLiteral:
        return new Value(Type.boolean, node.value, `${node.value}`);

      case Syntax.NumericLiteral:
        return new Value(Type.number, node.value, node.extra.raw);

      case Syntax.BigIntLiteral:
        return new Value(Type.bigint, node.extra.raw);

      case Syntax.RegExpLiteral:
        return new Value(Type.regexp, node.extra.raw);

      case Syntax.ArrayExpression:
        return this.getArrayExpression(node);

      case Syntax.NullLiteral:
        return NullValue;

      case Syntax.UnaryExpression:
        return this.getUnaryExpression(node);

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

      case Syntax.Identifier:
        return this.getIdentifierValue(node);

      case Syntax.TSAsExpression:
        return this.getValue(node.expression);

      case Syntax.AssignmentExpression:
        return this.getAssignmentExpression(node);

      case Syntax.BinaryExpression:
        return this.getBinaryExpression(node);

      default:
        if (AbstractParser.isFunction(node)) {
          return this.getFunctionExpressionValue(node);
        }
        break;
    }

    return new Value(Type.unknown, this.getSourceString(node));
  }
}
