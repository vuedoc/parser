import { Type } from '../Enum.js';
import { AbstractCategorizeEntry } from './AbstractCategorizeEntry.js';

export class ComputedEntry extends AbstractCategorizeEntry {
  constructor ({ name, type = Type.unknown, dependencies = [] }) {
    super('computed');

    this.name = name;
    this.type = type;
    this.dependencies = dependencies;
  }
}
