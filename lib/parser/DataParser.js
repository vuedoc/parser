const { AbstractExpressionParser } = require('./AbstractExpressionParser')

const {
  ReturnStatement,
  VariableDeclaration,
  ObjectExpression
} = require('../Enum')

const { DataEntry } = require('../entity/DataEntry')

class DataParser extends AbstractExpressionParser {
  parseObjectExpression (node) {
    node.properties.forEach((property) => {
      const entry = new DataEntry()

      entry.name = property.key.name
      entry.default = this.getValue(property.value)

      this.root.scope[entry.name] = entry.default

      this.parseEntryComment(entry, property)
      this.emit(entry)
    })
  }

  parseFunctionExpression (node) {
    switch (node.type) {
      case ObjectExpression:
        this.parseObjectExpression(node)
        break

      default:
        node.body.forEach((item) => {
          switch (item.type) {
            case ReturnStatement:
              this.parseReturnStatement(item.argument)
              break

            case VariableDeclaration:
              this.parseVariableDeclaration(item)
              break

            default:
              throw new Error(`Unknow function expression node: ${item.type}`)
          }
        })
    }
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
