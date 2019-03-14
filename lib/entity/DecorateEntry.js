const { AbstractEntry } = require('./AbstractEntry')

class DecorateEntry extends AbstractEntry {
  constructor (kind) {
    super(kind)

    this.visibility = 'public'
    this.description = null
    this.keywords = []
  }
}

module.exports.DecorateEntry = DecorateEntry
