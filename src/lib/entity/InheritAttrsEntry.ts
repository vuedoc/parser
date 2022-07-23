import { Vuedoc } from '../../../types/index.js';
import { AbstractLiteralEntry } from './AbstractLiteralEntry.js';

export class InheritAttrsEntry extends AbstractLiteralEntry<'inheritAttrs', boolean> implements Vuedoc.Entry.InheritAttrsEntry {
  constructor(value: boolean) {
    super('inheritAttrs', value);
  }
}
