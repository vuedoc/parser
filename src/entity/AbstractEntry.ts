import { Entry } from '../../types/Entry.js';

export class AbstractEntry<Kind extends Entry.Kind> {
  kind: Kind;

  constructor(kind: Kind) {
    this.kind = kind;
  }
}
