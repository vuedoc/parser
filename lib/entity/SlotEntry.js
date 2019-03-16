const { DecorateEntry } = require('./DecorateEntry')

class SlotEntry extends DecorateEntry {
  constructor (name) {
    super('slot')

    this.name = name || 'default'
    this.props = []
  }
}

module.exports.SlotEntry = SlotEntry
