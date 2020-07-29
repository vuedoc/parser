const { DataParser } = require('./DataParser')

const { DataEntry } = require('../entity/DataEntry')
const { Syntax } = require('../Enum')

class ClassComponentDataParser extends DataParser {
  parse (node) {
    switch (node.expression.type) {
      case Syntax.AssignmentExpression:
        this.parseData(node)
        break

      default:
        super.parse(node)
    }
  }

  parseData (node) {
    const { name } = node.expression.left.property
    const value = this.getValue(node.expression.right)
    const entry = new DataEntry(name, value)

    this.root.scope[entry.name] = entry.value

    this.parseEntryComment(entry, node)
    this.emit(entry)
  }
}

module.exports.ClassComponentDataParser = ClassComponentDataParser
