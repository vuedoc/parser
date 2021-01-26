const { Type } = require('../Enum');
const { AbstractCategorizeEntry } = require('./AbstractCategorizeEntry');

class ComputedEntry extends AbstractCategorizeEntry {
  constructor ({ name, type = Type.unknown, dependencies = [] }) {
    super('computed');

    this.name = name;
    this.type = type;
    this.dependencies = dependencies;
  }
}

module.exports.ComputedEntry = ComputedEntry;
