const { UNDEFINED } = require('../Enum')

class Value {
  constructor (type = UNDEFINED, value = UNDEFINED) {
    this.type = type
    this.value = value
  }
}

module.exports.Value = Value
