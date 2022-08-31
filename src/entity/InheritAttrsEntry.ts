import { Entry } from '../../types/Entry.js';
import { AbstractLiteralEntry } from './AbstractLiteralEntry.js';

export class InheritAttrsEntry extends AbstractLiteralEntry<'inheritAttrs', boolean> implements Entry.InheritAttrsEntry {
  constructor(value: boolean) {
    super('inheritAttrs', value);
  }
}
