const { AbstractExpressionParser } = require('./AbstractExpressionParser')

const { DataEntry } = require('../entity/DataEntry')
const { Syntax } = require('../Enum')
const { JSDoc } = require('../JSDoc')

class DataParser extends AbstractExpressionParser {
  static mergeEntryKeywords (entry) {
    AbstractExpressionParser.parseEntryCategory(entry)
    AbstractExpressionParser.mergeEntryKeyword(entry, 'type')
    AbstractExpressionParser.mergeEntryKeyword(entry, 'initialValue')

    entry.type = JSDoc.parseType(entry.type)
  }

  parseObjectExpressionProperty (property) {
    this.parseData(property)
  }

  parseData (node) {
    const name = this.parseKey(node)
    const ref = this.getValue(node.value)
    const entry = new DataEntry(name, {
      type: ref.kind,
      value: ref.raw
    })

    this.root.scope[entry.name] = entry.value

    this.parseEntryComment(entry, node)
    DataParser.mergeEntryKeywords(entry)
    this.emit(entry)
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
              this.parseReturnStatement(item)
              break

            case Syntax.VariableDeclaration:
              this.parseVariableDeclaration(item)
              break
          }
        })
    }
  }

  parseReturnStatement (node) {
    switch (node.argument.type) {
      case Syntax.ObjectExpression:
        this.parseObjectExpression(node.argument)
        break
    }
  }
}

module.exports.DataParser = DataParser
