const { AbstractExpressionParser } = require('./AbstractExpressionParser')

const { EventArgument } = require('../entity/EventArgument')
const { EventEntry } = require('../entity/EventEntry')
const { JSDoc } = require('../JSDoc')

const {
  Identifier,
  RestElement,
  AssignmentPattern,
  ObjectPattern,
  ObjectExpression,
  CallExpression,
  AssignmentExpression,
  FEATURE_EVENTS
} = require('../Enum')

class EventParser extends AbstractExpressionParser {
  emit (entry) {
    if (entry instanceof Error) {
      this.emitter.emit('error', entry)
    } else if (!this.root.eventsEmmited[entry.name]) {
      super.emit(entry)

      this.root.eventsEmmited[entry.name] = true
    }
  }

  parse (node) {
    if (this.features.includes(FEATURE_EVENTS)) {
      super.parse(node)
    }
  }

  getValue (node) {
    switch (node.type) {
      case Identifier:
        if (this.scope.hasOwnProperty(node.name)) {
          return this.scope[node.name]
        }

        return '***unhandled***'

      case ObjectExpression:
        return this.getSource(node)
    }

    return super.getValue(node)
  }

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
            const entry = new EventEntry(name, args)

            this.parseEntryComment(entry, node.callee.property)
            JSDoc.parseParams(entry.keywords, entry, 'arguments')

            /* eslint-disable arrow-body-style */
            const eventKeyword = entry.keywords.find(({ name }) => {
              return name === 'event'
            })

            if (eventKeyword) {
              entry.name = eventKeyword.description
            }

            if (entry.name) {
              this.emit(entry)
            } else {
              this.emit(new Error('Missing keyword value for @event'))
            }
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
