const { LiteralEntry } = require('./LiteralEntry')

class KeywordsEntry extends LiteralEntry {
  constructor () {
    super('keywords')
  }
}

module.exports.KeywordsEntry = KeywordsEntry
