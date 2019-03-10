const { LiteralEntry } = require('./LiteralEntry')

class DescriptionEntry extends LiteralEntry {
  constructor () {
    super('description')
  }
}

module.exports.DescriptionEntry = DescriptionEntry
