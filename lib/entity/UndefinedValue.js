const { Value } = require('./Value')

class UndefinedValue extends Value {
  constructor () {
    super('undefined')

    this.value = undefined
  }
}

module.exports.UndefinedValue = UndefinedValue
