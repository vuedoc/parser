const { DecorateEntry } = require('./DecorateEntry')

class EventEntry extends DecorateEntry {
  constructor (name, args) {
    super('event')

    this.name = name
    this.arguments = args
  }
}

module.exports.EventEntry = EventEntry
