const { AbstractLiteralParser } = require('./AbstractLiteralParser')
const { NameEntry } = require('../entity/NameEntry')

const { FEATURE_NAME } = require('../Enum')

class NameParser extends AbstractLiteralParser {
  constructor (root) {
    super(root, new NameEntry())
  }

  parse (node) {
    if (this.features.includes(FEATURE_NAME)) {
      super.parse(node)
    }
  }
}

module.exports.NameParser = NameParser
