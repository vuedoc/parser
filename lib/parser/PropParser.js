const { AbstractExpressionParser } = require('./AbstractExpressionParser')
const { PropEntry } = require('../entity/PropEntry')

const { UNDEFINED, FEATURE_PROPS } = require('../Enum')
const { StringUtils } = require('../StringUtils')

const MODEL_KEYWORD = 'model'

class PropParser extends AbstractExpressionParser {
  parse (node) {
    if (this.features.includes(FEATURE_PROPS)) {
      super.parse(node)
    }
  }

  parseEntryComment (entry, property) {
    super.parseEntryComment(entry, property)

    /* eslint-disable arrow-body-style */
    const modelKeywordIndex = entry.keywords.findIndex(({ name }) => {
      return name === MODEL_KEYWORD
    })

    if (modelKeywordIndex > -1) {
      entry.name = 'v-model'
      entry.describeModel = true
    }
  }

  parseArrayExpression (node) {
    node.elements.forEach((item) => {
      const entry = new PropEntry()

      entry.name = StringUtils.toKebabCase(item.value)
      entry.visibility = 'public'

      this.root.scope[entry.name] = UNDEFINED

      this.parseEntryComment(entry, item)
      this.emit(entry)
    })
  }

  parseObjectExpression (node) {
    node.properties.forEach((property) => {
      const declaration = this.getValue(property.value)
      const entry = new PropEntry()

      entry.name = StringUtils.toKebabCase(property.key.name)

      if (typeof declaration === 'string') {
        entry.type = declaration
      } else {
        Object.assign(entry, declaration)
      }

      this.root.scope[entry.name] = entry.default

      this.parseEntryComment(entry, property)
      this.emit(entry)
    })
  }

  getValueFunction (node) {
    return this.getValueFunctionString(node)
  }
}

module.exports.PropParser = PropParser
