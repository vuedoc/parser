const { DecorateEntry } = require('./DecorateEntry')

const DEFAULT_SLOT_NAME = 'default'

class SlotEntry extends DecorateEntry {
  constructor (name, description = '') {
    super('slot', description)

    this.name = name || DEFAULT_SLOT_NAME
    this.props = []
  }
}

module.exports.SlotEntry = SlotEntry
