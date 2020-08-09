const { AbstractCategorizeEntry } = require('./AbstractCategorizeEntry')
const { Type } = require('../Enum')

const ARRAY_BRAKET = '[]'

class MethodEntry extends AbstractCategorizeEntry {
  constructor (name, params) {
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

  static parse (param) {
    if (param.rest && !param.type.endsWith(ARRAY_BRAKET)) {
      param.type += ARRAY_BRAKET
    }
  }

  static toString (param) {
    let name = param.name
    let type = param.type

    if (param.optional) {
      name += '?'
    }

    if (param.type instanceof Array) {
      type = type.join(' | ')
    }

    if (param.rest) {
      return `...${param.name}: ${type}`
    }

    return param.defaultValue
      ? `${name}: ${type} = ${param.defaultValue}`
      : `${name}: ${type}`
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
module.exports.MethodParam = MethodParam
module.exports.MethodParamGenerator = methodParamGenerator()
