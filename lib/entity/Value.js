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

export class Value {
  constructor(type = Type.unknown, value = undefined, raw = value, rawObject = null) {
    this.type = type;
    this.value = value;
    this.raw = raw;
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

function* undefinedValueGenerator() {
  while (true) {
    yield new Value(Type.unknown, undefined, Type.undefined);
  }
}

const UndefinedValueGenerator = undefinedValueGenerator();

export const UndefinedValue = UndefinedValueGenerator.next().value;
export const NullValue = new Value(Type.unknown, null, Type.null);
