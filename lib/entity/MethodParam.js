const { DEFAULT_TYPE, UNDEFINED } = require('../Enum')

class MethodParam {
  constructor () {
    this.name = ''
    this.declaration = ''
    this.type = DEFAULT_TYPE
    this.description = ''
    this.defaultValue = UNDEFINED
  }
}

module.exports.MethodParam = MethodParam
