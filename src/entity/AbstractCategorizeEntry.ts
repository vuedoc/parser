import { AbstractDecorativeEntry } from './AbstractDecorativeEntry.js';
import { Visibility } from '../lib/Enum.js';
import { Entry } from '../../types/Entry.js';

export class AbstractCategorizeEntry<Kind extends Entry.Kind> extends AbstractDecorativeEntry<Kind> {
  category?: string;
  version?: string;
  visibility: Entry.Visibility;

  constructor(kind: Kind, description?: string) {
    super(kind, description);

    this.visibility = Visibility.public;
  }
}
