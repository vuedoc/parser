const { AbstractCategorizeEntry } = require('./AbstractCategorizeEntry')
const { DEFAULT_TYPE } = require('../Enum')

class MethodEntry extends AbstractCategorizeEntry {
  constructor (name, params = []) {
    super('method')

    this.name = name
    this.params = params
    this.return = new MethodReturn()
  }
}

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

class MethodReturn {
  constructor () {
    this.type = 'void'
    this.description = ''
  }
}

module.exports.MethodEntry = MethodEntry
module.exports.MethodParamGenerator = methodParamGenerator()
