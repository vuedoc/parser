const { AbstractEntry } = require('./AbstractEntry')

class LiteralEntry extends AbstractEntry {
  constructor (kind, value = undefined) {
    super(kind)

    this.value = value
  }
}

module.exports.LiteralEntry = LiteralEntry
