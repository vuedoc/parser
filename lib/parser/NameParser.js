const { AbstractLiteralParser } = require('./AbstractLiteralParser')
const { NameEntry } = require('../entity/NameEntry')

const { Features, UNDEFINED } = require('../Enum')

class NameParser extends AbstractLiteralParser {
  parse (node) {
    if (!this.features.includes(Features.name)) {
      return
    }

    const ref = this.getValue(node)
    const name = ref.type === 'string' ? ref.value : UNDEFINED
    const entry = new NameEntry(name)

    this.emit(entry)
  }
}

module.exports.NameParser = NameParser
