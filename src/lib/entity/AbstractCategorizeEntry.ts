import { AbstractDecorativeEntry } from './AbstractDecorativeEntry.js';
import { Visibility } from '../Enum.js';
import { Vuedoc } from '../../../types/index.js';

export class AbstractCategorizeEntry<Kind extends Vuedoc.Entry.Kind> extends AbstractDecorativeEntry<Kind> {
  category?: string;
  version?: string;
  visibility: Vuedoc.Parser.Visibility;

  constructor(kind: Kind, description?: string) {
    super(kind, description);

    this.visibility = Visibility.public;
  }
}
