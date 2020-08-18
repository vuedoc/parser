const { AbstractLiteralParser } = require('./AbstractLiteralParser');
const { InheritAttrsEntry } = require('../entity/InheritAttrsEntry');

class InheritAttrsParser extends AbstractLiteralParser {
  parse (node) {
    const ref = this.getValue(node.value);
    const entry = new InheritAttrsEntry(ref.value);

    this.emit(entry);
  }
}

module.exports.InheritAttrsParser = InheritAttrsParser;
