const { DEFAULT_TYPE } = require('../Enum')

class EventArgument {
  constructor (name) {
    this.name = name
    this.declaration = ''
    this.type = DEFAULT_TYPE
    this.description = ''
  }
}

module.exports.EventArgument = EventArgument
