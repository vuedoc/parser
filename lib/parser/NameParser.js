import { AbstractLiteralParser } from './AbstractLiteralParser.js';
import { NameEntry } from '../entity/NameEntry.js';
import { UndefinedValue } from '../entity/Value.js';
import { Type } from '../Enum.js';

export class NameParser extends AbstractLiteralParser {
  parseObjectProperty (node) {
    const ref = this.getValue(node.value);
    const name = ref.type === Type.string ? ref.value : UndefinedValue.value;
    const entry = new NameEntry(name);

    this.emit(entry);
  }
}
