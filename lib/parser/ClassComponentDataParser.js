const { DataParser } = require('./DataParser');

const { DataEntry } = require('../entity/DataEntry');
const { Syntax } = require('../Enum');

class ClassComponentDataParser extends DataParser {
  parse (node, { type = null } = {}) {
    switch (node.type) {
      case Syntax.ClassProperty:
        this.parseData(node, node.key, node.value, type);
        break;

      default:
        switch (node.expression.type) {
          case Syntax.AssignmentExpression:
            this.parseData(
              node,
              node.expression.left.property,
              node.expression.right,
              type
            );
            break;
        }
        break;
    }
  }

  parseData (node, key, value, type = null) {
    const ref = this.getValue(value);
    const entry = new DataEntry(key.name, {
      type: type || this.getTSType(node, ref.kind),
      value: ref.raw
    });

    this.root.setScopeValue(entry.name, value, ref);
    this.parseEntryComment(entry, node);
    DataParser.mergeEntryKeywords(entry);

    if (node.accessibility) {
      entry.visibility = node.accessibility;
    }

    this.emit(entry);
  }
}

module.exports.ClassComponentDataParser = ClassComponentDataParser;
