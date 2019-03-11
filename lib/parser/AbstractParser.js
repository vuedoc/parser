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

      case ArrayExpression:
        this.parseArrayExpression(node)
        break

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
  parseFunctionExpression (node) {
    throw new Error('Call abstract parseFunctionExpression() method')
  }

  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseObjectExpression (node) {
    throw new Error('Call abstract parseObjectExpression() method')
  }

  parseVariableDeclaration (node) {
    node.declarations.forEach((itemNode) => {
      switch (itemNode.type) {
        case VariableDeclarator:
          this.scope[itemNode.id.name] = this.getValue(itemNode.init)
          break

        default:
          throw new Error(`Unknow VariableDeclaration node: ${itemNode.type}`)
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

  getValueFunction (node) {
    const declaration = this.root.source.substring(node.start, node.end)

    if (node.type === FunctionExpression) {
      const prefix = declaration.startsWith('()') ? 'function' : ''

      return prefix + declaration
    }

    return declaration
  }

  getTemplateLiteral (node) {
    return this.root.source.substring(node.start, node.end)
  }

  getValue (node) {
    switch (node.type) {
      case Literal:
        return node.value

      case CallExpression:
      case NewExpression:
      case MemberExpression:
      case ObjectPattern:
        return this.root.source.substring(node.start, node.end)

      case TemplateLiteral:
        return this.getTemplateLiteral(node)

      case FunctionExpression:
      case ArrowFunctionExpression:
        return this.getValueFunction(node)

      case ReturnStatement:
        return this.getValue(node.argument, allowIdentifier)

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
