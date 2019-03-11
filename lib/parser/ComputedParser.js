const { DataParser } = require('./DataParser')
const { ComputedEntry } = require('../entity/ComputedEntry')

const {
  BlockStatement,
  ObjectExpression,
  FunctionExpression,
  ArrowFunctionExpression,
  Property,
  UNDEFINED,
  FEATURE_DATA
} = require('../Enum')

const RE_THIS_EXPRESSION = /this\.([a-z0-9_$]+)/ig

class ComputedParser extends DataParser {
  parse (node) {
    if (this.features.includes(FEATURE_DATA)) {
      super.parse(node)
    }
  }

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

  getBlockStatement (node) {
    switch (node.type) {
      case Property:
        return node.value

      case FunctionExpression:
      case ArrowFunctionExpression:
        return node.body

      case ObjectExpression:
        for (const item of node.properties) {
          if (item.key.name === 'get') {
            return this.getBlockStatement(item)
          }
        }
        break
    }

    return null
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
          const block = this.getBlockStatement(property.value)

          entry.name = property.key.name

          if (block) {
            const dependencies = this.getDependencies(block)

            entry.dependencies.push(...dependencies)
          }

          this.root.scope[entry.name] = UNDEFINED

          this.parseEntryComment(entry, property)
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
