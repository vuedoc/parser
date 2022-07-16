import { Type } from '../Enum.js';
import { AbstractCategorizeTypeEntry } from './AbstractCategorizeTypeEntry.js';

export class PropEntry extends AbstractCategorizeTypeEntry {
  constructor(name, { type = Type.unknown, value, required = false, describeModel = false } = {}) {
    super('prop', type);

    this.name = name;
    this.default = value;
    this.required = required;
    this.describeModel = describeModel;
  }
}
