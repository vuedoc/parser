import { Entry } from '../../types/Entry.js';
import { AbstractCategorizeEntry } from './AbstractCategorizeEntry.js';
import { Parser } from '../../types/Parser.js';

export type Options = {
  name: string;
  type: Parser.Type | Parser.Type[];
  initialValue: string;
};

export class DataEntry extends AbstractCategorizeEntry<'data'> implements Entry.DataEntry {
  name: string;
  initialValue: string;
  type: Parser.Type | Parser.Type[];

  constructor({ name, type, initialValue }: Options) {
    super('data');

    this.name = name;
    this.type = type;
    this.initialValue = initialValue;
  }
}
