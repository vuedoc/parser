import { Vuedoc } from '../../../types/index.js';
import { AbstractCategorizeTypeEntry } from './AbstractCategorizeTypeEntry.js';

export type Options = {
  name: string;
  type: Vuedoc.Parser.Type | Vuedoc.Parser.Type[];
  initialValue: string;
};

export class DataEntry extends AbstractCategorizeTypeEntry<'data'> implements Vuedoc.Entry.DataEntry {
  name: string;
  initialValue: string;

  constructor({ name, type, initialValue }: Options) {
    super('data', type);

    this.name = name;
    this.initialValue = initialValue;
  }
}
