const { MethodParser } = require('./MethodParser')
const { EventParser } = require('./EventParser')

const { MethodEntry } = require('../entity/MethodEntry')

const { Features } = require('../Enum')

class ClassComponentMethodParser extends MethodParser {
  parse (node) {
    if (this.features.includes(Features.methods)) {
      const { name } = node.key
      const params = node.value.params
        .map((item) => this.getParam(item))
        .filter(({ name }) => name !== null)

      this.parseEntry(new MethodEntry(name, params), node)
      new EventParser(this.root, this.scope).parse(node.value)
    }
  }
}

module.exports.ClassComponentMethodParser = ClassComponentMethodParser
