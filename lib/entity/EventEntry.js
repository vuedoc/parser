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
  constructor (name) {
    this.name = name;
    this.type = Type.any;
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
module.exports.EventEntry = EventEntry;
