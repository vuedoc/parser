const { Type } = require('../Enum');

const nativeTypes = [
  'String', 'Number', 'Array', 'Boolean', 'Function',
  'Object', 'Null', 'Symbol', 'Undefined', 'BigInt'
];

class Value {
  constructor (type = Type.unknown, value = undefined, raw = value) {
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

module.exports.Value = Value;
module.exports.UndefinedValueGenerator = undefinedValueGenerator();
module.exports.UndefinedValue = this.UndefinedValueGenerator.next().value;
module.exports.NullValue = new Value(Type.unknown, null, Type.null);
