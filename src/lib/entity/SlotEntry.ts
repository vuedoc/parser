import { AbstractCategorizeEntry } from './AbstractCategorizeEntry.js';
import { Type } from '../Enum.js';
import { Value } from './Value.js';
import { Vuedoc } from '../../../types/index.js';

const DEFAULT_SLOT_NAME = 'default';

export class SlotEntry extends AbstractCategorizeEntry<'slot'> implements Vuedoc.Entry.SlotEntry {
  name: string;
  props: SlotProp[];

  constructor(name: string, description?: string) {
    super('slot', description);

    this.name = name || DEFAULT_SLOT_NAME;
    this.props = [];
  }
}

export class SlotProp implements Vuedoc.Entry.SlotProp {
  name: string;
  type: Vuedoc.Parser.Type;
  description: string | undefined;

  constructor(name: string, type: Vuedoc.Parser.Type | Vuedoc.Parser.Type[] = Type.unknown, description: string = undefined) {
    this.name = name;
    this.type = type instanceof Array ? type.map(Value.parseNativeType) : Value.parseNativeType(type);
    this.description = description || undefined;
  }
}

export function* slotPropGenerator() {
  while (true) {
    yield new SlotProp('');
  }
}

export const SlotPropGenerator = slotPropGenerator();
