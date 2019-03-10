const { DataParser } = require('./DataParser')
const { ComputedEntry } = require('../entry/ComputedEntry')

const {
  BlockStatement,
  ObjectExpression,
  FunctionExpression,
  ArrowFunctionExpression,
  Property,
  UNDEFINED
} = require('../Enum')

const RE_THIS_EXPRESSION = /this\.([a-z0-9_$]+)/ig

class ComputedParser extends DataParser {
  getValueFunction (node) {
    switch (node.body.type) {
      case BlockStatement: {
        let value = null

        for (const item of node.body.body) {
          value = this.getValue(item)
        }

        return value
      }

//       default:
//         throw new Error(`Unknow ValueFunctionExpression node: ${node.body.type}`)
    }

    return null
  }

  getDependencies (node) {
    const dependencies = []
    const source = this.root.source.substring(node.start, node.end - 1)

    let index = 0

    while (index < source.length && index !== -1) {
      const matches = RE_THIS_EXPRESSION.exec(source)

      if (!matches) {
        break
      }

      /* eslint-disable prefer-destructuring */
      index = matches.index

      dependencies.push(matches[1])
    }

    return dependencies
  }

  parseReturnStatement (node) {
    switch (node.type) {
      case ObjectExpression:
        this.parseObjectExpression(node)
        break

      default:
        throw new Error(`Unknow ReturnStatement node: ${node.type}`)
    }
  }

  parseObjectExpression (node) {
    node.properties.forEach((property) => {
      switch (property.type) {
        case FunctionExpression:
        case ArrowFunctionExpression:
          this.parseReturnStatement(property.value)
          break

        case Property: {
          const entry = new ComputedEntry()

          entry.name = property.key.name

          const dependencies = this.getDependencies(property.value)

          entry.dependencies.push(...dependencies)

          this.root.scope[entry.name] = UNDEFINED

          this.emit(entry)
          break
        }

        default:
          throw new Error(`Unknow ObjectExpression node: ${property.type}`)
      }
    })
  }
}

module.exports.ComputedParser = ComputedParser
