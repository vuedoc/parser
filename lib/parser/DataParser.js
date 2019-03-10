const { AbstractExpressionParser } = require('./AbstractExpressionParser')

const {
  ReturnStatement,
  VariableDeclaration,
  ObjectExpression
} = require('../Enum')

const { DataEntry } = require('../entry/DataEntry')

class DataParser extends AbstractExpressionParser {
  parseObjectExpression (node) {
    node.properties.forEach((property) => {
      const entry = new DataEntry()

      entry.name = property.key.name
      entry.default = this.getValue(property.value)

      this.root.scope[entry.name] = entry.default

      this.emit(entry)
    })
  }

  parseFunctionExpression (node) {
    node.body.forEach((bodyNode) => {
      switch (bodyNode.type) {
        case ReturnStatement:
          this.parseReturnStatement(bodyNode.argument)
          break

        case VariableDeclaration:
          this.parseVariableDeclaration(bodyNode)
          break

        default:
          throw new Error(`Unknow function expression node: ${bodyNode.type}`)
      }
    })
  }

  parseReturnStatement (node) {
    switch (node.type) {
      case ObjectExpression:
        this.parseObjectExpression(node)
        break

      default:
        throw new Error(`Unknow ReturnStatement node: ${node.type}`)
    }
  }
}

module.exports.DataParser = DataParser
