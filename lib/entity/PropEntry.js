const { Value } = require('./Value')
const { DecorateEntry } = require('./DecorateEntry')

class PropEntry extends DecorateEntry {
  // eslint-disable-next-line max-len
  constructor (name, type, value = new Value(Value.parseNativeType(type)), required = false) {
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
