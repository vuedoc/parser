import { AbstractCategorizeTypeEntry } from './AbstractCategorizeTypeEntry.js';

export class DataEntry extends AbstractCategorizeTypeEntry {
  constructor(name, { type, value }) {
    super('data', type);

    this.name = name;
    this.initialValue = value;
  }
}
