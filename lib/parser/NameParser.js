const { LiteralParser } = require('./LiteralParser')
const { NameEntry } = require('../entry/NameEntry')

class NameParser extends LiteralParser {
  constructor (root) {
    super(root, new NameEntry())
  }
}

module.exports.NameParser = NameParser
