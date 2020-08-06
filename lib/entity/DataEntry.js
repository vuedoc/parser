const { DecorateEntry } = require('./DecorateEntry')

class DataEntry extends DecorateEntry {
  constructor (name, { type, value }) {
    super('data')

    this.name = name
    this.type = type
    this.initialValue = value
  }
}

module.exports.DataEntry = DataEntry
