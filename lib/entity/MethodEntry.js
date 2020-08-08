const { AbstractCategorizeEntry } = require('./AbstractCategorizeEntry')
const { Type } = require('../Enum')

class MethodEntry extends AbstractCategorizeEntry {
  constructor (name, params = []) {
    super('method')

    this.name = name
    this.params = params
    this.syntax = []
    this.returns = new MethodReturn()
  }
}

class MethodParam {
  constructor () {
    this.name = ''
    this.type = Type.unknow
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

class MethodReturn {
  constructor () {
    this.type = Type.void
    this.description = ''
  }
}

module.exports.MethodEntry = MethodEntry
module.exports.MethodParamGenerator = methodParamGenerator()
