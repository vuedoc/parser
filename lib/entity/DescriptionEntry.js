const { LiteralEntry } = require('./LiteralEntry')

class DescriptionEntry extends LiteralEntry {
  constructor (description) {
    super('description')

    this.value = description
  }
}

module.exports.DescriptionEntry = DescriptionEntry
