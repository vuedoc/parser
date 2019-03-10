const { LiteralEntry } = require('./LiteralEntry')

class KeywordsEntry extends LiteralEntry {
  constructor (keywords) {
    super('keywords')

    this.value = keywords
  }
}

module.exports.KeywordsEntry = KeywordsEntry
