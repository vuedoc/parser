const { DEFAULT_TYPE } = require('../Enum')

const nativeTypes = [
  'String', 'Number', 'Array', 'Boolean', 'Function',
  'Object', 'Null', 'Symbol', 'Undefined', 'BigInt'
]

class Value {
  constructor (type = DEFAULT_TYPE, value = undefined, raw = value) {
    this.type = type
    this.value = value
    this.raw = raw
  }

  get kind() {
    return nativeTypes.includes(this.type)
      ? this.type.toLowerCase()
      : this.type
  }
}

function* undefinedValueGenerator() {
  while (true) {
    yield new Value(DEFAULT_TYPE, undefined, 'undefined')
  }
}

module.exports.Value = Value
module.exports.UndefinedValueGenerator = undefinedValueGenerator()
module.exports.UndefinedValue = this.UndefinedValueGenerator.next().value
module.exports.NullValue = new Value(DEFAULT_TYPE, null, 'null')
