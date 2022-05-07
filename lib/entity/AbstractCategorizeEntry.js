import { AbstractDecorativeEntry } from './AbstractDecorativeEntry';
import { Visibility } from '../Enum';

export class AbstractCategorizeEntry extends AbstractDecorativeEntry {
  constructor (kind, description) {
    super(kind, description);

    this.category = undefined;
    this.version = undefined;
    this.visibility = Visibility.public;
  }
}
