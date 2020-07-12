const { Syntax, UNDEFINED } = require('../Enum')

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

  static parseNativeType (type, defaultType = UNDEFINED) {
    if (nativeTypes.includes(type)) {
      return type.toLowerCase()
    }

    return defaultType
  }
}

module.exports.Value = Value
