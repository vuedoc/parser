import { Entry } from '../../types/Entry.js';
import { AbstractLiteralEntry } from './AbstractLiteralEntry.js';

export class DescriptionEntry extends AbstractLiteralEntry<'description'> implements Entry.DescriptionEntry {
  constructor(description: string) {
    super('description', description);
  }
}
