import { Value } from './Value.js';
import { AbstractCategorizeEntry } from './AbstractCategorizeEntry.js';

export class AbstractCategorizeTypeEntry extends AbstractCategorizeEntry {
  constructor(kind, type, description = undefined) {
    super(kind, description);

    this.type = type instanceof Array ? type.map(Value.parseNativeType) : Value.parseNativeType(type);
  }
}
