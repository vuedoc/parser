const { AbstractExpressionParser } = require('./AbstractExpressionParser')
const { EventArgument } = require('../entry/EventArgument')
const { EventEntry } = require('../entry/EventEntry')

const {
  Identifier,
  RestElement,
  AssignmentPattern,
  ObjectPattern,
  CallExpression,
  AssignmentExpression
} = require('../Enum')

class EventParser extends AbstractExpressionParser {
  getArgument (node) {
    const argument = new EventArgument()

    switch (node.type) {
      case Identifier:
        argument.name = node.name
        break

      case RestElement:
        argument.name = node.argument.name
        argument.declaration = `...${argument.name}`
        break

      case AssignmentPattern:
        argument.name = node.left.name
        argument.defaultValue = this.getValue(node.right)
        break

      case ObjectPattern:
        argument.name = 'object'
        argument.declaration = this.getValue(node)
        break

      default:
        argument.name = this.getValue(node)
    }

    return argument
  }

  /**
   * @param {CallExpression} node
   */
  parseCallExpression (node) {
    switch (node.callee.type) {
      case Identifier:
        node.arguments.forEach((argument) => this.parse(argument))
        break

      default:
        if (node.callee.property.name === '$emit') {
          if (node.arguments.length) {
            const name = this.getValue(node.arguments[0])
            const eventArgs = node.arguments.slice(1)
            const args = eventArgs.map((arg) => this.getArgument(arg))

            this.emit(new EventEntry(name, args))
          }
        }
        break
    }
  }

  parseExpressionStatement (node) {
    switch (node.expression.type) {
      case CallExpression:
        this.parseCallExpression(node.expression)
        break

      case AssignmentExpression:
        this.parseAssignmentExpression(node.expression)
        break

      default:
        throw new Error(`Unknow ExpressionStatement node: ${node.expression.type}`)
    }
  }
}

module.exports.EventParser = EventParser
