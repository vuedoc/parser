import { AbstractLiteralEntry } from './AbstractLiteralEntry';

export class NameEntry extends AbstractLiteralEntry {
  constructor (value) {
    super('name', value);
  }
}
