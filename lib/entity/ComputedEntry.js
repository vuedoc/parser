const { AbstractCategorizeEntry } = require('./AbstractCategorizeEntry');

class ComputedEntry extends AbstractCategorizeEntry {
  constructor (name, dependencies = []) {
    super('computed');

    this.name = name;
    this.dependencies = dependencies;
  }
}

module.exports.ComputedEntry = ComputedEntry;
