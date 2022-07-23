import { Vuedoc } from '../../../types/index.js';
import { AbstractEntry } from './AbstractEntry.js';

export class AbstractDecorativeEntry<Kind extends Vuedoc.Entry.Kind> extends AbstractEntry<Kind> {
  description?: string;
  keywords: Vuedoc.Entry.Keyword[];

  constructor(kind: Kind, description?: string) {
    super(kind);

    this.description = description;
    this.keywords = [];
  }
}
