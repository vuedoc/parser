const { AbstractLiteralParser } = require('./AbstractLiteralParser')
const { NameEntry } = require('../entity/NameEntry')

const { Features } = require('../Enum')

class NameParser extends AbstractLiteralParser {
  parse (node) {
    if (!this.features.includes(Features.name)) {
      return
    }

    const { value } = this.getValue(node)
    const entry = new NameEntry(value)

    this.emit(entry)
  }
}

module.exports.NameParser = NameParser
