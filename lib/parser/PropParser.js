import { toKebabCase } from '@b613/utils/lib/string.js';
import { AbstractExpressionParser } from './AbstractExpressionParser.js';
import { Value, UndefinedValue } from '../entity/Value.js';
import { PropEntry } from '../entity/PropEntry.js';

import { JSDoc } from '../JSDoc.js';
import { Syntax, Type, Tag } from '../Enum.js';

import { KeywordsUtils } from '../utils/KeywordsUtils.js';
import { MethodReturns, MethodParamGenerator } from '../entity/MethodEntry.js';
import { MethodParser } from './MethodParser.js';

const MODEL_KEYWORD = 'model';
const PROP_TYPES_OBJECT_NAME = 'PropTypes';
const PROP_TYPES_ONE_OF = 'oneOf';
const PROP_TYPES_ONE_OF_TYPE = 'oneOfType';
const PROP_TYPES_INSTANCE_OF = 'instanceOf';
const PROP_TYPES_ARRAY_OF = 'arrayOf';
const PROP_TYPES_OBJECT_OF = 'objectOf';
const PROP_TYPES_SHAPE = 'shape';
const PROP_TYPES_IS_REQUIRED_PROPERTY = 'isRequired';

const PROP_TYPES_OBJECT_MEMBER_RE = new RegExp(`${PROP_TYPES_OBJECT_NAME}\\.`, 'g');
const PROPS_TS_EXPRESSIONS = ['PropOptions', 'PropType'];

function parsePropTypeMemberProperty(property) {
  switch (property.name) {
    case 'bool':
      return Type.boolean;

    case 'func':
      return Type.function;
  }

  return property.name;
}

export class PropParser extends AbstractExpressionParser {
  static parseEntryCommentType(entry) {
    const items = KeywordsUtils.extract(entry.keywords, Tag.type);

    if (items.length) {
      entry.type = JSDoc.parseType(items.pop().description);
    }
  }

  parse(node) {
    if (node.typeParameters) {
      this.parseTSTypeParameterInstantiation(node.typeParameters);
    } else {
      super.parse(node);
    }
  }

  parseTSTypeParameterInstantiation(node) {
    const param = node.params[0];

    switch (param?.type) {
      case Syntax.TSTypeLiteral:
        this.parseTSTypeLiteral(param);
        break;

      case Syntax.TSTypeReference:
        if (param.typeName.name in this.root.types) {
          const type = this.root.types[param.typeName.name];

          this.parseTSTypeReference(type);
        }
        break;
    }
  }

  parseTSTypeReference(node) {
    switch (node.type) {
      case Syntax.TSTypeLiteral:
        this.parseTSTypeLiteral(node);
        break;

      case Syntax.TSInterfaceBody:
        this.parseTSInterfaceBody(node);
        break;

      case Syntax.ClassDeclaration:
        this.parseClassDeclaration(node);
        break;
    }
  }

  parseTSTypeLiteral(node) {
    node.members.forEach((member) => this.parseClassMember(member));
  }

  parseTSInterfaceBody(node) {
    node.body.forEach((member) => this.parseClassMember(member));
  }

  parseClassDeclaration(node) {
    node.body.body.forEach((member) => {
      switch (member.type) {
        case Syntax.ClassProperty:
        case Syntax.ClassMethod:
          this.parseClassMember(member);
          break;
      }
    });
  }

  parseClassMember(member) {
    const name = toKebabCase(member.key.name);
    const type = this.getTSType(member);
    const raw = this.root.scope[member.key.name];
    const value = raw?.type === type
      ? raw
      : this.getPropValueNode(this.root.nodes[member.key.name]?.node?.value, type);

    const entry = new PropEntry(name, {
      type,
      required: !member.optional,
      value: value?.raw,
    });

    if (value) {
      value.member = true;
    }

    if (value === raw) {
      this.root.setScopeValue(member.key.name, member, value);
    }

    this.parseEntry(entry, member, member.key.name);
  }

