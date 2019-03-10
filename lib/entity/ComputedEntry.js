const { DataEntry } = require('./DataEntry')

class ComputedEntry extends DataEntry {
  constructor () {
    super('computed')

    this.dependencies = []
  }
}

module.exports.ComputedEntry = ComputedEntry
