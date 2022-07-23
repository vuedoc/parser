import { Vuedoc } from '../../../types/index.js';
import { AbstractLiteralEntry } from './AbstractLiteralEntry.js';

export class NameEntry extends AbstractLiteralEntry<'name'> implements Vuedoc.Entry.NameEntry {
  constructor(value: string) {
    super('name', value);
  }
}
