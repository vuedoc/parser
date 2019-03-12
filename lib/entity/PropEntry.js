const { DataEntry } = require('./DataEntry')
const { UNDEFINED } = require('../Enum')

class PropEntry extends DataEntry {
  constructor () {
    super('prop')

    this.type = 'Any'
    this.required = false
    this.validator = UNDEFINED
    this.describeModel = false
  }
}

module.exports.PropEntry = PropEntry
