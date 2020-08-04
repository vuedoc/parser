const { AbstractExpressionParser } = require('./AbstractExpressionParser')
const { PropEntry } = require('../entity/PropEntry')
const { Value, UndefinedValue } = require('../entity/Value')

const { Syntax } = require('../Enum')
const { StringUtils } = require('../StringUtils')

const MODEL_KEYWORD = 'model'

class PropParser extends AbstractExpressionParser {
  static mergeEntryKeywords (entry) {
    AbstractExpressionParser.mergeEntryKeyword(entry, 'type')
    AbstractExpressionParser.mergeEntryKeyword(entry, 'default')
  }

  static getPropType (type, value) {
    switch (type) {
      case Syntax.Identifier:
      case Syntax.ArrayExpression:
        return value

      default:
        return value.type ? value.type.value : UndefinedValue.value
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
      const entry = new PropEntry(name)

      this.root.scope[entry.name] = UndefinedValue.value

      this.parseEntryComment(entry, item)
      PropParser.mergeEntryKeywords(entry)
      this.emit(entry)
    })
  }

  parseObjectExpression (node) {
    node.properties
      .filter(({ type }) => type === Syntax.ObjectProperty)
      .forEach((item) => this.parseObjectExpressionProperty(item))
  }

  parseObjectExpressionProperty (property) {
    const ref = this.getValue(property.value)
    const camelName = this.parseKey(property)
    const name = StringUtils.toKebabCase(camelName)
    const type = PropParser.getPropType(ref.type, ref.value)
    const entry = new PropEntry(name, {
      type,
      kind: Value.parseNativeType(type, ref.value.kind),
      value: ref.value.default ? this.parseValue(ref.value.default) : undefined,
      required: ref.value.required ? ref.value.required.value : false
    })

    if (this.root.model) {
      if (name === this.root.model.prop) {
        entry.describeModel = true
      }
    } else if (name === 'value') {
      entry.describeModel = true
    }

    this.root.scope[camelName] = entry.default

    this.parseEntry(entry, property)
  }

  parseEntry (entry, node) {
    this.parseEntryComment(entry, node)
    PropParser.mergeEntryKeywords(entry)
    this.emit(entry)
  }

  getValue (node) {
    if (node) {
      switch (node.type) {
        case Syntax.ArrayExpression: {
          const value = node.elements.map((element) => {
            return this.getValue(element).value
          })

          return new Value(Syntax.ArrayExpression, value, value)
        }
      }
    }

    return super.getValue(node)
  }

  getFunctionExpressionValue (node) {
    return this.getFunctionExpressionStringValue(node)
  }

  getFunctionExpressionStringValue (node) {
    const declaration = node.type === Syntax.ArrowFunctionExpression
      ? this.getSource(node)
      : 'function() ' + this.getSource(node.body)

    return new Value('function', declaration, declaration)
  }
}

module.exports.PropParser = PropParser
