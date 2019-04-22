const { ComputedParser } = require('./ComputedParser')
const { ComputedEntry } = require('../entity/ComputedEntry')

class ClassComponentComputedParser extends ComputedParser {
  parse (node) {
    this.parseEntry(new ComputedEntry(node.key.name), node)
  }
}

module.exports.ClassComponentComputedParser = ClassComponentComputedParser
