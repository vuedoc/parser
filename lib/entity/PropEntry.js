const { DEFAULT_TYPE } = require('../Enum')
const { DecorateEntry } = require('./DecorateEntry')

class PropEntry extends DecorateEntry {
  // eslint-disable-next-line max-len
  constructor (name, { type = DEFAULT_TYPE, kind = type, value, required = false } = {}) {
    super('prop')

    this.name = name
    this.type = type
    this.nativeType = kind
    this.default = value
    this.required = required
    this.describeModel = false
  }
}

module.exports.PropEntry = PropEntry
