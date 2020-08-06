const { DEFAULT_TYPE } = require('../Enum')

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

module.exports.SlotProp = SlotProp
module.exports.SlotPropGenerator = slotPropGenerator()
