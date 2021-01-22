const { DataParser } = require('./DataParser');

const { DataEntry } = require('../entity/DataEntry');
const { Syntax } = require('../Enum');

class ClassComponentDataParser extends DataParser {
  parse (node) {
    switch (node.type) {
      case Syntax.ClassProperty:
        this.parseData(node, node.key, node.value || node);
        break;

      default:
        switch (node.expression.type) {
          case Syntax.AssignmentExpression:
            this.parseData(node, node.expression.left.property, node.expression.right);
            break;
        }
        break;
    }
  }

  parseData (node, key, value) {
    const ref = this.getValue(value);
    const entry = new DataEntry(key.name, {
      type: this.getTSType(node, ref.kind),
      value: ref.raw
    });

    this.root.scope[entry.name] = ref.raw;

    this.parseEntryComment(entry, node);
    DataParser.mergeEntryKeywords(entry);

    if (node.accessibility) {
      entry.visibility = node.accessibility;
    }

    this.emit(entry);
  }
}

module.exports.ClassComponentDataParser = ClassComponentDataParser;
