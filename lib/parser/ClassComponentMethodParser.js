const { MethodParser } = require('./MethodParser')

const { MethodEntry } = require('../entity/MethodEntry')

class ClassComponentMethodParser extends MethodParser {
  parse (node) {
    const params = this.getParams(node.value)

    this.parseEntry(new MethodEntry(node.key.name, params), node)
  }
}

module.exports.ClassComponentMethodParser = ClassComponentMethodParser
