const { AbstractCategorizeEntry } = require('./AbstractCategorizeEntry');
const { Type } = require('../Enum');

const DEFAULT_SLOT_NAME = 'default';

class SlotEntry extends AbstractCategorizeEntry {
  constructor (name, description = undefined) {
    super('slot', description);

    this.name = name || DEFAULT_SLOT_NAME;
    this.props = [];
  }
}

class SlotProp {
  constructor (name, type = Type.unknown, description = undefined) {
    this.name = name;
    this.type = type;
    this.description = description || undefined;
  }
}

function* slotPropGenerator() {
  while (true) {
    yield new SlotProp();
  }
}

module.exports.SlotEntry = SlotEntry;
module.exports.SlotPropGenerator = slotPropGenerator();
module.exports.SlotProp = SlotProp;
