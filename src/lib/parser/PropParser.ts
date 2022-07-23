import { AbstractExpressionParser } from './AbstractExpressionParser.js';
import { Value, UndefinedValue } from '../entity/Value.js';
import { PropEntry } from '../entity/PropEntry.js';

import { JSDoc } from '../JSDoc.js';
import { Syntax, Type, Tag } from '../Enum.js';

import { KeywordsUtils } from '../utils/KeywordsUtils.js';
import { MethodReturns, MethodParamGenerator } from '../entity/MethodEntry.js';
import { MethodParser } from './MethodParser.js';
import * as Babel from '@babel/types';

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
  defaultsProperties: Record<string, Babel.ObjectProperty> = {};

  static parseEntryCommentType(entry) {
    const items = KeywordsUtils.extract(entry.keywords, Tag.type);
    const item = items.pop();

    if (item && item.description) {
      entry.type = JSDoc.parseType(item.description);
    }
  }

  parse(node) {
    if (node.typeParameters) {
      this.parseTSTypeParameterInstantiation(node.typeParameters);
    } else {
      super.parse(node);
    }
  }

  parseTSTypeParameterInstantiation(node: Babel.TSTypeParameterInstantiation) {
    const param = node.params[0];

    switch (param?.type) {
      case Syntax.TSTypeLiteral:
        this.parseTSTypeLiteral(param);
        break;

      case Syntax.TSTypeReference:
        if ('name' in param.typeName && param.typeName.name in this.scope) {
          const node = this.scope[param.typeName.name].node;

          if (node) {
            this.parseTSTypeReference(node.type);
          }
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
    const type = this.getTSType(member);
    let value: Value;

    if (member.key.name in this.defaultsProperties) {
      const defaultNode = this.defaultsProperties[member.key.name];

      value = this.getPropValueNode(defaultNode.value, type);

      this.setScopeValue(member.key.name, member, value, { global: true });
    } else {
      const variable = this.scope[member.key.name];

      value = variable?.value.type === type
        ? variable.value
        : this.getPropValueNode(variable?.node?.value, type);

      if (value && value === variable?.value) {
        this.setScopeValue(member.key.name, member, value, { global: true });
      }
    }

    const entry = new PropEntry({
      type,
      name: member.key.name,
      required: !member.optional,
      defaultValue: value?.raw,
    });

    if (value) {
      value.member = true;
    }

    this.parseEntry(entry, member, member.key.name);
  }

  parseWithDefaultsCall(node) {
    if (node.arguments[0]?.type === Syntax.CallExpression) {
      const defaultsNode = node.arguments[1];

      if (defaultsNode && defaultsNode.type === Syntax.ObjectExpression) {
        for (const property of defaultsNode.properties) {
          this.defaultsProperties[property.key.name] = property;
        }
      }

      this.parse(node.arguments[0]);
    }
  }

  parsePropEntryComment(entry: PropEntry, property, camelName: string) {
    super.parseEntryComment(entry, property);

    const kinds = KeywordsUtils.extract(entry.keywords, Tag.kind, true);

    if (kinds.length) {
      const kind = kinds.pop();

      if (kind?.description === 'function') {
        entry.function = {
          params: [],
          syntax: [],
          name: camelName,
          description: entry.description,
          keywords: entry.keywords,
          returns: new MethodReturns(Type.unknown),
        };

        entry.function.keywords = entry.keywords;
        entry.function.description = entry.description;
        entry.function.returns.type = Type.unknown;

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

  parseEntry(entry: PropEntry, node, camelName: string) {
    if (entry.describeModel === false) {
      entry.describeModel = camelName === this.root.defaultModelPropName;
    }

    this.parsePropEntryComment(entry, node, camelName);
    KeywordsUtils.mergeEntryKeyword(entry, Tag.type);
    this.emit(entry);
  }

  parseArrayExpression(node) {
    node.elements.forEach((item) => {
      const entry = new PropEntry({ name: item.value, required: true });

      this.setScopeValue(entry.name, item, UndefinedValue, { global: true });
      this.parseEntry(entry, item, item.value);
    });
  }

  parseObjectExpression(node) {
    node.properties
      .filter(({ type }) => type === Syntax.ObjectProperty)
      .forEach((item) => this.parseObjectExpressionProperty(item));
  }

  parseObjectExpressionProperty(property) {
    const name = this.parseKey(property);
    const type = this.getPropType(property.value);
    const value = this.getPropValue(property.value, type);
    const entry = new PropEntry({
      name,
      type: type.value,
      defaultValue: value?.raw,
      required: type.required,
    });

    const ref = new Value(entry.type, value?.value, value?.raw);

    ref.member = true;

    this.setScopeValue(name, property.value, ref, { global: true });
    this.parseEntry(entry, property, name);
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
      } else if (nodeValue.type !== Syntax.CallExpression) {
        value = this.getValue(nodeValue);
      }
    }

    return value;
  }

  getFunctionExpressionValue(node) {
    return this.getFunctionExpressionStringValue(node);
  }

  getFunctionExpressionStringValue(node: Babel.ArrowFunctionExpression | Babel.FunctionExpression) {
    const declaration = node.type === Syntax.ArrowFunctionExpression
      ? this.getInlineSourceString(node)
      : 'function() ' + this.getSourceString(node.body);

    return new Value(Type.function, declaration, declaration);
  }
}
