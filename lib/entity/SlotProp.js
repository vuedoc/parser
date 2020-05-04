const { DEFAULT_TYPE } = require('../Enum')

class SlotProp {
  constructor (name, type = DEFAULT_TYPE, description = '') {
    this.name = name
    this.type = type
    this.description = description
  }
}

module.exports.SlotProp = SlotProp
