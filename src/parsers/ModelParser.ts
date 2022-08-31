import { AbstractExpressionParser } from './AbstractExpressionParser.js';
import { generateUndefineValue } from '../entity/Value.js';
import { ModelEntry } from '../entity/ModelEntry.js';

import * as Babel from '@babel/types';

export class ModelParser extends AbstractExpressionParser {
  parseObjectProperty(node: Babel.ObjectProperty) {
    const { value: { prop, event } } = this.getValue(node.value);
    const entry = new ModelEntry(prop, event);

    this.root.defaultModelPropName = prop;

    this.setScopeValue(entry.prop, node, generateUndefineValue.next().value, { global: true });
    this.parseEntryComment(entry, node);
    this.emit(entry);
  }
}
