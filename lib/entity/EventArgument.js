const { DEFAULT_TYPE } = require('../Enum')

class EventArgument {
  constructor (name) {
    this.name = name
    this.type = DEFAULT_TYPE
    this.description = ''
    this.rest = false
  }
}

function* eventArgumentGenerator() {
  while (true) {
    yield new EventArgument()
  }
}

module.exports.EventArgument = EventArgument
module.exports.EventArgumentGenerator = eventArgumentGenerator()
