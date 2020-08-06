const { DEFAULT_TYPE } = require('../Enum')
const { AbstractCategorizeEntry } = require('./AbstractCategorizeEntry')

class PropEntry extends AbstractCategorizeEntry {
  // eslint-disable-next-line max-len
  constructor (name, { type = DEFAULT_TYPE, value, required = false, describeModel = false } = {}) {
    super('prop')

    this.name = name
    this.type = type
    this.default = value
    this.required = required
    this.describeModel = describeModel
  }
}

module.exports.PropEntry = PropEntry
