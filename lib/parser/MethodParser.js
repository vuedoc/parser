const { JSDoc } = require('../JSDoc')

const { AbstractParser } = require('./AbstractParser')
const { AbstractExpressionParser } = require('./AbstractExpressionParser')
const { EventParser } = require('./EventParser')

const { MethodEntry, MethodParamGenerator } = require('../entity/MethodEntry')
const { Syntax, Features, Properties, Type } = require('../Enum')

function getBlockStatement (node) {
  let block = null

  switch (node.type) {
    case Syntax.ObjectMethod:
    case Syntax.ClassPrivateMethod:
    case Syntax.FunctionExpression:
    case Syntax.ArrowFunctionExpression:
      block = node.body
      break

    case Syntax.BlockStatement:
      block = node
      break
  }

  return block
}

function parseMethodName (entry) {
  const [ keyword ] = AbstractParser.extractKeywords(entry.keywords, 'method', true)

  if (keyword && keyword.description) {
    entry.name = keyword.description
  }
}

function parseEntrySyntax (entry, node) {
  const syntaxKeywords = AbstractParser.extractKeywords(entry.keywords, 'syntax', true)

  if (syntaxKeywords.length) {
    entry.syntax.push(...syntaxKeywords.map(({ description }) => description))
  }

  if (entry.syntax.length === 0) {
    const args = entry.params
      .filter(({ name }) => name.indexOf('.') === -1)
      .map((param) => {
        let name = param.name
        let type = param.type

        if (param.optional) {
          name += '?'
        }

        if (param.type instanceof Array) {
          if (param.rest) {
            type = param.type.map((item) => `${item}[]`)
          }

          type = type.join(' | ')
        } else if (param.rest) {
          type = `${param.type}[]`
        }

        if (param.rest) {
          return `...${param.name}: ${type}`
        }

        return param.defaultValue
          ? `${name}: ${type} = ${param.defaultValue}`
          : `${name}: ${type}`
      })

    if (node.params && entry.params.length !== node.params.length) {
      const restParamIndex = entry.params.findIndex(({ rest }) => rest)

      if (restParamIndex > -1) {
        args.push(...args.splice(restParamIndex, 1))
      }
    }

    const returnType = entry.returns.type instanceof Array
      ? entry.returns.type.join(' | ')
      : entry.returns.type

    const syntax = `${entry.name}(${args.join(', ')}): ${returnType}`

    entry.syntax.push(syntax)
  }
}

class MethodParser extends AbstractExpressionParser {
  constructor (root, { defaultVisibility }) {
    super(root)

    this.defaultVisibility = defaultVisibility
  }

  getParam (node) {
    const param = MethodParamGenerator.next().value

    switch (node.type) {
      case Syntax.Identifier:
        param.name = node.name

        if (node.typeAnnotation) {
          param.type = this.getValue(node.typeAnnotation.typeAnnotation).value
        }
        break

      case Syntax.RestElement:
        param.name = node.argument.name
        param.rest = true
        break

      case Syntax.AssignmentPattern: {
        const ref = this.getValue(node.right)

        param.name = node.left.name
        param.type = ref.kind
        param.defaultValue = ref.raw
        break
      }

      case Syntax.ObjectPattern:
      case Syntax.ObjectExpression:
        param.name = this.getSourceString(node)
        break
    }

    return param
  }

  getParams (params = []) {
    return params.map((item) => this.getParam(item)).filter(({ name }) => name)
  }

  parseObjectExpressionProperty (property) {
    switch (property.type) {
      case Syntax.ObjectProperty:
        this.parseMethodProperty(property, property.value)
        break

      case Syntax.ObjectMethod:
        this.parseMethodProperty(property, property)
        break
    }
  }

  parseMethodProperty (node, property, parseEvents = true) {
    const name = this.parseKey(node)

    if (!Properties.hasOwnProperty(name)) { // ignore hooks
      const paramsNode = property.params ? property : node
      const params = this.getParams(paramsNode.params)
      const entry = new MethodEntry(name, params)

      this.parseEntryComment(entry, node, this.defaultVisibility)
      parseMethodName(entry)
      AbstractExpressionParser.parseEntryCategory(entry)
      JSDoc.parseParams(entry.keywords, entry.params, MethodParamGenerator)
      this.parseEntryReturns(entry, node)
      parseEntrySyntax(entry, paramsNode)
      this.emit(entry)
    }

    if (parseEvents && this.features.includes(Features.events)) {
      new EventParser(this.root, this.scope).parse(property)
    }
  }

  parseEntryReturns (entry, node) {
    if (node.returnType) {
      entry.returns.type = this.getValue(node.returnType.typeAnnotation).value
    } else {
      const block = getBlockStatement(node)

      if (block && block.type === Syntax.BlockStatement) {
        entry.returns.type = block.body.some(({ type }) => type === Syntax.ReturnStatement)
          ? Type.unknow
          : entry.returns.type
      } else if (node.type === Syntax.ObjectProperty) {
        switch (node.value.type) {
          case Syntax.Identifier:
          case Syntax.CallExpression:
            entry.returns.type = Type.unknow
            break
        }
      }
    }

    JSDoc.parseReturn(entry.keywords, entry.returns)

    if (entry.returns.type === 'Promise') {
      entry.returns.type += `<${Type.unknow}>`
    }
  }
}

module.exports.MethodParser = MethodParser
