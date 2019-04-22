const { UNDEFINED } = require('../Enum')

const nativeTypes = [
  'String', 'Number', 'Array', 'Boolean',
  'Object', 'Null', 'Symbol', 'Undefined', 'BigInt'
]

class Value {
  constructor (type = UNDEFINED, value = UNDEFINED) {
    this.type = type
    this.value = value
  }

  static parseNativeType (type) {
    if (nativeTypes.includes(type)) {
      return type.toLowerCase()
    }

    return UNDEFINED
  }
}

module.exports.Value = Value
