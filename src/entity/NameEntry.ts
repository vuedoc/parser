import { Entry } from '../../types/Entry.js';
import { AbstractLiteralEntry } from './AbstractLiteralEntry.js';

export class NameEntry extends AbstractLiteralEntry<'name'> implements Entry.NameEntry {
  constructor(value: string) {
    super('name', value);
  }
}
