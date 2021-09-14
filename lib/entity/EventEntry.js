const { AbstractCategorizeEntry } = require('./AbstractCategorizeEntry');
const { Type } = require('../Enum');

class EventEntry extends AbstractCategorizeEntry {
  constructor (name, args = []) {
    super('event');

    this.name = name;
    this.arguments = args;
  }
}

class EventArgument {
  constructor (name, type = Type.unknown) {
    this.name = name;
    this.type = type;
    this.description = undefined;
    this.rest = false;
  }
}

function* eventArgumentGenerator() {
  while (true) {
    yield new EventArgument();
  }
}

module.exports.EventArgumentGenerator = eventArgumentGenerator();
module.exports.EventArgument = EventArgument;
module.exports.EventEntry = EventEntry;
