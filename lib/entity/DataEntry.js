const { AbstractCategorizeEntry } = require('./AbstractCategorizeEntry');

class DataEntry extends AbstractCategorizeEntry {
  constructor (name, { type, value }) {
    super('data');

    this.name = name;
    this.type = type;
    this.initialValue = value;
  }
}

module.exports.DataEntry = DataEntry;
