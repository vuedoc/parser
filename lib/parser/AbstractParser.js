const EventEmitter = require('events')

const { Value, UndefinedValue, NullValue } = require('../entity/Value')
const { Syntax } = require('../Enum')

class AbstractParser {
  static extractKeywords (keywords, keywordName, withNotEmptyDesc = false) {
    const items = keywords.filter(({ name, description }) => {
      return name === keywordName && ((withNotEmptyDesc && description) || !withNotEmptyDesc)
    })

    // delete items from keywords
    items.slice(0).reverse().forEach((item) => {
      const index = keywords.findIndex((keyword) => keyword === item)

      keywords.splice(index, 1)
    })

    return items
  }

  static mergeEntryKeyword (entry, keywordName, entryKey = keywordName) {
    const items = AbstractParser.extractKeywords(entry.keywords, keywordName)

    if (items.length) {
      entry[entryKey] = items.pop().description
    }
  }

  constructor (root, scope = root.scope) {
    this.root = root
    this.emitter = root instanceof EventEmitter ? root : root.root
    this.model = null
    this.source = this.root.source
    this.features = this.emitter.features
    this.scope = { ...scope }
  }

  emit (entry) {
    this.emitter.emit(entry.kind, entry)
  }

  parse (node) {
    switch (node.type) {
      case Syntax.ClassMethod:
      case Syntax.ObjectMethod:
      case Syntax.ClassPrivateMethod:
      case Syntax.FunctionExpression:
      case Syntax.ArrowFunctionExpression:
        this.parseFunctionExpression(node.body)
        break

      case Syntax.ObjectProperty:
        this.parseObjectProperty(node)
        break

      case Syntax.ObjectExpression:
        this.parseObjectExpression(node)
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

      case Syntax.ExpressionStatement:
        this.parseExpressionStatement(node)
        break

      case Syntax.BlockStatement:
        node.body.forEach((item) => this.parse(item))
        break
    }
  }

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseEntryComment (entry, node) {
    throw new Error('Call abstract parseEntryComment() method')
  }

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseArrayExpression (node) {
    throw new Error('Call abstract parseArrayExpression() method')
  }

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseCallExpression (node) {
    throw new Error('Call abstract parseCallExpression() method')
  }

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseFunctionExpression (node) {
    throw new Error('Call abstract parseFunctionExpression() method')
  }

  parseObjectExpression (node) {
    node.properties.forEach((item) => this.parseObjectExpressionProperty(item))
  }

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseObjectExpressionProperty (node) {
    throw new Error('Call abstract parseObjectExpressionProperty() method')
  }

  parseObjectProperty (node) {
    this.parse(node.value)
  }

