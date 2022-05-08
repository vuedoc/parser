import { AbstractCategorizeEntry } from './AbstractCategorizeEntry.js';

export class DataEntry extends AbstractCategorizeEntry {
  constructor (name, { type, value }) {
    super('data');

    this.name = name;
    this.type = type;
    this.initialValue = value;
  }
}
