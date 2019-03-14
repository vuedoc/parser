const { DecorateEntry } = require('./DecorateEntry')
const { Value } = require('./Value')

class EventEntry extends DecorateEntry {
  constructor (name, args) {
    super('event')

    this.name = name instanceof Value ? name.value : name
    this.arguments = args
  }
}

module.exports.EventEntry = EventEntry
