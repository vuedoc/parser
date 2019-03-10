const { DecorateEntry } = require('./DecorateEntry')
const { UNDEFINED } = require('../Enum')

class DataEntry extends DecorateEntry {
  constructor (type = 'data') {
    super(type)

    this.name = null
    this.default = UNDEFINED
  }
}

module.exports.DataEntry = DataEntry
