import { Vuedoc } from '../../../types/index.js';

export class AbstractEntry<Kind extends Vuedoc.Entry.Kind> {
  kind: Kind;

  constructor(kind: Kind) {
    this.kind = kind;
  }
}
