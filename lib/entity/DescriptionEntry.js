import { AbstractLiteralEntry } from './AbstractLiteralEntry.js';

export class DescriptionEntry extends AbstractLiteralEntry {
  constructor (description) {
    super('description');

    this.value = description;
  }
}
