import { Vuedoc } from '../../../types/index.js';
import { Type } from '../Enum.js';

const NATIVE_TYPES = [
  'String', 'Number', 'Array', 'Boolean', 'Function',
  'Object', 'Null', 'Symbol', 'Undefined', 'BigInt',
];

const NATIVE_TYPES_LOWERCASE = NATIVE_TYPES.map((type) => type.toLowerCase());
const NATIVE_TYPES_ARRAY = NATIVE_TYPES.map((type) => type.toLowerCase() + '[]').concat([Type.any, Type.unknown]);
const NATIVE_TYPES_PREFIX = [
  'Record<',
  'Array<',
  'Map<',
  'Set<',
];

export class Value<TValue = string> {
  type: Vuedoc.Parser.Type;
  value: TValue;
  raw: string;
  rawObject: Record<string, any> | null;
  member: boolean;
  $kind?: string;

  constructor(type?: Vuedoc.Parser.Type, value?: any, raw?: string, rawObject: object | null = null) {
    this.type = type || Type.unknown;
    this.value = value;
    this.raw = raw || value;
    this.rawObject = rawObject;
    this.member = false;
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
    return NATIVE_TYPES.includes(type) ? type.toLowerCase() : type;
  }
}

export const UndefinedValue = new Value<undefined>(Type.unknown, undefined, Type.undefined);
export const NullValue = new Value<null>(Type.unknown, null, Type.null);
