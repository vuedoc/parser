const { AbstractEntry } = require('./AbstractEntry');

class AbstractDecorativeEntry extends AbstractEntry {
  constructor (kind, description) {
    super(kind);

    this.description = description || undefined;
    this.keywords = [];
  }
}

module.exports.AbstractDecorativeEntry = AbstractDecorativeEntry;
