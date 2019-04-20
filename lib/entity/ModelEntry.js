const { DecorateEntry } = require('./DecorateEntry')

class ModelEntry extends DecorateEntry {
  constructor (prop, event) {
    super('model')

    this.prop = prop
    this.event = event
  }
}

module.exports.ModelEntry = ModelEntry
