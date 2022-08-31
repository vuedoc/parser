import { AbstractLiteralParser } from './AbstractLiteralParser.js';
import { InheritAttrsEntry } from '../entity/InheritAttrsEntry.js';
import { Parser } from '../../types/Parser.js';

import * as Babel from '@babel/types';

export class InheritAttrsParser extends AbstractLiteralParser<Parser.Script> {
  parse(node: Babel.ObjectProperty) {
    const ref = this.getValue(node.value);
    const entry = new InheritAttrsEntry(ref.value);

    this.emit(entry);
  }
}
