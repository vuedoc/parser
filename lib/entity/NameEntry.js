const { LiteralEntry } = require('./LiteralEntry')

class NameEntry extends LiteralEntry {
  constructor (value) {
    super('name', value)
  }
}

module.exports.NameEntry = NameEntry
