const { LiteralEntry } = require('./LiteralEntry')

class InheritAttrsEntry extends LiteralEntry {
  constructor (value) {
    super('inheritAttrs', value)
  }
}

module.exports.InheritAttrsEntry = InheritAttrsEntry
