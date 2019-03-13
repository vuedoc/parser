const { DataEntry } = require('./DataEntry')

class PropEntry extends DataEntry {
  constructor () {
    super('prop')

    this.type = 'Any'
    this.required = false
    this.describeModel = false
  }
}

module.exports.PropEntry = PropEntry
