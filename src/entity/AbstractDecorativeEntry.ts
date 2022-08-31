import { Entry } from '../../types/Entry.js';
import { AbstractEntry } from './AbstractEntry.js';

export class AbstractDecorativeEntry<Kind extends Entry.Kind> extends AbstractEntry<Kind> {
  description?: string;
  keywords: Entry.Keyword[];

  constructor(kind: Kind, description?: string) {
    super(kind);

    this.description = description;
    this.keywords = [];
  }
}
