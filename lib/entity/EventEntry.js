import { AbstractCategorizeEntry } from './AbstractCategorizeEntry.js';
import { Type } from '../Enum.js';
import { Value } from './Value.js';

export class EventEntry extends AbstractCategorizeEntry {
  constructor(name, args = []) {
    super('event');

    this.name = name;
    this.arguments = args;
  }
}

export class EventArgument {
  constructor(name, type = Type.unknown) {
    this.name = name;
    this.type = type instanceof Array ? type.map(Value.parseNativeType) : Value.parseNativeType(type);
    this.description = undefined;
    this.rest = false;
  }
}

export function* eventArgumentGenerator() {
  while (true) {
    yield new EventArgument();
  }
}

export const EventArgumentGenerator = eventArgumentGenerator();
