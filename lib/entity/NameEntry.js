import { AbstractLiteralEntry } from './AbstractLiteralEntry.js';

export class NameEntry extends AbstractLiteralEntry {
  constructor(value) {
    super('name', value);
  }
}
