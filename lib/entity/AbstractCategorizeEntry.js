import { AbstractDecorativeEntry } from './AbstractDecorativeEntry.js';
import { Visibility } from '../Enum.js';

export class AbstractCategorizeEntry extends AbstractDecorativeEntry {
  constructor(kind, description) {
    super(kind, description);

    this.category = undefined;
    this.version = undefined;
    this.visibility = Visibility.public;
  }
}
