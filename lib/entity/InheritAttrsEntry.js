const { AbstractLiteralEntry } = require('./AbstractLiteralEntry');

class InheritAttrsEntry extends AbstractLiteralEntry {
  constructor (value) {
    super('inheritAttrs', value);
  }
}

module.exports.InheritAttrsEntry = InheritAttrsEntry;
