import { AbstractCategorizeEntry } from './AbstractCategorizeEntry.js';
import { Type } from '../lib/Enum.js';
import { Value } from './Value.js';
import { toKebabCase } from '@b613/utils/lib/string.js';
import { Parser } from '../../types/Parser.js';
import { Entry } from '../../types/Entry.js';

export class EventEntry extends AbstractCategorizeEntry<'event'> implements Entry.EventEntry {
  name: string;
  arguments: Entry.Param[];

  constructor(name: string, args: Entry.Param[] = []) {
    super('event');

    this.name = toKebabCase(name, [':']);
    this.arguments = args;
  }
}

export class EventArgument implements Entry.Param {
  name: string;
  type: Parser.Type | Parser.Type[];
  description?: string;
  rest: boolean;

  constructor(name: string, type: Parser.Type | Parser.Type[] = Type.unknown) {
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
