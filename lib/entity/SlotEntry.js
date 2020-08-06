const { AbstractCategorizeEntry } = require('./AbstractCategorizeEntry')
const { DEFAULT_TYPE } = require('../Enum')

const DEFAULT_SLOT_NAME = 'default'

class SlotEntry extends AbstractCategorizeEntry {
  constructor (name, description = '') {
    super('slot', description)

    this.name = name || DEFAULT_SLOT_NAME
    this.props = []
  }
}

class SlotProp {
  constructor (name, type = DEFAULT_TYPE, description = '') {
    this.name = name
    this.type = type
    this.description = description
  }
}

function* slotPropGenerator() {
  while (true) {
    yield new SlotProp()
  }
}

module.exports.SlotEntry = SlotEntry
module.exports.SlotPropGenerator = slotPropGenerator()
module.exports.SlotProp = SlotProp
