import { Entry } from '../../types/Entry.js';
import { Parser } from '../../types/Parser.js';
import { AbstractCategorizeEntry } from './AbstractCategorizeEntry.js';
import { Type } from '../lib/Enum.js';

export type Options = {
  name: string;
  type?: string | string[];
  dependencies?: string[];
};

export class ComputedEntry extends AbstractCategorizeEntry<'computed'> implements Entry.ComputedEntry {
  name: string;
  dependencies: string[];
  type: Parser.Type | Parser.Type[];

  constructor({ name, type = Type.unknown, dependencies = [] }: Options) {
    super('computed');

    this.name = name;
    this.type = type;
    this.dependencies = dependencies;
  }
}
