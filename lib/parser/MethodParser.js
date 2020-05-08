const { JSDoc } = require('../JSDoc')

const { AbstractParser } = require('./AbstractParser')
const { AbstractExpressionParser } = require('./AbstractExpressionParser')
const { EventParser } = require('./EventParser')

const { MethodEntry } = require('../entity/MethodEntry')
const { MethodParam } = require('../entity/MethodParam')

const { Syntax, Features } = require('../Enum')

class MethodParser extends AbstractExpressionParser {
  constructor (root, { defaultVisibility }) {
    super(root)

    this.defaultVisibility = defaultVisibility
  }

  parse (node) {
    if (this.features.includes(Features.methods)) {
      super.parse(node)
    }
  }

  getParam (node) {
    const param = new MethodParam()

    switch (node.type) {
      case Syntax.Identifier:
        param.name = node.name
        break

      case Syntax.RestElement:
        param.name = node.argument.name
        param.declaration = `...${param.name}`
        break

      case Syntax.AssignmentPattern:
        param.name = node.left.name
        param.defaultValue = this.getValue(node.right)
        break

      case Syntax.ObjectPattern:
        param.name = 'object'
        param.declaration = this.getValue(node)
        break
    }

    return param
  }

  getParams (node) {
    return (node.params || [])
      .map((item) => this.getParam(item))
      .filter(({ name }) => name !== null)
  }

  parseObjectExpression (node) {
    node.properties.forEach((property) => {
      switch (property.type) {
        case Syntax.FunctionExpression:
        case Syntax.ArrowFunctionExpression:
          this.parseReturnStatement(property.value)
          break

        case Syntax.Property:
          this.parseMethodProperty(property)
          break
      }
    })
  }

  parseMethodProperty (property) {
    const name = this.parseKey(property)
    const params = this.getParams(property.value)
    const entry = new MethodEntry(name, params)

    this.parseEntry(entry, property)

    const [ keyword ] = AbstractParser.extractKeywords(entry.keywords, 'method', true)

    if (keyword && keyword.description) {
      entry.name = keyword.description
    }

    new EventParser(this.root, this.scope).parse(property.value)
  }

  parseEntry (entry, node) {
    this.parseEntryComment(entry, node, this.defaultVisibility)
    JSDoc.parseParams(entry.keywords, entry, 'params')

    this.emit(entry)
  }
}

module.exports.MethodParser = MethodParser
