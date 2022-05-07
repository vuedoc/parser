import { AbstractLiteralEntry } from './AbstractLiteralEntry';

export class DescriptionEntry extends AbstractLiteralEntry {
  constructor (description) {
    super('description');

    this.value = description;
  }
}
