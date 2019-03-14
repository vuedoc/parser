const { AbstractEntry } = require('./AbstractEntry')

class LiteralEntry extends AbstractEntry {
  constructor (kind) {
    super(kind)

    this.value = null
  }
}

module.exports.LiteralEntry = LiteralEntry
