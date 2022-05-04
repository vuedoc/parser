import { AbstractLiteralParser } from './AbstractLiteralParser';
import { InheritAttrsEntry } from '../entity/InheritAttrsEntry';

export class InheritAttrsParser extends AbstractLiteralParser {
  parse (node) {
    const ref = this.getValue(node.value);
    const entry = new InheritAttrsEntry(ref.value);

    this.emit(entry);
  }
}
