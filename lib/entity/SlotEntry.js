import { AbstractCategorizeEntry } from './AbstractCategorizeEntry.js';
import { Type } from '../Enum.js';
import { Value } from './Value.js';

const DEFAULT_SLOT_NAME = 'default';

export class SlotEntry extends AbstractCategorizeEntry {
  constructor(name, description = undefined) {
    super('slot', description);

    this.name = name || DEFAULT_SLOT_NAME;
    this.props = [];
  }
}

export class SlotProp {
  constructor(name, type = Type.unknown, description = undefined) {
    this.name = name;
    this.type = type instanceof Array ? type.map(Value.parseNativeType) : Value.parseNativeType(type);
    this.description = description || undefined;
  }
}

export function* slotPropGenerator() {
  while (true) {
    yield new SlotProp();
  }
}

export const SlotPropGenerator = slotPropGenerator();
