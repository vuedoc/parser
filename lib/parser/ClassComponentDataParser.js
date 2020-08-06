const { DataParser } = require('./DataParser')

const { DataEntry } = require('../entity/DataEntry')
const { Syntax } = require('../Enum')

class ClassComponentDataParser extends DataParser {
  parse (node) {
    switch (node.expression.type) {
      case Syntax.AssignmentExpression:
        this.parseData(node)
        break
    }
  }

  parseData (node) {
    const { name } = node.expression.left.property
    const ref = this.getValue(node.expression.right)
    const entry = new DataEntry(name, {
      type: ref.kind,
      value: this.parseValue(ref)
    })

    this.root.scope[entry.name] = entry.value

    this.parseEntryComment(entry, node)
    DataParser.mergeEntryKeywords(entry)
    this.emit(entry)
  }
}

module.exports.ClassComponentDataParser = ClassComponentDataParser
