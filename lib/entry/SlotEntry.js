const { DecorateEntry } = require('./DecorateEntry')

class SlotEntry extends DecorateEntry {
  constructor () {
    super('slot')

    this.name = null
  }
}

module.exports.SlotEntry = SlotEntry
