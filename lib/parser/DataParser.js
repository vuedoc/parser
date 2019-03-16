const { AbstractExpressionParser } = require('./AbstractExpressionParser')

const { DataEntry } = require('../entity/DataEntry')
const { Syntax, Features } = require('../Enum')

class DataParser extends AbstractExpressionParser {
  parse (node) {
    if (this.features.includes(Features.data)) {
      super.parse(node)
    }
  }

  parseObjectExpression (node) {
    node.properties.forEach((property) => {
      const { name } = property.key
      const value = this.getValue(property.value)
      const entry = new DataEntry(name, value)

      this.root.scope[entry.name] = entry.value

      this.parseEntryComment(entry, property)
      this.emit(entry)
    })
  }

  parseFunctionExpression (node) {
    switch (node.type) {
      case Syntax.ObjectExpression:
        this.parseObjectExpression(node)
        break

      default:
        node.body.forEach((item) => {
          switch (item.type) {
            case Syntax.ReturnStatement:
              this.parseReturnStatement(item.argument)
              break

            case Syntax.VariableDeclaration:
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
      case Syntax.ObjectExpression:
        this.parseObjectExpression(node)
        break

      default:
        throw new Error(`Unknow ReturnStatement node: ${node.type}`)
    }
  }
}

module.exports.DataParser = DataParser
