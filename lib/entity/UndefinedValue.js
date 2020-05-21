const { Value } = require('./Value')

class UndefinedValue extends Value {
  constructor () {
    super('any')

    this.value = 'undefined'
  }
}

module.exports.UndefinedValue = UndefinedValue
