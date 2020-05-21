const { Syntax, UNDEFINED, DEFAULT_TYPE } = require('../Enum')

const nativeTypes = [
  'String', 'Number', 'Array', 'Boolean',
  'Object', 'Null', 'Symbol', 'Undefined', 'BigInt'
]

class Value {
  constructor (type = UNDEFINED, value = UNDEFINED) {
    this.type = type
    this.value = value
  }

  get kind() {
    switch (this.type) {
      case Syntax.TemplateLiteral:
      case Syntax.TaggedTemplateExpression:
        return 'string'

      case Syntax.UnaryExpression:
        return typeof this.value
    }

    return Value.parseNativeType(this.type, this.type)
  }

  static parse(value, type = typeof value) {
    switch (type) {
      case 'null':
        return DEFAULT_TYPE

      case 'bigint':
      case 'TemplateLiteral':
        return value

      case 'string':
        return JSON.stringify(value)

      case 'boolean':
        if (value === true) {
          return 'true'
        }

        if (value === false) {
          return 'false'
        }

        return value

      case 'undefined':
        return 'undefined'

      default:
        if (value === null) {
          return 'null'
        }
    }

    return `${value}`
  }

  static parseNativeType (type, defaultType = UNDEFINED) {
    if (nativeTypes.includes(type)) {
      return type.toLowerCase()
    }

    return defaultType
  }
}

module.exports.Value = Value
