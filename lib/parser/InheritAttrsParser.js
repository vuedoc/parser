const { AbstractLiteralParser } = require('./AbstractLiteralParser')
const { InheritAttrsEntry } = require('../entity/InheritAttrsEntry')

class InheritAttrsParser extends AbstractLiteralParser {
  parse (node) {
    const { value } = this.getValue(node)
    const entry = new InheritAttrsEntry(value)

    this.emit(entry)
  }
}

module.exports.InheritAttrsParser = InheritAttrsParser
