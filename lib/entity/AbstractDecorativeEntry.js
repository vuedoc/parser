import { AbstractEntry } from './AbstractEntry.js';

export class AbstractDecorativeEntry extends AbstractEntry {
  constructor(kind, description) {
    super(kind);

    this.description = description || undefined;
    this.keywords = [];
  }
}
