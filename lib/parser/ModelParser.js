import { AbstractExpressionParser } from './AbstractExpressionParser.js';
import { ModelEntry } from '../entity/ModelEntry.js';
import { UndefinedValue } from '../entity/Value.js';

export class ModelParser extends AbstractExpressionParser {
  parseObjectProperty(node) {
    const { value: { prop, event } } = this.getValue(node.value);
    const entry = new ModelEntry(prop, event);

    this.root.setScopeValue(entry.prop, prop, UndefinedValue);
    this.parseEntryComment(entry, node);
    this.emit(entry);
  }
}
