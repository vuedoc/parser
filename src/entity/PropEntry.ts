import { Type } from '../lib/Enum.js';
import { AbstractCategorizeEntry } from './AbstractCategorizeEntry.js';
import { toKebabCase } from '@b613/utils/lib/string.js';
import { Parser } from '../../types/Parser.js';
import { Entry } from '../../types/Entry.js';

export type Options = {
  name: string;
  type?: Parser.Type | Parser.Type[];
  defaultValue?: string;
  required?: boolean;
  describeModel?: boolean;
};

export class PropEntry extends AbstractCategorizeEntry<'prop'> implements Entry.PropEntry {
  name: string;
  default?: string;
  required: boolean;
  describeModel: boolean;
  function?: Entry.PropFunction;
  type: Parser.Type | Parser.Type[];

  constructor({ name, type = Type.unknown, defaultValue, required = false, describeModel = false }: Options) {
    super('prop');

    this.name = toKebabCase(name);
    this.type = type;
    this.default = defaultValue;
    this.required = required;
    this.describeModel = describeModel;
  }
}
