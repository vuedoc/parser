const { AbstractExpressionParser } = require('./AbstractExpressionParser')
const { Value, UndefinedValue } = require('../entity/Value')
const { PropEntry } = require('../entity/PropEntry')

const { JSDoc } = require('../JSDoc')
const { Syntax, Type, Tag } = require('../Enum')

const { StringUtils } = require('../utils/StringUtils')
const { KeywordsUtils } = require('../utils/KeywordsUtils')

const MODEL_KEYWORD = 'model'
const PROP_TYPES_OBJECT_NAME = 'PropTypes'
const PROP_TYPES_ONE_OF = 'oneOf'
const PROP_TYPES_ONE_OF_TYPE = 'oneOfType'
const PROP_TYPES_INSTANCE_OF = 'instanceOf'
const PROP_TYPES_ARRAY_OF = 'arrayOf'
const PROP_TYPES_OBJECT_OF = 'objectOf'
const PROP_TYPES_SHAPE = 'shape'
const PROP_TYPES_IS_REQUIRED_PROPERTY = 'isRequired'

const PROP_TYPES_OBJECT_MEMBER_RE = new RegExp(`${PROP_TYPES_OBJECT_NAME}\\.`, 'g')

function parsePropTypeMemberProperty (property) {
  switch (property.name) {
    case 'bool':
      return Type.boolean

    case 'func':
      return Type.function
  }

  return property.name
}

class PropParser extends AbstractExpressionParser {
  static parseEntryCommentType (entry) {
    const items = KeywordsUtils.extract(entry.keywords, Tag.type)

    if (items.length) {
      entry.type = JSDoc.parseType(items.pop().description)
    }
  }

  parseEntryComment (entry, property) {
    super.parseEntryComment(entry, property)

    const modelKeywordIndex = entry.keywords.findIndex(({ name }) => {
      return name === MODEL_KEYWORD
    })

    if (modelKeywordIndex > -1) {
      entry.describeModel = true

      entry.keywords.splice(modelKeywordIndex, 1)
    }

    AbstractExpressionParser.parseEntryCategory(entry)
    AbstractExpressionParser.mergeEntryKeyword(entry, Tag.default)
    PropParser.parseEntryCommentType(entry)
  }

  parseEntry (entry, node) {
    this.parseEntryComment(entry, node)
    this.emit(entry)
  }

  parseArrayExpression (node) {
    node.elements.forEach((item) => {
      const name = StringUtils.toKebabCase(item.value)
      const entry = new PropEntry(name)

      this.root.scope[entry.name] = UndefinedValue.value

      this.parseEntry(entry, item)
    })
  }

  parseObjectExpression (node) {
    node.properties
      .filter(({ type }) => type === Syntax.ObjectProperty)
      .forEach((item) => this.parseObjectExpressionProperty(item))
  }

  parseObjectExpressionProperty (property) {
    const camelName = this.parseKey(property)
    const name = StringUtils.toKebabCase(camelName)
    const { type, required, value } = this.getPropType(property.value)

    const entry = new PropEntry(name, { type, value, required })

    if (this.root.model) {
      if (name === this.root.model.prop) {
        entry.describeModel = true
      }
    } else if (name === 'value') {
      entry.describeModel = true
    }

    this.root.scope[camelName] = entry.default

    this.parseEntry(entry, property)
  }

  parsePropTypeMember (node) {
    switch (node.type) {
      case Syntax.MemberExpression:
        if (node.object.name === PROP_TYPES_OBJECT_NAME) {
          return parsePropTypeMemberProperty(node.property)
        }
        break

      case Syntax.CallExpression:
        if (node.callee.type !== Syntax.MemberExpression) {
          return Type.any
        }

        if (node.callee.object.name === PROP_TYPES_OBJECT_NAME) {
          const [ argument ] = node.arguments

          if (!argument) {
            break
          }

          switch (node.callee.property.name) {
            case PROP_TYPES_INSTANCE_OF:
              return this.getSourceString(argument)

            case PROP_TYPES_ARRAY_OF: {
              const type = this.parsePropTypeMember(argument) || Type.any

              return `${type}[]`
            }

            case PROP_TYPES_ONE_OF:
            case PROP_TYPES_ONE_OF_TYPE:
              if (argument.type === Syntax.ArrayExpression) {
                return argument.elements.map((item) => {
                  return this.parsePropTypeMember(item) || this.getSourceString(item)
                })
              }

              return this.getSourceString(argument)

            case PROP_TYPES_OBJECT_OF:
              return this.parsePropTypeMember(argument) || Type.any

            case PROP_TYPES_SHAPE:
              return this.getInlineSourceString(argument).replace(PROP_TYPES_OBJECT_MEMBER_RE, '')
          }
        }
        break
    }

    return null
  }

  getValue (node) {
    switch (node.type) {
      case Syntax.ArrayExpression: {
        const value = node.elements.map((element) => this.getValue(element).raw)

        return new Value(Type.array, value)
      }
    }

    return super.getValue(node)
  }

  getPropType (node) {
    const ref = this.getValue(node)
    let type = ref.value.type ? ref.value.type.value : UndefinedValue.type
    let required = ref.value.required ? ref.value.required.value : false
    const value = ref.value.default ? ref.value.default.raw : undefined

    switch (node.type) {
      case Syntax.Identifier:
      case Syntax.ArrayExpression:
        type = ref.value
        break

      case Syntax.MemberExpression:
        switch (node.object.type) {
          case Syntax.Identifier:
            if (node.object.name === PROP_TYPES_OBJECT_NAME) {
              type = parsePropTypeMemberProperty(node.property)
            }
            break

          case Syntax.MemberExpression:
            if (node.object.object.name === PROP_TYPES_OBJECT_NAME) {
              type = parsePropTypeMemberProperty(node.object.property)
            }

            required = node.property.name === PROP_TYPES_IS_REQUIRED_PROPERTY
            break
        }
        break

      default:
        type = this.parsePropTypeMember(node) || type
        break
    }

    return { type, value, required }
  }

  getFunctionExpressionValue (node) {
    return this.getFunctionExpressionStringValue(node)
  }

  getFunctionExpressionStringValue (node) {
    const declaration = node.type === Syntax.ArrowFunctionExpression
      ? this.getSourceString(node)
      : 'function() ' + this.getSourceString(node.body)

    return new Value(Type.function, declaration, declaration)
  }
}

module.exports.PropParser = PropParser
