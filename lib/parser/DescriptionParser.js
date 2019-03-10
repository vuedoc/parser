const { LiteralParser } = require('./LiteralParser')
const { DescriptionEntry } = require('../entry/DescriptionEntry')

class DescriptionParser extends LiteralParser {
  constructor (root) {
    super(root, new DescriptionEntry())
  }
}

module.exports.DescriptionParser = DescriptionParser
