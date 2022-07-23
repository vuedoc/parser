import { Type } from '../Enum.js';
import { AbstractCategorizeTypeEntry } from './AbstractCategorizeTypeEntry.js';
import { toKebabCase } from '@b613/utils/lib/string.js';
import { Vuedoc } from '../../../types/index.js';

export type Options = {
  name: string;
  type?: string | string[];
  defaultValue?: string;
  required?: boolean;
  describeModel?: boolean;
};

export class PropEntry extends AbstractCategorizeTypeEntry<'prop'> implements Vuedoc.Entry.PropEntry {
  name: string;
  default: string;
  required: boolean;
  describeModel: boolean;
  function?: Vuedoc.Entry.PropFunction;

  constructor({ name, type = Type.unknown, defaultValue, required = false, describeModel = false }: Options) {
    super('prop', type);

    this.name = toKebabCase(name);
    this.default = defaultValue;
    this.required = required;
    this.describeModel = describeModel;
  }
}
