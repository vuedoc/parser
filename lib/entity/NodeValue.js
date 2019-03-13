const { UNDEFINED } = require('../Enum')

class NodeValue {
  constructor () {
    this.value = UNDEFINED
    this.raw = UNDEFINED
    this.bigint = UNDEFINED
  }
}

module.exports.NodeValue = NodeValue
