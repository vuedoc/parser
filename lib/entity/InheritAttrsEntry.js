import { AbstractLiteralEntry } from './AbstractLiteralEntry';

export class InheritAttrsEntry extends AbstractLiteralEntry {
  constructor (value) {
    super('inheritAttrs', value);
  }
}
