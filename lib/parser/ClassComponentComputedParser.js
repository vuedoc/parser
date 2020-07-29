const { ComputedParser } = require('./ComputedParser')
const { ComputedEntry } = require('../entity/ComputedEntry')
const { Syntax } = require('../Enum')

class ClassComponentComputedParser extends ComputedParser {
  parse (node) {
    const name = node.key.type === Syntax.Identifier
      ? node.key.name
      : this.getValue(node.key).value

    this.parseEntry(new ComputedEntry(name), node.body, node)
  }
}

module.exports.ClassComponentComputedParser = ClassComponentComputedParser
