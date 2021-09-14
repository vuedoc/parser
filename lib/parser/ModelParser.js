const { AbstractExpressionParser } = require('./AbstractExpressionParser');
const { ModelEntry } = require('../entity/ModelEntry');
const { UndefinedValue } = require('../entity/Value');
const { Feature } = require('../Enum');

class ModelParser extends AbstractExpressionParser {
  parseObjectProperty (node) {
    const { value: model } = this.getValue(node.value);
    const { value: prop } = model.prop || {};
    const { value: event } = model.event || {};

    const entry = new ModelEntry(prop, event);

    this.root.model = entry;

    this.root.setScopeValue(entry.prop, prop, UndefinedValue);
    this.parseEntryComment(entry, node);

    if (this.features.includes(Feature.model)) {
      this.emit(entry);
    }
  }
}

module.exports.ModelParser = ModelParser;
