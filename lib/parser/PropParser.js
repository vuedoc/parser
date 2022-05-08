import { toKebabCase } from '@b613/utils/lib/string';
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

const PROP_OPTIONS = 'PropOptions';

function parsePropTypeMemberProperty (property) {
  switch (property.name) {
    case 'bool':
      return Type.boolean;

    case 'func':
      return Type.function;
  }

  return property.name;
}

export class PropParser extends AbstractExpressionParser {
  static parseEntryCommentType (entry) {
    const items = KeywordsUtils.extract(entry.keywords, Tag.type);

    if (items.length) {
      entry.type = JSDoc.parseType(items.pop().description);
    }
  }

  parseEntryComment (entry, property, camelName) {
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

  parseEntry (entry, node, camelName) {
    this.parseEntryComment(entry, node, camelName);
    this.emit(entry);
  }

  parseArrayExpression (node) {
    node.elements.forEach((item) => {
      const name = toKebabCase(item.value);
      const entry = new PropEntry(name);

      this.root.setScopeValue(entry.name, item, UndefinedValue);
      this.parseEntry(entry, item, item.value);
    });
  }

  parseObjectExpression (node) {
    node.properties
      .filter(({ type }) => type === Syntax.ObjectProperty)
      .forEach((item) => this.parseObjectExpressionProperty(item));
  }

  parseObjectExpressionProperty (property) {
    const camelName = this.parseKey(property);
    const name = toKebabCase(camelName);
    const ref = this.getPropType(property.value);
    const entry = new PropEntry(name, {
      type: ref.value.type,
      value: ref.value.default,
      required: ref.value.required,
    });

    ref.member = true;

    if (this.root.model) {
      if (name === this.root.model.prop) {
        entry.describeModel = true;
      }
    } else if (name === 'value') {
      entry.describeModel = true;
    }

    this.root.setScopeValue(camelName, property.value, ref);
    this.parseEntry(entry, property, camelName);
  }

  parsePropTypeMember (node) {
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

  getValue (node) {
    switch (node.type) {
      case Syntax.ArrayExpression: {
        const value = node.elements.map((element) => this.getValue(element).raw);

        return new Value(Type.array, value);
      }
    }

    return super.getValue(node);
  }

  getTypeProperty (properties = []) {
    const propNode = properties.find((prop) => this.getValue(prop.key).value === 'type');

    return propNode ? propNode.value : propNode;
  }

  getTSTypeRaw (node, defaultType = Type.unknown) {
    switch (node.type) {
      case Syntax.TSTypeReference:
        if (node.typeName.name === PROP_OPTIONS) {
          return super.getTSTypeRaw(node.typeParameters);
        }
        break;
    }

    return super.getTSTypeRaw(node, defaultType);
  }

  getPropType (node) {
    const ref = this.getValue(node);
    const nodeType = this.getTypeProperty(node.properties) || node;
    let type = ref.value.type ? ref.value.type.value : UndefinedValue.type;
    let required = ref.value.required ? ref.value.required.value : false;

    switch (node.type) {
      case Syntax.Identifier:
      case Syntax.ArrayExpression:
        type = ref.value;
        break;

      case Syntax.MemberExpression:
        switch (node.object.type) {
          case Syntax.Identifier:
            if (node.object.name === PROP_TYPES_OBJECT_NAME) {
              type = parsePropTypeMemberProperty(node.property);
            }
            break;

          case Syntax.MemberExpression:
            if (node.object.object.name === PROP_TYPES_OBJECT_NAME) {
              type = parsePropTypeMemberProperty(node.object.property);
            }

            required = node.property.name === PROP_TYPES_IS_REQUIRED_PROPERTY;
            break;
        }
        break;

      default:
        type = this.parsePropTypeMember(node) || type;
        break;
    }

    ref.value = {
      type: this.getTSType(nodeType, type),
      default: ref.value.default ? ref.value.default.raw : undefined,
      required,
    };

    ref.type = ref.value.type;
    ref.raw = ref.value;

    return ref;
  }

  getFunctionExpressionValue (node) {
    return this.getFunctionExpressionStringValue(node);
  }

  getFunctionExpressionStringValue (node) {
    const declaration = node.type === Syntax.ArrowFunctionExpression
      ? this.getInlineSourceString(node)
      : 'function() ' + this.getSourceString(node.body);

    return new Value(Type.function, declaration, declaration);
  }
}
