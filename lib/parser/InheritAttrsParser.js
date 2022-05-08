import { AbstractLiteralParser } from './AbstractLiteralParser.js';
import { InheritAttrsEntry } from '../entity/InheritAttrsEntry.js';

export class InheritAttrsParser extends AbstractLiteralParser {
  parse(node) {
    const ref = this.getValue(node.value);
    const entry = new InheritAttrsEntry(ref.value);

    this.emit(entry);
  }
}
