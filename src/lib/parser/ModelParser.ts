import { AbstractExpressionParser } from './AbstractExpressionParser.js';
import { ModelEntry } from '../entity/ModelEntry.js';
import { UndefinedValue } from '../entity/Value.js';
import * as Babel from '@babel/types';

export class ModelParser extends AbstractExpressionParser {
  parseObjectProperty(node: Babel.ObjectProperty) {
    const { value: { prop, event } } = this.getValue(node.value);
    const entry = new ModelEntry(prop, event);

    this.root.defaultModelPropName = prop;

    this.root.setScopeValue(entry.prop, prop, UndefinedValue);
    this.parseEntryComment(entry, node);
    this.emit(entry);
  }
}
