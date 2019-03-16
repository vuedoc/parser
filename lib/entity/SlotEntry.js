const { DecorateEntry } = require('./DecorateEntry')

class SlotEntry extends DecorateEntry {
  constructor (name) {
    super('slot')

    this.name = name || 'default'
  }
}

module.exports.SlotEntry = SlotEntry
