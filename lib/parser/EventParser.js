const { AbstractExpressionParser } = require('./AbstractExpressionParser')

const { EventArgument } = require('../entity/EventArgument')
const { EventEntry } = require('../entity/EventEntry')
const { JSDoc } = require('../JSDoc')

const { Syntax, Features } = require('../Enum')

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
    if (this.features.includes(Features.events)) {
      super.parse(node)
    }
  }

  getValue (node) {
    switch (node.type) {
      case Syntax.Identifier:
        if (this.scope.hasOwnProperty(node.name)) {
          return this.scope[node.name]
        }

        return '***unhandled***'

      case Syntax.ObjectExpression:
        return this.getSource(node)
    }

    return super.getValue(node)
  }

  getArgument (node) {
    const argument = new EventArgument()

    switch (node.type) {
      case Syntax.Identifier:
        argument.name = node.name
        break

      case Syntax.RestElement:
        argument.name = node.argument.name
        argument.declaration = `...${argument.name}`
        break

      case Syntax.AssignmentPattern:
        argument.name = node.left.name
        argument.defaultValue = this.getValue(node.right)
        break

      case Syntax.ObjectPattern:
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
      case Syntax.Identifier:
        node.arguments.forEach((argument) => this.parse(argument))
        break

      case Syntax.Super:
      case Syntax.TaggedTemplateExpression:
        // Ignore expression
        break

      default:
        switch (node.callee.property.name) {
          case '$emit':
            if (node.arguments.length) {
              const name = this.getValue(node.arguments[0])
              const eventArgs = node.arguments.slice(1)
              const args = eventArgs.map((arg) => this.getArgument(arg))
              const entry = new EventEntry(name, args)

              this.parseEntryComment(entry, node.callee.property)
              JSDoc.parseParams(entry.keywords, entry, 'arguments')

              const eventKeyword = entry.keywords.find(({ name }) => {
                return name === 'event'
              })

              if (eventKeyword) {
                entry.name = eventKeyword.description
              }

              if (entry.name) {
                this.emit(entry)
              } else {
                const exp = this.source.substring(node.start, node.end)

                this.emit(new Error(`Missing keyword value for @event: ${exp}`))
              }
            }
            break

          case 'then':
          case 'catch':
          case 'finally':
          case 'nextTick':
          case '$nextTick':
            node.arguments.forEach((argument) => this.parse(argument))
            break
        }
        break
    }
  }

  parseExpressionStatement (node) {
    switch (node.expression.type) {
      case Syntax.CallExpression:
        this.parseCallExpression(node.expression)
        break

      case Syntax.AssignmentExpression:
        this.parseAssignmentExpression(node.expression)
        break

      default:
        super.parseExpressionStatement(node)
    }
  }
}

module.exports.EventParser = EventParser
