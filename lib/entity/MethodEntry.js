const { DecorateEntry } = require('./DecorateEntry')
const { MethodReturn } = require('./MethodReturn')

class MethodEntry extends DecorateEntry {
  constructor (name, params) {
    super('method')

    this.name = name
    this.params = params
    this.return = new MethodReturn()
  }
}

module.exports.MethodEntry = MethodEntry
