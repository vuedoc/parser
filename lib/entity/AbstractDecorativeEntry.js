import { AbstractEntry } from './AbstractEntry';

export class AbstractDecorativeEntry extends AbstractEntry {
  constructor (kind, description) {
    super(kind);

    this.description = description || undefined;
    this.keywords = [];
  }
}
