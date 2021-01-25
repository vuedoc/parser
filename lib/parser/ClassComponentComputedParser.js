const { ComputedParser } = require('./ComputedParser');
const { ComputedEntry } = require('../entity/ComputedEntry');
const { Syntax } = require('../Enum');

class ClassComponentComputedParser extends ComputedParser {
  parse (node, { type = null, dependencies = [] } = {}) {
    const name = node.key.type === Syntax.Identifier
      ? node.key.name
      : this.getValue(node.key).value;

    const entry = new ComputedEntry({ name, type, dependencies });

    this.parseEntry(entry, node.body, node);
  }
}

module.exports.ClassComponentComputedParser = ClassComponentComputedParser;
