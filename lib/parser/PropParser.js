const { DataParser } = require('./DataParser')
const { PropEntry } = require('../entry/PropEntry')

class PropParser extends DataParser {
  parseObjectExpression (node) {
    node.properties.forEach((property) => {
      const declaration = this.getValue(property.value)
      const entry = new PropEntry()

      entry.name = property.key.name

      if (typeof declaration === 'string') {
        entry.type = declaration
      } else {
        Object.assign(entry, declaration)
      }

      this.root.scope[entry.name] = entry.default

      this.emit(entry)
    })
  }
}

module.exports.PropParser = PropParser
