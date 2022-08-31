import { AbstractLiteralParser } from './AbstractLiteralParser.js';
import { NameEntry } from '../entity/NameEntry.js';
import { Parser } from '../../types/Parser.js';
import { Type } from '../lib/Enum.js';

import * as Babel from '@babel/types';

export class NameParser extends AbstractLiteralParser<Parser.Script> {
  parseObjectProperty(node: Babel.ObjectProperty) {
    const ref = this.getValue(node.value);
    const name = ref.type === Type.string ? ref.value : '';
    const entry = new NameEntry(name);

    this.emit(entry);
  }
}
