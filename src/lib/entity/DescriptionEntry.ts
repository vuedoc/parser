import { Vuedoc } from '../../../types/index.js';
import { AbstractLiteralEntry } from './AbstractLiteralEntry.js';

export class DescriptionEntry extends AbstractLiteralEntry<'description'> implements Vuedoc.Entry.DescriptionEntry {
  constructor(description: string) {
    super('description', description);
  }
}
