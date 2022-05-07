import { AbstractCategorizeEntry } from './AbstractCategorizeEntry';

export class DataEntry extends AbstractCategorizeEntry {
  constructor (name, { type, value }) {
    super('data');

    this.name = name;
    this.type = type;
    this.initialValue = value;
  }
}
