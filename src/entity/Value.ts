import { Parser } from '../../types/Parser.js';
import { Type } from '../lib/Enum.js';

import * as Babel from '@babel/types';

const NATIVE_TYPES = [
  'String', 'Number', 'Array', 'Boolean', 'Function',
  'Object', 'Null', 'Symbol', 'Undefined', 'BigInt',
];

const NATIVE_TYPES_LIST = NATIVE_TYPES.concat(NATIVE_TYPES.map((type) => type + '[]'));
const NATIVE_TYPES_LOWERCASE = NATIVE_TYPES.map((type) => type.toLowerCase());
const NATIVE_TYPES_ARRAY = NATIVE_TYPES.map((type) => type.toLowerCase() + '[]').concat([Type.any, Type.unknown]);
const NATIVE_TYPES_PREFIX = [
  'Record<',
  'Array<',
  'Map<',
  'Set<',
];

export class Value<TValue = string> implements Parser.Value<TValue> {
  type: Parser.Type | Parser.Type[];
  value: TValue;
  raw: string;
  rawObject?: Record<string, any>;
  rawNode?: Record<string, Babel.Node> | Babel.Node[];
  member: boolean;
  function?: boolean;
  $kind?: string;

  constructor(type?: Parser.Type | Parser.Type[], value?: any, raw?: string) {
    this.type = type || Type.unknown;
    this.value = value;
    this.raw = raw ?? value;
    this.member = false;

    if (this.value instanceof Array) {
      this.rawObject = [];
      this.rawNode = [];
    } else if (typeof this.value === 'object' && this.value !== null) {
      this.rawObject = {};
      this.rawNode = {};
    }
  }

  get kind() {
    return Value.parseNativeType(this.type);
  }

  static isNativeType(type) {
    return NATIVE_TYPES.includes(type)
      || NATIVE_TYPES_LOWERCASE.includes(type)
      || NATIVE_TYPES_ARRAY.includes(type)
      || NATIVE_TYPES_PREFIX.some((item) => type.startsWith(item));
  }

  static parseNativeType(type) {
    return NATIVE_TYPES_LIST.includes(type) ? type.toLowerCase() : type;
  }
}

function* undefineGenerator(): Generator<Value<undefined>, Value<undefined>> {
  while (true) {
    yield new Value<undefined>(Type.unknown, undefined, 'undefined');
  }
}

function* nullGenerator(): Generator<Value<null>, Value<null>> {
  while (true) {
    yield new Value<null>(Type.unknown, null, 'null');
  }
}

function* objectGenerator(): Generator<Value<object>, Value<object>> {
  while (true) {
    yield new Value<object>(Type.object, {}, '{}');
  }
}

function* arrayGenerator(): Generator<Value<any[]>, Value<any[]>> {
  while (true) {
    yield new Value<any[]>(Type.array, [], '[]');
  }
}

export const generateUndefineValue = undefineGenerator();
export const generateNullGenerator = nullGenerator();
export const generateObjectGenerator = objectGenerator();
export const generateArrayGenerator = arrayGenerator();
