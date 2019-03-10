const { DataEntry } = require('./DataEntry')
const { UNDEFINED } = require('../Enum')

class PropEntry extends DataEntry {
  constructor () {
    super('prop')

    this.required = false
    this.validator = UNDEFINED
  }
}

module.exports.PropEntry = PropEntry
