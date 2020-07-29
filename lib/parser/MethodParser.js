const { JSDoc } = require('../JSDoc')

const { AbstractParser } = require('./AbstractParser')
const { AbstractExpressionParser } = require('./AbstractExpressionParser')
const { EventParser } = require('./EventParser')

const { MethodEntry } = require('../entity/MethodEntry')
const { MethodParam } = require('../entity/MethodParam')

const { Syntax, Features, Properties } = require('../Enum')

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

  getParams (params = []) {
    return params
      .map((item) => this.getParam(item))
      .filter(({ name }) => name !== null)
  }

  parseObjectExpressionProperty (property) {
    switch (property.type) {
      case Syntax.ObjectProperty:
        this.parseMethodProperty(property, property.value)
        break

      case Syntax.ObjectMethod:
        this.parseMethodProperty(property, property)
        break

      case Syntax.Property:
        this.parseMethodProperty(property.value, property)
        break
    }
  }

  parseMethodProperty (node, property, parseEvents = true) {
    const name = this.parseKey(node)

    if (this.features.includes(Features.methods)) {
      if (!Properties.hasOwnProperty(name)) { // ignore hooks
        const params = this.getParams(property.params || node.params)
        const entry = new MethodEntry(name, params)

        this.parseEntryComment(entry, node, this.defaultVisibility)
        JSDoc.parseParams(entry.keywords, entry, 'params')

        const [ keyword ] = AbstractParser.extractKeywords(entry.keywords, 'method', true)

        if (keyword && keyword.description) {
          entry.name = keyword.description
        }

        if (node.returnType) {
          entry.return.type = this.getValue(node.returnType.typeAnnotation).value
        }

        this.emit(entry)
      }
    }

    if (name !== Features.data) {
      if (parseEvents && this.features.includes(Features.events)) {
        new EventParser(this.root, this.scope).parse(property)
      }
    }
  }
}

module.exports.MethodParser = MethodParser
