const EventEmitter = require('events');

const { RestValue } = require('../entity/RestValue');
const { Value, UndefinedValue, NullValue, UndefinedValueGenerator } = require('../entity/Value');
const { Syntax, Type, TypedocTag, JSDocTag, TypeList } = require('../Enum');

const DUPLICATED_SPACES_RE = /\s+/g;
const BOOLEAN_OPERATOR_RE = /(&&|\|\|)/;
const BINARY_OPERATOR_RE = /(&|\|)/;
const IGNORED_KEYWORDS = [ TypedocTag.hidden, JSDocTag.ignore ];
const NUMERIC_OPERATORS = [ '*', '+', '-', '/', '^' ];
const IGNORED_SCOPED_TYPES = [ Type.any, Type.unknown ];

class AbstractParser {
  constructor (root, scope = root.scope, nodes = root.nodes) {
    this.root = root;
    this.emitter = root instanceof EventEmitter ? root : root.root;
    this.model = null;
    this.source = this.root.source;
    this.features = this.emitter.features;
    this.scope = { ...scope };
    this.nodes = { ...nodes };
  }

  emit (entry) {
    if (this.emitter.isIgnoredVisibility(entry.visibility)) {
      return;
    }

    if (entry.keywords) {
      const isIgnoredItem = IGNORED_KEYWORDS.some((item) => entry.keywords.some(({ name }) => name === item));

      if (isIgnoredItem) {
        return;
      }
    }

    this.emitter.emit(entry.kind, entry);
  }

  emitWarning (message) {
    this.emitter.emit('warning', message);
  }

  parse (node) {
    switch (node.type) {
      case Syntax.ClassMethod:
      case Syntax.ObjectMethod:
      case Syntax.ClassPrivateMethod:
      case Syntax.FunctionExpression:
      case Syntax.ArrowFunctionExpression:
        this.parseFunctionExpression(node.body);
        break;

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
    }
  }

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseEntryComment (entry, node) {}

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseArrayExpression (node) {}

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseCallExpression (node) {}

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseFunctionExpression (node) {}

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseExpressionStatement (node) {}

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseObjectExpression (node) {}

  parseObjectProperty (node) {
    this.parse(node.value);
  }

  parseIdentifier (node) {
    const identifierNode = this.nodes[node.name];

    if (identifierNode) {
      this.parse(identifierNode);
    }
  }

  parseVariableDeclarationArrayPattern (id, init) {
    id.elements.forEach((element, index) => {
      if (element === null) {
        return;
      }

      let name = null;
      let defaultValue;
      let nodeDefaultValue = null;

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
          const ref = init.elements[index]
            ? this.getValue(init.elements[index])
            : UndefinedValue;

          this.setScopeValue(name, node, ref);
          break;
        }

        default:
          this.setScopeValue(name, null, UndefinedValue);
      }

      if (this.scope[name] === UndefinedValue) {
        if (defaultValue !== undefined) {
          this.setScopeValue(name, nodeDefaultValue, defaultValue);
        }
      }
    });
  }

  parseVariableDeclarationObjectPattern (id, init) {
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

            const ref = propertyValue
              ? this.getValue(propertyValue.value)
              : UndefinedValue;

            this.setScopeValue(name, init, ref);
            break;
          }

          default:
            this.scope[name] = UndefinedValueGenerator.next().value;
        }

        if (this.scope[name] === UndefinedValue) {
          if (defaultValue !== undefined) {
            this.scope[name] = defaultValue;
          }
        }
      });
  }

  setScopeValue(key, node, value = node ? this.getValue(node) : UndefinedValue, forceType = false) {
    if (!forceType && key in this.scope && this.scope[key] && this.scope[key].type !== value.type) {
      if (!IGNORED_SCOPED_TYPES.includes(this.scope[key].type)) {
        value.type = Type.any;
      }
    }

    this.scope[key] = value;
    this.nodes[key] = node;
  }

  parseVariableDeclaration (node) {
    node.declarations
      .filter(({ type }) => type === Syntax.VariableDeclarator)
      .forEach((item) => {
        switch (item.id.type) {
          case Syntax.ArrayPattern:
            this.parseVariableDeclarationArrayPattern(item.id, item.init);
            break;

          case Syntax.ObjectPattern:
            this.parseVariableDeclarationObjectPattern(item.id, item.init);
            break;

          default:
            this.setScopeValue(item.id.name, item.init);
        }
      });
  }

  /**
   * @param {AssignmentExpression} node
   */
  parseAssignmentExpression (node) {
    this.setScopeValue(node.left.name, node.right);
  }

  parseKey({ computed, key, value, body }) {
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

  parseType (node) {
    const ref = this.getValue(node);

    return ref.kind;
  }

  getTSTypeRaw (node, defaultType = Type.any) {
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
        }
        break;
    }

    return type;
  }

  getTSType (node, defaultType = Type.any) {
    const type = this.getTSTypeRaw(node, defaultType);

    return typeof type === 'string'
      ? type.replace(/\(\s+/g, '(').replace(/\s+\)/g, ')')
      : type;
  }

  getObjectExpressionValue (node) {
    const value = {};

    for (const item of node.properties) {
      switch (item.type) {
        case Syntax.ObjectProperty:
          value[item.key.name] = this.getValue(item.value);
          break;

        case Syntax.SpreadElement:
          value[item.argument.name] = new RestValue(Type.object, item.argument.name);
          break;

        default:
          value[item.key.name] = this.getValue(item);
          break;
      }
    }

    return new Value(Type.object, value, JSON.stringify(value));
  }

  getFunctionExpressionValue (node) {
    return this.getSourceValue(node);
  }

  getSourceString (node) {
    return this.source.substring(node.start, node.end);
  }

  getInlineSourceString (node) {
    return this.getSourceString(node).replace(DUPLICATED_SPACES_RE, ' ');
  }

  getSourceValue (node, type = node.type) {
    const value = this.getSourceString(node);

    return new Value(type, value);
  }

  getIdentifierValue (node) {
    if (this.scope.hasOwnProperty(node.name)) {
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

  getUnaryExpression (node) {
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
        type = Type.any;
    }

    return new Value(type, value, raw);
  }

  getMemberExpression (node) {
    const exp = this.getSourceString(node);
    const type = exp.startsWith('Math.') || exp.startsWith('Number.')
      ? 'Number'
      : 'Object';

    return this.getSourceValue(node, type);
  }

  getCallExpression (node) {
    const type = node.callee && node.callee.name && TypeList.includes(node.callee.name.toLowerCase())
      ? node.callee.name
      : Type.unknown;

    return this.getSourceValue(node, type);
  }

  getAssignmentExpression (node) {
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

  getBinaryExpression (node) {
    const type = NUMERIC_OPERATORS.includes(node.operator)
      ? this.parseType(node.left)
      : Type.binary;

    return new Value(type, this.getSourceString(node));
  }

  getValue (node) {
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
        return new Value(Type.array, this.getInlineSourceString(node));

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

      case Syntax.ObjectMethod:
      case Syntax.ClassPrivateMethod:
      case Syntax.FunctionExpression:
      case Syntax.ArrowFunctionExpression:
        return this.getFunctionExpressionValue(node);

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
    }

    return new Value(Type.unknown, this.getSourceString(node));
  }
}

module.exports.NullValue = NullValue;
module.exports.AbstractParser = AbstractParser;
