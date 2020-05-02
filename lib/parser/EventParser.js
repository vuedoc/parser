const { NullValue } = require('./AbstractParser')
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
    if (node === null) {
      return NullValue
    }

    switch (node.type) {
      case Syntax.Identifier:
        if (this.scope.hasOwnProperty(node.name)) {
          return this.scope[node.name]
        }

        return '***unhandled***'

      case Syntax.ObjectExpression:
      case Syntax.MemberExpression:
        return this.getSource(node)
    }

    return super.getValue(node)
  }

  getArgument (node, argument = new EventArgument()) {
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
      case Syntax.ObjectExpression:
        argument.name = 'object'
        argument.type = 'object'
        argument.declaration = this.getValue(node)
        break

      case Syntax.MemberExpression:
        argument.name = node.property.name
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

              this.parseEntryNode(node, name, args)
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

  parseEntryNode(node, name, args) {
    const entry = new EventEntry(name, args)

    this.parseEntryComment(entry, node)
    JSDoc.parseParams(entry.keywords, entry, 'arguments')

    const eventKeyword = entry.keywords.find(({ name }) => name === 'event')

    if (eventKeyword) {
      entry.name = eventKeyword.description
    }

    args.forEach((arg) => {
      if (typeof arg.name === 'object' && arg.name) {
        arg.type = arg.name.type || 'Any'
        arg.name = arg.name.value
      }
    })

    if (entry.name) {
      this.emit(entry)
    } else {
      const exp = this.source.substring(node.start, node.end)

      this.emit(new Error(`Missing keyword value for @event: ${exp}`))
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
