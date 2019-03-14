const { Value } = require('./Value')
const { DecorateEntry } = require('./DecorateEntry')

class PropEntry extends DecorateEntry {
  constructor (name, type, value = new Value(), required = false) {
    super('prop')

    this.name = name
    this.type = type
    this.nativeType = value.type
    this.default = value.value
    this.required = required
    this.describeModel = false
  }
}

module.exports.PropEntry = PropEntry
