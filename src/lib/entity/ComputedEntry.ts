import { Vuedoc } from '../../../types/index.js';
import { Type } from '../Enum.js';
import { AbstractCategorizeTypeEntry } from './AbstractCategorizeTypeEntry.js';

export type Options = {
  name: string;
  type?: string | string[];
  dependencies?: string[];
};

export class ComputedEntry extends AbstractCategorizeTypeEntry<'computed'> implements Vuedoc.Entry.ComputedEntry {
  name: string;
  dependencies: string[];

  constructor({ name, type = Type.unknown, dependencies = [] }: Options) {
    super('computed', type);

    this.name = name;
    this.dependencies = dependencies;
  }
}
