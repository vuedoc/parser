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

  getParam (node) {
    const param = new MethodParam()

    switch (node.type) {
      case Syntax.Identifier:
        param.name = node.name

        if (node.typeAnnotation) {
          param.type = this.getValue(node.typeAnnotation.typeAnnotation).value
        }
        break

      case Syntax.RestElement:
        param.name = node.argument.name
        param.declaration = `...${param.name}`
        break

      case Syntax.AssignmentPattern: {
        const ref = this.getValue(node.right)

        param.name = node.left.name
        param.type = ref.kind
        param.defaultValue = this.parseValue(ref)
        break
      }

      case Syntax.ObjectPattern:
        param.name = 'object'
        param.declaration = this.getValue(node)
        break
    }

    return param
  }

  getParams ({ params = [] }) {
    return params
      .map((item) => this.getParam(item))
      .filter(({ name }) => name !== null)
  }

  parseObjectExpressionProperty (property) {
    switch (property.type) {
      case Syntax.Property:
      case Syntax.ObjectProperty:
        this.parseMethodProperty(property, property.value)
        break

      case Syntax.ObjectMethod:
        this.parseMethodProperty(property, property)
        break
    }
  }

  parseMethodProperty (node, property) {
    const name = this.parseKey(node)
    const params = this.getParams(property)
    const entry = new MethodEntry(name, params)

    this.parseEntry(entry, node)

    const [ keyword ] = AbstractParser.extractKeywords(entry.keywords, 'method', true)

    if (keyword && keyword.description) {
      entry.name = keyword.description
    }

    if (property.returnType) {
      entry.return.type = this.getValue(property.returnType.typeAnnotation).value
    }

    new EventParser(this.root, this.scope).parse(property)
  }

  parseEntry (entry, node) {
    this.parseEntryComment(entry, node, this.defaultVisibility)
    JSDoc.parseParams(entry.keywords, entry, 'params')

    this.emit(entry)
  }
}

module.exports.MethodParser = MethodParser
