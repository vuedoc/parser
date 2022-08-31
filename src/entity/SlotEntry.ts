import { AbstractCategorizeEntry } from './AbstractCategorizeEntry.js';
import { Type } from '../lib/Enum.js';
import { Value } from './Value.js';
import { Entry } from '../../types/Entry.js';
import { Parser } from '../../types/Parser.js';

const DEFAULT_SLOT_NAME = 'default';

export class SlotEntry extends AbstractCategorizeEntry<'slot'> implements Entry.SlotEntry {
  name: string;
  props: SlotProp[];

  constructor(name: string, description?: string) {
    super('slot', description);

    this.name = name || DEFAULT_SLOT_NAME;
    this.props = [];
  }
}

export class SlotProp implements Entry.SlotProp {
  name: string;
  type: Parser.Type;
  description: string | undefined;

  constructor(name: string, type: Parser.Type | Parser.Type[] = Type.unknown, description: string = undefined) {
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
