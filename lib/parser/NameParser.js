import { AbstractLiteralParser } from './AbstractLiteralParser';
import { NameEntry } from '../entity/NameEntry';
import { UndefinedValue } from '../entity/Value';
import { Type } from '../Enum';

export class NameParser extends AbstractLiteralParser {
  parseObjectProperty (node) {
    const ref = this.getValue(node.value);
    const name = ref.type === Type.string ? ref.value : UndefinedValue.value;
    const entry = new NameEntry(name);

    this.emit(entry);
  }
}
