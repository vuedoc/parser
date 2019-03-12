const { AbstractParser } = require('./AbstractParser')

class AbstractLiteralParser extends AbstractParser {
  constructor (root, entry) {
    super(root)

    this.entry = entry
  }

  parse (node) {
    this.entry.value = this.getValue(node)

    this.emit(this.entry)
  }
}

module.exports.AbstractLiteralParser = AbstractLiteralParser
