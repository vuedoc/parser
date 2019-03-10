const { JSDoc } = require('../JSDoc')

const { AbstractExpressionParser } = require('./AbstractExpressionParser')
const { EventParser } = require('./EventParser')

const { MethodEntry } = require('../entity/MethodEntry')
const { MethodParam } = require('../entity/MethodParam')

const {
  Identifier,
  RestElement,
  AssignmentPattern,
  Property,
  ObjectPattern,
  FunctionExpression,
  ArrowFunctionExpression
} = require('../Enum')

class MethodParser extends AbstractExpressionParser {
  constructor (root, { defaultVisibility }) {
    super(root)

    this.defaultVisibility = defaultVisibility
  }

  getParam (node) {
    const param = new MethodParam()

    switch (node.type) {
      case Identifier:
        param.name = node.name
        break

      case RestElement:
        param.name = node.argument.name
        param.declaration = `...${param.name}`
        break

      case AssignmentPattern:
        param.name = node.left.name
        param.defaultValue = this.getValue(node.right)
        break

      case ObjectPattern:
        param.name = 'object'
        param.declaration = this.getValue(node)
        break

      default:
        return null
    }

    return param
  }

  parseObjectExpression (node) {
    node.properties.forEach((property) => {
      switch (property.type) {
        case FunctionExpression:
        case ArrowFunctionExpression:
          this.parseReturnStatement(property.value)
          break

        case Property: {
          const { name } = property.key
          const { value } = property
          const params = value.params.map((item) => this.getParam(item))
          const entry = new MethodEntry(name, params)
          
          this.parseEntryComment(entry, property, this.defaultVisibility)
          JSDoc.parseParams(entry.keywords, entry)

          this.emit(entry)

          new EventParser(this.root, this.scope).parse(property.value)
          break
        }

        default:
          throw new Error(`Unknow ObjectExpression node: ${property.type}`)
      }
    })
  }
}

module.exports.MethodParser = MethodParser
