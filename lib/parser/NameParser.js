const { AbstractLiteralParser } = require('./AbstractLiteralParser')
const { NameEntry } = require('../entity/NameEntry')

const { Features } = require('../Enum')

class NameParser extends AbstractLiteralParser {
  constructor (root) {
    super(root, new NameEntry())
  }

  parse (node) {
    if (this.features.includes(Features.name)) {
      super.parse(node)
    }
  }
}

module.exports.NameParser = NameParser
