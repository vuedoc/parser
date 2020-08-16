const { AbstractLiteralEntry } = require('./AbstractLiteralEntry');

class NameEntry extends AbstractLiteralEntry {
  constructor (value) {
    super('name', value);
  }
}

module.exports.NameEntry = NameEntry;