  parseWithDefaultsCall(node) {
    if (node.arguments[0]?.type === Syntax.CallExpression) {
      const defaults = node.arguments[1];

      if (defaults && defaults.type === Syntax.ObjectExpression) {
        defaults.properties.forEach((property) => {
          this.root.setScopeValue(property.key.name, property, this.getValue(property.value));
        });
      }

      this.parse(node.arguments[0]);
    }
  }

  parseEntryComment(entry, property, camelName) {
    super.parseEntryComment(entry, property);

    const modelKeywordIndex = entry.keywords.findIndex(({ name }) => {
      return name === MODEL_KEYWORD;
    });

    if (modelKeywordIndex > -1) {
      entry.describeModel = true;

      entry.keywords.splice(modelKeywordIndex, 1);
    }

    const kinds = KeywordsUtils.extract(entry.keywords, Tag.kind, true);

    if (kinds.length) {
      const kind = kinds.pop();

      if (kind.description === 'function') {
        entry.function = {
          name: camelName,
          params: [],
          syntax: [],
          keywords: entry.keywords,
          description: entry.description,
          returns: new MethodReturns(Type.unknown),
        };

        JSDoc.parseParams(this, entry.keywords, entry.function.params, MethodParamGenerator);
        JSDoc.parseReturns(entry.keywords, entry.function.returns);
        MethodParser.parseEntrySyntax(entry.function, property, {
          syntaxPrefix: `${kind.description} `,
        });
      }
    }

    PropParser.parseEntryCommentType(entry);
    KeywordsUtils.mergeEntryKeyword(entry, Tag.default, Type.string);
    KeywordsUtils.parseCommonEntryTags(entry);
  }

  parseEntry(entry, node, camelName) {
    if (this.source.attrs.setup) {
      entry.describeModel = camelName === 'modelValue';
    }

    this.parseEntryComment(entry, node, camelName);
    KeywordsUtils.mergeEntryKeyword(entry, Tag.type);
    this.emit(entry);
  }

  parseArrayExpression(node) {
    node.elements.forEach((item) => {
      const name = toKebabCase(item.value);
      const entry = new PropEntry(name, { required: true });

      this.root.setScopeValue(entry.name, item, UndefinedValue);
      this.parseEntry(entry, item, item.value);
    });
  }

  parseObjectExpression(node) {
    node.properties
      .filter(({ type }) => type === Syntax.ObjectProperty)
      .forEach((item) => this.parseObjectExpressionProperty(item));
  }

  parseObjectExpressionProperty(property) {
    const camelName = this.parseKey(property);
    const kebabName = toKebabCase(camelName);
    const type = this.getPropType(property.value);
    const value = this.getPropValue(property.value, type);
    const entry = new PropEntry(kebabName, {
      type: Value.parseNativeType(type.value),
      value: value?.raw,
      required: type.required,
    });

    const ref = new Value(entry.type, value?.value, value?.raw);

    ref.member = true;

    if (this.root.model) {
      if (camelName === this.root.model.prop) {
        entry.describeModel = true;
      }
    } else if (camelName === 'value') {
      entry.describeModel = true;
    }

    this.root.setScopeValue(camelName, property.value, ref);
    this.parseEntry(entry, property, camelName);
  }

  parsePropTypeMember(node) {
    switch (node.type) {
      case Syntax.MemberExpression:
        if (node.object.name === PROP_TYPES_OBJECT_NAME) {
          return parsePropTypeMemberProperty(node.property);
        }
        break;

      case Syntax.CallExpression:
        if (node.callee.type !== Syntax.MemberExpression) {
          return Type.unknown;
        }

        if (node.callee.object.name === PROP_TYPES_OBJECT_NAME) {
          const [argument] = node.arguments;

          if (!argument) {
            break;
          }

          switch (node.callee.property.name) {
            case PROP_TYPES_INSTANCE_OF:
              return this.getSourceString(argument);

            case PROP_TYPES_ARRAY_OF: {
              const type = this.parsePropTypeMember(argument) || Type.unknown;

              return `${type}[]`;
            }

            case PROP_TYPES_ONE_OF:
            case PROP_TYPES_ONE_OF_TYPE:
              if (argument.type === Syntax.ArrayExpression) {
                return argument.elements.map((item) => {
                  return this.parsePropTypeMember(item) || this.getSourceString(item);
                });
              }

              return this.getSourceString(argument);

            case PROP_TYPES_OBJECT_OF:
              return this.parsePropTypeMember(argument) || Type.unknown;

            case PROP_TYPES_SHAPE:
              return this.getInlineSourceString(argument).replace(PROP_TYPES_OBJECT_MEMBER_RE, '');
          }
        }
        break;
    }

    return null;
  }

