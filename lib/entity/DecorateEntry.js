const { AbstractEntry } = require('./AbstractEntry')

class DecorateEntry extends AbstractEntry {
  constructor (kind, description = '') {
    super(kind)

    this.visibility = 'public'
    this.description = description
    this.keywords = []
  }
}

module.exports.DecorateEntry = DecorateEntry
