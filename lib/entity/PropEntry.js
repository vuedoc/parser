import { Type } from '../Enum';
import { AbstractCategorizeEntry } from './AbstractCategorizeEntry';

export class PropEntry extends AbstractCategorizeEntry {
  // eslint-disable-next-line max-len
  constructor (name, { type = Type.unknown, value, required = false, describeModel = false } = {}) {
    super('prop');

    this.name = name;
    this.type = type;
    this.default = value;
    this.required = required;
    this.describeModel = describeModel;
  }
}
