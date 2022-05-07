import { Type } from '../Enum';
import { AbstractCategorizeEntry } from './AbstractCategorizeEntry';

export class ComputedEntry extends AbstractCategorizeEntry {
  constructor ({ name, type = Type.unknown, dependencies = [] }) {
    super('computed');

    this.name = name;
    this.type = type;
    this.dependencies = dependencies;
  }
}
