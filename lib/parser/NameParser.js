const { AbstractLiteralParser } = require('./AbstractLiteralParser')
const { NameEntry } = require('../entity/NameEntry')
const { UndefinedValue } = require('../entity/Value')

class NameParser extends AbstractLiteralParser {
  parseObjectProperty (node) {
    const ref = this.getValue(node.value)
    const name = ref.type === 'string' ? ref.value : UndefinedValue.value
    const entry = new NameEntry(name)

    this.emit(entry)
  }
}

module.exports.NameParser = NameParser
