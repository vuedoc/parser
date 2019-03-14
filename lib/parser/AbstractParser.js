const EventEmitter = require('events')

const { Value } = require('../entity/Value')
const { UndefinedValue } = require('../entity/UndefinedValue')

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

      case Identifier:
        this.parseIdentifier(node)
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

  parseIdentifier (node) {
    const identifier = this.scope[node.name]

    if (identifier) {
      const { type, value } = identifier

      if (type === ObjectExpression) {
        for (const key in value) {
          const parentToken = this.root.findParentToken(value[key])

          if (parentToken) {
            const parentNode = this.root.getTokenNode(parentToken)

            this.parse(parentNode)
            break
          }
        }
      }
    }
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

  getObjectExpressionValue (node) {
    const value = {}

    for (const item of node.properties) {
      value[item.key.name] = this.getValue(item.value)
    }

    return new Value(node.type, value)
  }

  getFunctionExpressionStringValue (node) {
    const type = 'FunctionExpression'
    const declaration = this.getSource(node)

    if (node.type === FunctionExpression) {
      const prefix = declaration.startsWith('()') ? 'function' : ''

      return new Value(type, prefix + declaration)
    }

    return new Value(type, declaration)
  }

  getFunctionExpressionValue (node) {
    return node
  }

  getSource (node) {
    return this.source.substring(node.start, node.end)
  }

  getSourceValue (node) {
    return new Value(node.type, this.getSource(node))
  }

  getTemplateLiteralValue (node) {
    return this.getSourceValue(node)
  }

  getIdentifierValue (node) {
    if (this.scope.hasOwnProperty(node.name)) {
      return this.scope[node.name]
    }

    if (node.name === 'undefined') {
      return new UndefinedValue()
    }

    return new Value(node.type, node.name)
  }

  getLiteralValue (node) {
    if (node.raw === node.bigint) {
      return new Value('bigint', node.raw)
    }

    if (node.value === null) {
      return new Value('null', node.value)
    }

    return new Value(typeof node.value, node.value)
  }

  getValue (node) {
    switch (node.type) {
      case Literal:
        return this.getLiteralValue(node)

      case CallExpression:
      case NewExpression:
      case MemberExpression:
      case ObjectPattern:
        return this.getSourceValue(node)

      case TemplateLiteral:
        return this.getTemplateLiteralValue(node)

      case FunctionExpression:
      case ArrowFunctionExpression:
        return this.getFunctionExpressionValue(node)

      case ReturnStatement:
        return this.getValue(node.argument)

      case ObjectExpression:
        return this.getObjectExpressionValue(node)

      case Identifier:
        return this.getIdentifierValue(node)
    }

    return new Value(typeof node.value, node.value)
  }
}

module.exports.AbstractParser = AbstractParser
