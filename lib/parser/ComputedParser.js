const { AbstractExpressionParser } = require('./AbstractExpressionParser')
const { EventParser } = require('./EventParser')

const { ComputedEntry } = require('../entity/ComputedEntry')
const { UndefinedValue } = require('../entity/Value')

const { Syntax } = require('../Enum')

const RE_THIS_EXPRESSION = /this\.([a-z0-9_$]+)/ig

class ComputedParser extends AbstractExpressionParser {
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
    let block = null

    switch (node.type) {
      case Syntax.ObjectProperty:
        block = node.value
        break

      case Syntax.ObjectMethod:
      case Syntax.ClassPrivateMethod:
      case Syntax.FunctionExpression:
      case Syntax.ArrowFunctionExpression:
        block = node.body
        break

      case Syntax.ObjectExpression:
        for (const item of node.properties) {
          switch (item.key.name) {
            case 'get':
              block = this.getBlockStatement(item)
              break

            case 'set':
              new EventParser(this.root, this.scope).parse(item)
              break
          }
        }
        break

      case Syntax.BlockStatement:
        block = node
        break
    }

    return block
  }

  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseCallExpression (node) {
    // ignore call expression on Computed Property
  }

  parseObjectExpressionProperty (property) {
    const name = this.parseKey(property)
    const entry = new ComputedEntry(name)

    switch (property.type) {
      case Syntax.ObjectMethod:
      case Syntax.FunctionExpression:
      case Syntax.ArrowFunctionExpression:
        this.parseEntry(entry, property.body, property)
        break

      case Syntax.ObjectProperty:
        this.parseEntry(entry, property.value, property)
        break
    }
  }

  parseEntry (entry, node, parent) {
    const block = this.getBlockStatement(node)

    if (block) {
      const dependencies = this.getDependencies(block)

      entry.dependencies.push(...dependencies)
    }

    this.root.scope[entry.name] = UndefinedValue

    this.parseEntryComment(entry, parent)
    this.emit(entry)
  }
}

module.exports.ComputedParser = ComputedParser
