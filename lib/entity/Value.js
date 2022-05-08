import { Type } from '../Enum.js';

const nativeTypes = [
  'String', 'Number', 'Array', 'Boolean', 'Function',
  'Object', 'Null', 'Symbol', 'Undefined', 'BigInt',
];

export class Value {
  constructor(type = Type.unknown, value = undefined, raw = value) {
    this.type = type;
    this.value = value;
    this.raw = raw;
    this.member = false;
  }

  get kind() {
    return nativeTypes.includes(this.type)
      ? this.type.toLowerCase()
      : this.type;
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
