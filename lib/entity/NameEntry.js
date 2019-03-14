const { LiteralEntry } = require('./LiteralEntry')

class NameEntry extends LiteralEntry {
  constructor () {
    super('name')
  }
}

module.exports.NameEntry = NameEntry
