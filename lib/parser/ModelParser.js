import { AbstractExpressionParser } from './AbstractExpressionParser.js';
import { ModelEntry } from '../entity/ModelEntry.js';
import { UndefinedValue } from '../entity/Value.js';
import { Feature } from '../Enum.js';

export class ModelParser extends AbstractExpressionParser {
  parseObjectProperty(node) {
    if (this.features.includes(Feature.model)) {
      const { value: { prop, event } } = this.getValue(node.value);

      const entry = new ModelEntry(prop, event);

      this.root.model = entry;

      this.root.setScopeValue(entry.prop, prop, UndefinedValue);
      this.parseEntryComment(entry, node);

      this.emit(entry);
    }
  }
}
