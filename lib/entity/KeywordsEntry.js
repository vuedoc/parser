const { AbstractLiteralEntry } = require('./AbstractLiteralEntry');

class KeywordsEntry extends AbstractLiteralEntry {
  constructor (keywords) {
    super('keywords');

    this.value = keywords;
  }
}

module.exports.KeywordsEntry = KeywordsEntry;
