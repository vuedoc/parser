const { Type } = require('../Enum');
const { Value } = require('./Value');

class RestValue extends Value {
  constructor (type = Type.object, name) {
    super(type, {}, `{ ...${name} }`);

    this.name = name;
  }
}

module.exports.RestValue = RestValue;
