import { Type } from '../Enum.js';
import { AbstractCategorizeTypeEntry } from './AbstractCategorizeTypeEntry.js';

export class ComputedEntry extends AbstractCategorizeTypeEntry {
  constructor({ name, type = Type.unknown, dependencies = [] }) {
    super('computed', type);

    this.name = name;
    this.dependencies = dependencies;
  }
}