  getObjectValueByName(name, node) {
    const propNode = node?.properties?.find((prop) => prop.key.name === name);

    return propNode?.value || propNode;
  }

  getTSTypeRaw(node, defaultType = Type.unknown) {
    switch (node.type) {
      case Syntax.TSTypeReference:
        if (PROPS_TS_EXPRESSIONS.includes(node.typeName.name)) {
          return super.getTSTypeRaw(node.typeParameters);
        }
        break;
    }

    return super.getTSTypeRaw(node, defaultType);
  }

  getPropType(node) {
    const nodeType = node.type === Syntax.TSAsExpression
      ? node
      : this.getObjectValueByName('type', node.expression || node) || node;

    const nodeRequired = this.getObjectValueByName('required', node.expression || node);
    const ref = this.getValue(nodeType);
    let type = ref.value.type || UndefinedValue.type;
    let required = nodeRequired
      ? this.getValue(nodeRequired).value
      : ref.value.required ? ref.value.required.value : false;

    switch (nodeType.type) {
      case Syntax.Identifier:
      case Syntax.ArrayExpression:
        type = ref.value;
        break;

      case Syntax.TSAsExpression:
        type = this.getTSTypeRaw(nodeType, type);
        break;

      case Syntax.MemberExpression:
        switch (nodeType.object.type) {
          case Syntax.Identifier:
            if (nodeType.object.name === PROP_TYPES_OBJECT_NAME) {
              type = parsePropTypeMemberProperty(nodeType.property);
            } else {
              type = this.getInlineSourceString(nodeType);
            }
            break;

          case Syntax.MemberExpression:
            if (nodeType.object.object.name === PROP_TYPES_OBJECT_NAME) {
              type = parsePropTypeMemberProperty(nodeType.object.property);
            }

            required = nodeType.property.name === PROP_TYPES_IS_REQUIRED_PROPERTY;
            break;

          default:
            type = this.getInlineSourceString(nodeType);
            break;
        }
        break;

      default:
        type = this.parsePropTypeMember(nodeType) || type;
        break;
    }

    return {
      required,
      value: this.getTSType(nodeType, type),
    };
  }

  getPropValue(node, type) {
    let value;
    const nodeValue = this.getObjectValueByName('default', node.expression || node);

    if (nodeValue) {
      value = this.getPropValueNode(nodeValue, type.value);
    }

    return value;
  }

  getPropValueNode(nodeValue, type) {
    let value;

    if (nodeValue) {
      if (PropParser.isFunction(nodeValue) && Value.isNativeType(type) && Value.parseNativeType(type) !== Type.function) {
        if (nodeValue.body.body) {
          if (nodeValue.body.body.length === 1 && nodeValue.body.body[0].type === Syntax.ReturnStatement) {
            value = this.getValue(nodeValue.body.body[0].argument);
          }
        } else if (nodeValue.body) {
          value = this.getValue(nodeValue.body);
        }
      } else {
        value = this.getValue(nodeValue);
      }
    }

    return value;
  }

  getFunctionExpressionValue(node) {
    return this.getFunctionExpressionStringValue(node);
  }

  getFunctionExpressionStringValue(node) {
    const declaration = node.type === Syntax.ArrowFunctionExpression
      ? this.getInlineSourceString(node)
      : 'function() ' + this.getSourceString(node.body);

    return new Value(Type.function, declaration, declaration);
  }
}
