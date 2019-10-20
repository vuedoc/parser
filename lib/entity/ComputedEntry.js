const { DecorateEntry } = require('./DecorateEntry')

class ComputedEntry extends DecorateEntry {
  constructor (name, dependencies = []) {
    super('computed')

    this.name = name
    this.dependencies = dependencies
  }
}

module.exports.ComputedEntry = ComputedEntry
