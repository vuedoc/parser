const { DecorateEntry } = require('./DecorateEntry')

class SlotEntry extends DecorateEntry {
  constructor (name, description = '') {
    super('slot', description)

    this.name = name || 'default'
    this.props = []
  }
}

module.exports.SlotEntry = SlotEntry
