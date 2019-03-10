const { UNDEFINED } = require('../Enum')

class MethodParam {
  constructor () {
    this.name = null
    this.declaration = null
    this.type = null
    this.description = null
    this.defaultValue = UNDEFINED
  }
}

module.exports.MethodParam = MethodParam
