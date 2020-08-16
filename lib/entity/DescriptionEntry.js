const { AbstractLiteralEntry } = require('./AbstractLiteralEntry');

class DescriptionEntry extends AbstractLiteralEntry {
  constructor (description) {
    super('description');

    this.value = description;
  }
}

module.exports.DescriptionEntry = DescriptionEntry;
