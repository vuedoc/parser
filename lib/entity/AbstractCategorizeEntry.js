const { AbstractDecorativeEntry } = require('./AbstractDecorativeEntry')
const { Visibility } = require('../Enum')

class AbstractCategorizeEntry extends AbstractDecorativeEntry {
  constructor (kind, description = '') {
    super(kind, description)

    this.category = null
    this.visibility = Visibility.public
  }
}

module.exports.AbstractCategorizeEntry = AbstractCategorizeEntry
