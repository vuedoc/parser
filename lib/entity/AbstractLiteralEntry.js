import { AbstractEntry } from './AbstractEntry.js';

export class AbstractLiteralEntry extends AbstractEntry {
  constructor (kind, value = undefined) {
    super(kind);

    this.value = value;
  }
}
