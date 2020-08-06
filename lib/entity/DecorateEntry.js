const { AbstractEntry } = require('./AbstractEntry')
const { Visibilities } = require('../Enum')

class DecorateEntry extends AbstractEntry {
  constructor (kind, description = '') {
    super(kind)

    this.visibility = Visibilities.public
    this.description = description
    this.keywords = []
  }
}

module.exports.DecorateEntry = DecorateEntry
