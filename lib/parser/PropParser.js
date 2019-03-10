const { DataParser } = require('./DataParser')
const { PropEntry } = require('../entity/PropEntry')

const { UNDEFINED } = require('../Enum')

const MODEL_KEYWORD = 'model'

class PropParser extends DataParser {
  parseArrayExpression (node) {
    node.elements.forEach((item) => {
      const entry = new PropEntry()

      entry.name = item.value
      entry.visibility = 'public'

      this.root.scope[entry.name] = UNDEFINED

      this.emit(entry)
    })
  }

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

      this.parseEntryComment(entry, property)

      /* eslint-disable arrow-body-style */
      const modelKeywordIndex = entry.keywords.findIndex(({ name }) => {
        return name === MODEL_KEYWORD
      })

      if (modelKeywordIndex > -1) {
        entry.name = 'v-model'
        entry.describeModel = true
      }

      this.emit(entry)
    })
  }
}

module.exports.PropParser = PropParser
