const EventEmitter = require('events')

const { Value } = require('../entity/Value')
const { StringUtils } = require('../StringUtils')
const { UndefinedValue } = require('../entity/UndefinedValue')
const { Syntax, UNDEFINED } = require('../Enum')

const NullValue = new Value('null', null)

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

  /* istanbul ignore next */
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

  parseVariableDeclarationArrayPattern (id, init) {
    id.elements.forEach((element, index) => {
      if (element === null) {
        return
      }

      let name = null
      let defaultValue = UNDEFINED

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
            : new UndefinedValue()
          break

        default:
          this.scope[name] = new Value()
      }

      if (this.scope[name] instanceof UndefinedValue) {
        if (defaultValue !== UNDEFINED) {
          this.scope[name] = defaultValue
        }
      }
    })
  }

  parseVariableDeclarationObjectPattern (id, init) {
    id.properties.forEach((property, index) => {
      let name = null
      let defaultValue = UNDEFINED

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
            : new UndefinedValue()

          break
        }

        default:
          this.scope[name] = new Value()
      }

      if (this.scope[name] instanceof UndefinedValue) {
        if (defaultValue !== UNDEFINED) {
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

    if (computed && key.type === Syntax.Identifier) {
      switch (value.type) {
        case Syntax.Identifier: {
          if (keyName === value.name) {
            return keyName
          }
          break
        }

        default: {
          const idendifier = this.getValue(key)

          if (idendifier && idendifier !== UNDEFINED) {
            return StringUtils.parse(idendifier.value)
          }
        }
      }
    }

    return keyName
  }

  getObjectExpressionValue (node) {
    const value = {}

    for (const item of node.properties) {
      value[item.key.name] = this.getValue(item.value)
    }

    return new Value(node.type, value)
  }

  getFunctionExpressionStringValue (node) {
    const declaration = this.getSource(node)

    if (node.type === Syntax.FunctionExpression) {
      if (declaration.startsWith('()')) {
        // eslint-disable-next-line prefer-template
        return new Value(node.type, 'function' + declaration)
      }
    }

    return new Value(node.type, declaration)
  }

  getFunctionExpressionValue (node) {
    return node
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
      return NullValue
    }

    return new Value(typeof node.value, node.value)
  }

  getValue (node) {
    if (node === null) {
      return NullValue
    }

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

      case Syntax.ClassExpression:
        return new Value(node.type, node)
    }

    return new Value(node.type, this.getSource(node))
  }
}

module.exports.NullValue = NullValue
module.exports.AbstractParser = AbstractParser
