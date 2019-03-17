const EventEmitter = require('events')

const { Value } = require('../entity/Value')
const { UndefinedValue } = require('../entity/UndefinedValue')
const { Syntax } = require('../Enum')

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
      case Syntax.FunctionExpression:
      case Syntax.ArrowFunctionExpression:
        this.parseFunctionExpression(node.body)
        break

      case Syntax.ObjectExpression:
        this.parseObjectExpression(node)
        break

      case Syntax.Literal:
        break

      case Syntax.CallExpression:
        this.parseCallExpression(node)
        break

      case Syntax.ArrayExpression:
        this.parseArrayExpression(node)
        break

      case Syntax.Identifier:
        this.parseIdentifier(node)
        break
    }
  }

  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseEntryComment (entry, node) {
    throw new Error('Call abstract parseEntryComment() method')
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

  parseExpressionStatement (node) {
    switch (node.expression.type) {
      case Syntax.CallExpression:
        this.parseCallExpression(node.expression)
        break

      case Syntax.AssignmentExpression:
        this.parseAssignmentExpression(node.expression)
        break
    }
  }

  parseIdentifier (node) {
    const identifier = this.scope[node.name]

    if (identifier) {
      const { type, value } = identifier

      if (type === Syntax.ObjectExpression) {
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
    node.declarations
      .filter(({ type }) => type === Syntax.VariableDeclarator)
      .forEach((item) => {
        this.scope[item.id.name] = this.getValue(item.init)
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

    if (node.type === Syntax.FunctionExpression) {
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
      case Syntax.Literal:
        return this.getLiteralValue(node)

      case Syntax.CallExpression:
      case Syntax.NewExpression:
      case Syntax.MemberExpression:
      case Syntax.ObjectPattern:
        return this.getSourceValue(node)

      case Syntax.TemplateLiteral:
      case Syntax.TaggedTemplateExpression:
        return this.getTemplateLiteralValue(node)

      case Syntax.FunctionExpression:
      case Syntax.ArrowFunctionExpression:
        return this.getFunctionExpressionValue(node)

      case Syntax.ReturnStatement:
        return this.getValue(node.argument)

      case Syntax.ObjectExpression:
        return this.getObjectExpressionValue(node)

      case Syntax.Identifier:
        return this.getIdentifierValue(node)
    }

    return new Value(typeof node.value, node.value)
  }
}

module.exports.AbstractParser = AbstractParser
