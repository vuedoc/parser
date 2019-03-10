const { AbstractEntry } = require('./AbstractEntry')

class DecorateEntry extends AbstractEntry {
  constructor (type) {
    super(type)

    this.visibility = null
    this.description = null
    this.keywords = []
  }
}

module.exports.DecorateEntry = DecorateEntry
