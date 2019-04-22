const { MethodParser } = require('./MethodParser')

const { MethodEntry } = require('../entity/MethodEntry')

class ClassComponentMethodParser extends MethodParser {
  parse (node) {
    const { name } = node.key
    const params = node.value.params
      .map((item) => this.getParam(item))
      .filter(({ name }) => name !== null)

    this.parseEntry(new MethodEntry(name, params), node)
  }
}

module.exports.ClassComponentMethodParser = ClassComponentMethodParser
