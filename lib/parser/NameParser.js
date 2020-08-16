const { AbstractLiteralParser } = require('./AbstractLiteralParser');
const { NameEntry } = require('../entity/NameEntry');
const { UndefinedValue } = require('../entity/Value');
const { Type } = require('../Enum');

class NameParser extends AbstractLiteralParser {
  parseObjectProperty (node) {
    const ref = this.getValue(node.value);
    const name = ref.type === Type.string ? ref.value : UndefinedValue.value;
    const entry = new NameEntry(name);

    this.emit(entry);
  }
}

module.exports.NameParser = NameParser;
