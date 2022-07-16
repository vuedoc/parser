import { Type } from '../Enum.js';
import { AbstractCategorizeTypeEntry } from './AbstractCategorizeTypeEntry.js';
import { toKebabCase } from '@b613/utils/lib/string.js';

export class PropEntry extends AbstractCategorizeTypeEntry {
  constructor(name, { type = Type.unknown, value = undefined, required = false, describeModel = false } = {}) {
    super('prop', type);

    this.name = toKebabCase(name);
    this.default = value;
    this.required = required;
    this.describeModel = describeModel;
  }
}
