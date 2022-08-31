import { Entry } from '../../types/Entry.js';
import { AbstractEntry } from './AbstractEntry.js';

export class AbstractLiteralEntry<Kind extends Entry.Kind, Value = string> extends AbstractEntry<Kind> {
  value: Value;

  constructor(kind: Kind, value: Value) {
    super(kind);

    this.value = value;
  }
}
