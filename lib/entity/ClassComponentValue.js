const { Value } = require('./Value')

class ClassComponentValue extends Value {
  constructor (decorators, baseClassNode) {
    super('ClassComponent')

    this.value = { decorators, baseClassNode }
  }
}

module.exports.ClassComponentValue = ClassComponentValue
