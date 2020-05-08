const { AbstractExpressionParser } = require('./AbstractExpressionParser')
const { ModelEntry } = require('../entity/ModelEntry')

const { UNDEFINED, Features } = require('../Enum')

class ModelParser extends AbstractExpressionParser {
  parse (node) {
    if (this.features.includes(Features.model)) {
      super.parse(node)
    }
  }

  parseObjectExpression (node) {
    const { value: model } = this.getValue(node)
    const { value: prop } = model.prop || {}
    const { value: event } = model.event || {}

    const entry = new ModelEntry(prop, event)

    this.root.scope[entry.prop] = UNDEFINED
    this.root.model = entry

    this.parseEntryComment(entry, node)
    this.emit(entry)
  }
}

module.exports.ModelParser = ModelParser
