const { DEFAULT_TYPE } = require('../Enum')

class MethodParam {
  constructor () {
    this.name = ''
    this.type = DEFAULT_TYPE
    this.description = ''
    this.defaultValue = undefined
    this.rest = false
  }
}

function* methodParamGenerator() {
  while (true) {
    yield new MethodParam()
  }
}

module.exports.MethodParam = MethodParam
module.exports.MethodParamGenerator = methodParamGenerator()
