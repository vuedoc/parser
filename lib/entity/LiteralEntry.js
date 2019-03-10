const { AbstractEntry } = require('./AbstractEntry')

class LiteralEntry extends AbstractEntry {
  constructor (type) {
    super(type)

    this.value = null
  }
}

module.exports.LiteralEntry = LiteralEntry
