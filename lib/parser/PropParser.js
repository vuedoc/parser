const { AbstractParser } = require('./AbstractParser')
const { AbstractExpressionParser } = require('./AbstractExpressionParser')
const { PropEntry } = require('../entity/PropEntry')
const { Value } = require('../entity/Value')

const { UNDEFINED, DEFAULT_TYPE, Features, Syntax } = require('../Enum')
const { StringUtils } = require('../StringUtils')

const MODEL_KEYWORD = 'model'

class PropParser extends AbstractExpressionParser {
  static getPropType (type, value) {
    switch (type) {
      case Syntax.Identifier:
      case Syntax.ArrayExpression:
        return value

      default:
        return value.type ? value.type.value : UNDEFINED
    }
  }

  parse (node) {
    if (this.features.includes(Features.props)) {
      super.parse(node)
    }
  }

  parseEntryComment (entry, property) {
    super.parseEntryComment(entry, property)

    const modelKeywordIndex = entry.keywords.findIndex(({ name }) => {
      return name === MODEL_KEYWORD
    })

    if (modelKeywordIndex > -1) {
      entry.describeModel = true

      entry.keywords.splice(modelKeywordIndex, 1)
    }
  }

  parseArrayExpression (node) {
    node.elements.forEach((item) => {
      const name = StringUtils.toKebabCase(item.value)
      const entry = new PropEntry(name, DEFAULT_TYPE)

      this.root.scope[entry.name] = UNDEFINED

      this.parseEntryComment(entry, item)
      this.emit(entry)
    })
  }

  parseObjectExpression (node) {
    node.properties.forEach((property) => {
      const { type, value } = this.getValue(property.value)
      const propType = PropParser.getPropType(type, value)
      const required = value.required ? value.required.value : false
      const camelName = this.parseKey(property)
      const name = StringUtils.toKebabCase(camelName)
      const entry = new PropEntry(name, propType, value.default, required)

      if (this.root.model) {
        if (name === this.root.model.prop) {
          entry.describeModel = true
        }
      } else if (name === 'value') {
        entry.describeModel = true
      }

      this.root.scope[camelName] = entry.default

      this.parseEntryComment(entry, property)
      AbstractParser.mergeEntryKeyword(entry, 'default')
      this.emit(entry)
    })
  }

  getValue (node) {
    if (node) {
      switch (node.type) {
        case Syntax.ArrayExpression: {
          const value = node.elements.map((element) => {
            return this.getValue(element).value
          })

          return new Value(Syntax.ArrayExpression, value)
        }
      }
    }

    return super.getValue(node)
  }

  getFunctionExpressionValue (node) {
    return this.getFunctionExpressionStringValue(node)
  }
}

module.exports.PropParser = PropParser
