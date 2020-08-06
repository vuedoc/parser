const { AbstractDecorativeEntry } = require('./AbstractDecorativeEntry')
const { Visibilities } = require('../Enum')

class AbstractCategorizeEntry extends AbstractDecorativeEntry {
  constructor (kind, description = '') {
    super(kind, description)

    this.category = null
    this.visibility = Visibilities.public
  }
}

module.exports.AbstractCategorizeEntry = AbstractCategorizeEntry
