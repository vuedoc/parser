const EventEmitter = require('events')

const {
  VariableDeclarator,
  FunctionExpression,
  ArrowFunctionExpression,
  ObjectExpression,
  Literal,
  ArrayExpression,
  CallExpression,
  NewExpression,
  MemberExpression,
  ObjectPattern,
  TemplateLiteral,
  ReturnStatement,
  Identifier
} = require('../Enum')

class AbstractParser {
  constructor (root, scope = root.scope) {
    this.root = root
    this.emitter = root instanceof EventEmitter ? root : root.root
    this.entry = null
    this.source = this.root.source
    this.features = this.emitter.features
    this.scope = { ...scope }
  }

  emit (entry) {
    this.emitter.emit(entry.kind, entry)
  }

  parse (node) {
    switch (node.type) {
      case FunctionExpression:
      case ArrowFunctionExpression:
        this.parseFunctionExpression(node.body)
        break

      case ObjectExpression:
        this.parseObjectExpression(node)
        break

      case Literal:
        break

      case CallExpression:
        this.parseCallExpression(node)
        break

      case ArrayExpression:
        this.parseArrayExpression(node)
        break

      case Identifier: {
        const identifier = this.scope[node.name]

        if (identifier && typeof(identifier) === 'object' && !identifier.type) {
          for (const key in identifier) {
            const parentToken = this.root.findParentToken(identifier[key])

            if (parentToken) {
              const parentNode = this.root.getTokenNode(parentToken)

              this.parse(parentNode)
              break
            }
          }
        }
        break
      }

      default:
        throw new Error(`Unknow node: ${node.type}`)
    }
  }

  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseArrayExpression (node) {
    throw new Error('Call abstract parseArrayExpression() method')
  }

  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseCallExpression (node) {
    throw new Error('Call abstract parseCallExpression() method')
  }

  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseFunctionExpression (node) {
    throw new Error('Call abstract parseFunctionExpression() method')
  }

  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseObjectExpression (node) {
    throw new Error('Call abstract parseObjectExpression() method')
  }

  parseVariableDeclaration (node) {
    node.declarations.forEach((item) => {
      switch (item.type) {
        case VariableDeclarator:
          this.scope[item.id.name] = this.getValue(item.init)
          break

        default:
          throw new Error(`Unknow VariableDeclaration node: ${item.type}`)
      }
    })
  }

  /**
   * @param {AssignmentExpression} node
   */
  parseAssignmentExpression (node) {
    this.scope[node.left.name] = this.getValue(node.right)
  }

  getValueObject (node) {
    const value = {}

    for (const item of node.properties) {
      value[item.key.name] = this.getValue(item.value)
    }

    return value
  }

  getValueFunctionString (node) {
    const declaration = this.getSource(node)

    if (node.type === FunctionExpression) {
      const prefix = declaration.startsWith('()') ? 'function' : ''

      return prefix + declaration
    }

    return declaration
  }

  getValueFunction (node) {
    return node
  }

  getSource (node) {
    return this.source.substring(node.start, node.end)
  }

  getTemplateLiteral (node) {
    return this.getSource(node)
  }

  getValue (node) {
    switch (node.type) {
      case Literal:
        return node.value

      case CallExpression:
      case NewExpression:
      case MemberExpression:
      case ObjectPattern:
        return this.getSource(node)

      case TemplateLiteral:
        return this.getTemplateLiteral(node)

      case FunctionExpression:
      case ArrowFunctionExpression:
        return this.getValueFunction(node)

      case ReturnStatement:
        return this.getValue(node.argument)

      case ObjectExpression:
        return this.getValueObject(node)

      case Identifier:
        if (this.scope.hasOwnProperty(node.name)) {
          return this.scope[node.name]
        }

        return node.name
    }

    return node.value
  }
}

module.exports.AbstractParser = AbstractParser
