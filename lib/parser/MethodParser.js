const { JSDoc } = require('../JSDoc')

const { AbstractExpressionParser } = require('./AbstractExpressionParser')
const { EventParser } = require('./EventParser')

const { MethodEntry } = require('../entry/MethodEntry')
const { MethodParam } = require('../entry/MethodParam')

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
  static parseKeywords (keywords = [], event) {
    event.params = []

    keywords.forEach(({ name, description }) => {
      switch (name) {
        case 'arg':
        case 'param':
        case 'argument':
          event.params.push(JSDoc.parseParamKeyword(description))
          break

        case 'return':
        case 'returns':
          event.return = JSDoc.parseReturnKeyword(description)
          break
      }
    })

    if (event.params.length === 0) {
      delete event.params
    }
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

          this.emit(new MethodEntry(name, params))

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
