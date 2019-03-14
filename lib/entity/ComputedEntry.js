const { DecorateEntry } = require('./DecorateEntry')

class ComputedEntry extends DecorateEntry {
  constructor (name) {
    super('computed')

    this.name = name
    this.dependencies = []
  }
}

module.exports.ComputedEntry = ComputedEntry
