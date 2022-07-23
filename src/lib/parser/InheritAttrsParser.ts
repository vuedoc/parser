import { AbstractLiteralParser } from './AbstractLiteralParser.js';
import { InheritAttrsEntry } from '../entity/InheritAttrsEntry.js';
import { Vuedoc } from '../../../types/index.js';
import * as Babel from '@babel/types';

export class InheritAttrsParser extends AbstractLiteralParser<Vuedoc.Parser.Script> {
  parse(node: Babel.ObjectProperty) {
    const ref = this.getValue(node.value);
    const entry = new InheritAttrsEntry(ref.value);

    this.emit(entry);
  }
}
