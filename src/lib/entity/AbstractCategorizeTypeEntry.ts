import { Value } from './Value.js';
import { AbstractCategorizeEntry } from './AbstractCategorizeEntry.js';
import { Vuedoc } from '../../../types/index.js';

export class AbstractCategorizeTypeEntry<Kind extends Vuedoc.Entry.Kind> extends AbstractCategorizeEntry<Kind> {
  type: Vuedoc.Parser.Type;

  constructor(kind: Kind, type: Vuedoc.Parser.Type | Vuedoc.Parser.Type[], description?: string) {
    super(kind, description);

    this.type = type instanceof Array ? type.map(Value.parseNativeType) : Value.parseNativeType(type);
  }
}
