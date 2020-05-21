const { DEFAULT_TYPE } = require('../Enum')

class MethodParam {
  constructor () {
    this.name = ''
    this.declaration = ''
    this.type = DEFAULT_TYPE
    this.description = ''
    this.defaultValue = undefined
  }
}

module.exports.MethodParam = MethodParam
