const { AbstractEntry } = require('./AbstractEntry');

class AbstractLiteralEntry extends AbstractEntry {
  constructor (kind, value = undefined) {
    super(kind);

    this.value = value;
  }
}

module.exports.AbstractLiteralEntry = AbstractLiteralEntry;