  parseExpressionStatement (node) {
    switch (node.expression.type) {
      case Syntax.CallExpression:
        this.parseCallExpression(node.expression, node)
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

  parseVariableDeclarationArrayPattern (id, init) {
    id.elements.forEach((element, index) => {
      if (element === null) {
        return
      }

      let name = null
      let defaultValue

      switch (element.type) {
        case Syntax.Identifier:
          /* eslint-disable-next-line prefer-destructuring */
          name = element.name
          break

        case Syntax.AssignmentPattern:
          /* eslint-disable-next-line prefer-destructuring */
          name = element.left.name
          defaultValue = this.getValue(element.right)
          break
      }

      switch (init.type) {
        case Syntax.ArrayExpression:
          this.scope[name] = init.elements[index]
            ? this.getValue(init.elements[index])
            : UndefinedValue
          break

        default:
          this.scope[name] = new Value()
      }

      if (this.scope[name] === UndefinedValue) {
        if (defaultValue !== undefined) {
          this.scope[name] = defaultValue
        }
      }
    })
  }

  parseVariableDeclarationObjectPattern (id, init) {
    id.properties.forEach((property, index) => {
      let name = null
      let defaultValue

      switch (property.value.type) {
        case Syntax.Identifier:
          name = this.getValue(property.key).value
          break

        case Syntax.AssignmentPattern:
          name = this.getValue(property.value.left).value
          defaultValue = this.getValue(property.value.right)
          break
      }

      switch (init.type) {
        case Syntax.ObjectExpression: {
          const propertyValue = init.properties.find(({ key }) => {
            return this.getValue(key).value === name
          })

          this.scope[name] = propertyValue
            ? this.getValue(propertyValue.value)
            : UndefinedValue

          break
        }

        default:
          this.scope[name] = new Value()
      }

      if (this.scope[name] === UndefinedValue) {
        if (defaultValue !== undefined) {
          this.scope[name] = defaultValue
        }
      }
    })
  }

  parseVariableDeclaration (node) {
    node.declarations
      .filter(({ type }) => type === Syntax.VariableDeclarator)
      .forEach((item) => {
        switch (item.id.type) {
          case Syntax.ArrayPattern:
            this.parseVariableDeclarationArrayPattern(item.id, item.init)
            break

          case Syntax.ObjectPattern:
            this.parseVariableDeclarationObjectPattern(item.id, item.init)
            break

          default:
            this.scope[item.id.name] = this.getValue(item.init)
        }
      })
  }

  /**
   * @param {AssignmentExpression} node
   */
  parseAssignmentExpression (node) {
    this.scope[node.left.name] = this.getValue(node.right)
  }

  parseKey({ computed, key, value }) {
    const keyName = key.name || key.value

    if (computed) {
      switch (key.type) {
        case Syntax.Identifier:
          switch (value.type) {
            case Syntax.Identifier: {
              if (keyName === value.name) {
                return keyName
              }
              break
            }

            default: {
              const ref = this.getValue(key)

              if (ref !== UndefinedValue) {
                return `${ref.value}`
              }
            }
          }
          break

          case Syntax.CallExpression:
          case Syntax.MemberExpression: {
            const ref = this.getValue(key)

            return ref.raw
          }
      }
    }

    return keyName
  }

  /**
   * Return the parsed value
   * @param {Value} param0 - Object value
   */
  parseValue ({ value, raw }) {
    return this.emitter.options.stringify ? raw : value
  }

  getObjectExpressionValue (node) {
    const value = {}

    for (const item of node.properties) {
      value[item.key.name] = this.getValue(item.value || item)
    }

    return new Value(node.type, value, value)
  }

  getFunctionExpressionStringValue (node) {
    const declaration = this.getSource(node)

    if (node.type === Syntax.FunctionExpression) {
      if (declaration.startsWith('()')) {
        // eslint-disable-next-line prefer-template
        const value = 'function' + declaration

        return new Value(node.type, value, value)
      }
    }

    return new Value(node.type, declaration, declaration)
  }

  getFunctionExpressionValue (node) {
    return this.getSourceValue(node)
  }

  getSourceString (node) {
    return this.source.substring(node.start, node.end)
  }

  getSource (node) {
    switch (node.type) {
      case Syntax.MemberExpression:
        if (node.object.type === Syntax.Identifier) {
          if (node.object.name === 'Symbol') {
            return `[${this.getSourceString(node)}]`
          }
        }
        break
    }

    return this.getSourceString(node)
  }

  getSourceValue (node, type = node.type) {
    const value = this.getSource(node)

    return new Value(type, value, value)
  }

  getTemplateLiteralValue (node) {
    const type = 'string'

    return node.quasis
      ? this.getSourceValue(node, type)
      : this.getSourceValue(node.quasi, type)
  }

  getIdentifierValue (node) {
    if (this.scope.hasOwnProperty(node.name)) {
      return this.scope[node.name]
    }

    if (node.name === 'undefined') {
      return UndefinedValue
    }

    return new Value(node.type, node.name, node.name)
  }

  getLiteralValue (node) {
    if (node.bigint) {
      return new Value('bigint', node.value, node.raw)
    }

    return new Value(typeof node.value, node.value, node.extra.raw)
  }

  getUnaryExpression (node) {
    const type = typeof node.argument.value

    if (node.operator) {
      const raw = `${node.operator}${node.argument.value}`
      const value = this.emitter.options.stringify
        ? raw
        : JSON.parse(raw)

      return new Value(type, value, value)
    }

    return this.getSourceValue(node, type)
  }

  getMemberExpression (node) {
    const exp = this.getSourceString(node)
    const type = exp.startsWith('Math.') || exp.startsWith('Number.')
      ? 'Number'
      : 'Object'

    return this.getSourceValue(node, type)
  }

  getValue (node) {
    switch (node.type) {
      case Syntax.Literal:
      case Syntax.Template:
      case Syntax.StringLiteral:
      case Syntax.NumericLiteral:
      case Syntax.BooleanLiteral:
      case Syntax.RegExpLiteral:
        return this.getLiteralValue(node)

      case Syntax.BigIntLiteral:
        return new Value('bigint', BigInt(node.value), node.extra.raw)

      case Syntax.NullLiteral:
        return NullValue

      case Syntax.UnaryExpression:
        return this.getUnaryExpression(node)

      case Syntax.CallExpression:
        return this.getSourceValue(node, node.callee.name)

      case Syntax.MemberExpression:
        return this.getMemberExpression(node)

      case Syntax.NewExpression:
      case Syntax.ObjectPattern:
        return this.getSourceValue(node)

      case Syntax.TemplateLiteral:
      case Syntax.TaggedTemplateExpression:
        return this.getTemplateLiteralValue(node)

      case Syntax.ClassMethod:
      case Syntax.ObjectMethod:
      case Syntax.ClassPrivateMethod:
      case Syntax.FunctionExpression:
      case Syntax.ArrowFunctionExpression:
        return this.getFunctionExpressionValue(node)

      case Syntax.ReturnStatement:
        return this.getValue(node.argument)

      case Syntax.ObjectExpression:
        return this.getObjectExpressionValue(node)

      case Syntax.Identifier:
        return this.getIdentifierValue(node)

      case Syntax.ClassExpression:
        return new Value(node.type, node, node)
    }

    const value = this.getSource(node)

    return new Value(node.type, value, value)
  }
}

module.exports.NullValue = NullValue
module.exports.AbstractParser = AbstractParser
