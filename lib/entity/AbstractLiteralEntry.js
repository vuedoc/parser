import { AbstractEntry } from './AbstractEntry';

export class AbstractLiteralEntry extends AbstractEntry {
  constructor (kind, value = undefined) {
    super(kind);

    this.value = value;
  }
}
