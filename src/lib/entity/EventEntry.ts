import { AbstractCategorizeEntry } from './AbstractCategorizeEntry.js';
import { Type } from '../Enum.js';
import { Value } from './Value.js';
import { toKebabCase } from '@b613/utils/lib/string.js';
import { Vuedoc } from '../../../types/index.js';

export class EventEntry extends AbstractCategorizeEntry<'event'> implements Vuedoc.Entry.EventEntry {
  name: string;
  arguments: Vuedoc.Entry.Param[];

  constructor(name: string, args: Vuedoc.Entry.Param[] = []) {
    super('event');

    this.name = toKebabCase(name, [':']);
    this.arguments = args;
  }
}

export class EventArgument implements Vuedoc.Entry.Param {
  name: string;
  type: Vuedoc.Parser.Type;
  description?: string;
  rest: boolean;

  constructor(name: string, type: Vuedoc.Parser.Type | Vuedoc.Parser.Type[] = Type.unknown) {
    this.name = name;
    this.type = type instanceof Array ? type.map(Value.parseNativeType) : Value.parseNativeType(type);
    this.description = undefined;
    this.rest = false;
  }
}

export function* eventArgumentGenerator(): Generator<EventArgument, EventArgument> {
  while (true) {
    yield new EventArgument('');
  }
}

export const EventArgumentGenerator = eventArgumentGenerator();
