const { AbstractExpressionParser } = require('./AbstractExpressionParser')
const { EventParser } = require('./EventParser')

const { ComputedEntry } = require('../entity/ComputedEntry')
const { UndefinedValue } = require('../entity/UndefinedValue')

const { Syntax, Features } = require('../Enum')

const RE_THIS_EXPRESSION = /this\.([a-z0-9_$]+)/ig

class ComputedParser extends AbstractExpressionParser {
  parse (node) {
    if (this.features.includes(Features.computed)) {
      super.parse(node)
    }
  }

  getDependencies (node) {
    const dependencies = new Set()
    const source = this.source.substring(node.start, node.end - 1)

    let index = 0

    while (index < source.length && index !== -1) {
      const matches = RE_THIS_EXPRESSION.exec(source)

      if (!matches) {
        break
      }

      /* eslint-disable prefer-destructuring */
      index = matches.index

      dependencies.add(matches[1])
    }

    return [ ...dependencies.values() ]
  }

  getBlockStatement (node) {
    switch (node.type) {
      case Syntax.Property:
        return node.value

      case Syntax.FunctionExpression:
      case Syntax.ArrowFunctionExpression:
        return node.body

      case Syntax.ObjectExpression:
        for (const item of node.properties) {
          switch (item.key.name) {
            case 'get':
              return this.getBlockStatement(item)

            case 'set':
              new EventParser(this.root, this.scope).parse(item.value)
              break
          }
        }
        break
    }

    return null
  }

  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseCallExpression (node) {
    // ignore call expression on Computed Property
  }

  parseReturnStatement (node) {
    switch (node.type) {
      case Syntax.ObjectExpression:
        this.parseObjectExpression(node)
        break
    }
  }

  parseObjectExpression (node) {
    node.properties.forEach((property) => {
      switch (property.type) {
        case Syntax.FunctionExpression:
        case Syntax.ArrowFunctionExpression:
          this.parseReturnStatement(property.value)
          break

        case Syntax.Property: {
          const name = this.parseKey(property)
          const entry = new ComputedEntry(name)

          this.parseEntry(entry, property)
          break
        }

        default:
          super.parseObjectExpression(property)
      }
    })
  }

  parseEntry (entry, node) {
    const block = this.getBlockStatement(node.value)

    if (block) {
      const dependencies = this.getDependencies(block)

      entry.dependencies.push(...dependencies)
    }

    this.root.scope[entry.name] = new UndefinedValue()

    this.parseEntryComment(entry, node)
    this.emit(entry)
  }

  parseEntryNode(node, name, dependencies = []) {
    const entry = new ComputedEntry(name, dependencies)

    this.root.scope[name] = new UndefinedValue()

    this.parseEntryComment(entry, node)
    this.emit(entry)
  }
}

module.exports.ComputedParser = ComputedParser
