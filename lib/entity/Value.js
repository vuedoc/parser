const { DEFAULT_TYPE } = require('../Enum')

const nativeTypes = [
  'String', 'Number', 'Array', 'Boolean',
  'Object', 'Null', 'Symbol', 'Undefined', 'BigInt'
]

class Value {
  constructor (type = DEFAULT_TYPE, value = undefined, raw = 'undefined') {
    this.type = type
    this.value = value
    this.raw = raw
  }

  get kind() {
    return Value.parseNativeType(this.type, this.type)
  }

  static parseNativeType (type, defaultType = DEFAULT_TYPE) {
    if (nativeTypes.includes(type)) {
      return type.toLowerCase()
    }

    return defaultType
  }
}

module.exports.Value = Value
module.exports.UndefinedValue = new Value(DEFAULT_TYPE, undefined, 'undefined')
module.exports.NullValue = new Value(DEFAULT_TYPE, null, 'null')
