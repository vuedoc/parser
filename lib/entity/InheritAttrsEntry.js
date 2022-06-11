import { AbstractLiteralEntry } from './AbstractLiteralEntry.js';

export class InheritAttrsEntry extends AbstractLiteralEntry {
  constructor(value) {
    super('inheritAttrs', value);
  }
}
