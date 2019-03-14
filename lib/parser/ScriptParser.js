const { Parser: AcornParser } = require('acorn')
const AcornStage3 = require('acorn-stage3')

const { AbstractParser } = require('./AbstractParser')
const { NameParser } = require('./NameParser')
const { PropParser } = require('./PropParser')
const { DataParser } = require('./DataParser')
const { ComputedParser } = require('./ComputedParser')
const { MethodParser } = require('./MethodParser')
const { EventParser } = require('./EventParser')
const { CommentParser } = require('./CommentParser')

const { Comment } = require('../entity/Comment')
const { DescriptionEntry } = require('../entity/DescriptionEntry')
const { KeywordsEntry } = require('../entity/KeywordsEntry')

const acorn = AcornParser.extend(AcornStage3)

const {
  Identifier,
  AssignmentExpression,
  VariableDeclaration,
  ExportDefaultDeclaration,
  ObjectExpression,
  CallExpression,
  FunctionExpression,
  ArrowFunctionExpression,
  ExpressionStatement,
  PROPERTY_NAME,
  PROPERTY_PROPS,
  PROPERTY_DATA,
  PROPERTY_COMPUTED,
  PROPERTY_METHODS,
  PROPERTIES,
  FEATURE_DESCRIPTION,
  FEATURE_KEYWORDS
} = require('../Enum')

class ScriptParser extends AbstractParser {
  /**
   * @param {Parser} parser - The Parser object
   */
  constructor (root) {
    super(root)

    this.comments = []
    this.tokens = []
    this.declarations = {}
    this.eventsEmmited = {}

    const locations = true
    const onComment = (block, text, start, end, loc) => {
      this.comments.push(new Comment(block, text, start, end, loc))
    }

    const onToken = (token) => this.tokens.push(token)
    const options = { ...root.options, locations, onComment, onToken }

    this.source = root.options.source.script
    this.ast = acorn.parse(this.source, options)
  }

  getTokenNode (token) {
    const locations = true
    const options = { ...this.root.options, locations }

    return acorn.parseExpressionAt(this.source, token.start, options)
  }

  findTokenIndex (node) {
    /* eslint-disable arrow-body-style */
    return this.tokens.findIndex(({ loc }) => {
      return loc.start.line === node.loc.start.line
    })
  }

  findParentToken (node) {
    let index = this.findTokenIndex(node)

    if (index > 0) {
      while (index > -1) {
        const token = this.tokens[index--]

        if (token.type.startsExpr && token.type.beforeExpr) {
          return token
        }
      }
    }

    return undefined
  }

  findPreviousToken (node) {
    const index = this.findTokenIndex(node) - 1

    if (index > -1) {
      return this.tokens[index]
    }

    return undefined
  }

  findComment (node) {
    const token = this.findPreviousToken(node) || { end: -1 }

    /* eslint-disable arrow-body-style */
    return this.comments.reverse().find(({ start, end }) => {
      return end < node.start && start > token.end
    })
  }

  parseComment (node) {
    if (!this.root.features.includes(FEATURE_DESCRIPTION)
        && !this.root.features.includes(FEATURE_KEYWORDS)) {
      return
    }

    const comment = this.findComment(node)

    if (comment) {
      const { description, keywords } = CommentParser.parse(comment.text)

      if (this.root.features.includes(FEATURE_DESCRIPTION)) {
        if (description) {
          this.emit(new DescriptionEntry(description))
        }
      }

      if (this.root.features.includes(FEATURE_KEYWORDS)) {
        if (keywords) {
          this.emit(new KeywordsEntry(keywords))
        }
      }
    }
  }

  parse (node = this.ast) {
    node.body.forEach((item) => {
      switch (item.type) {
        case VariableDeclaration:
          item.declarations.forEach((declaration) => {
            this.declarations[declaration.id.name] = declaration.init
          })

          this.parseVariableDeclaration(item)
          break

        case ExportDefaultDeclaration:
          this.parseComment(item)
          this.parseExportDefaultDeclaration(item.declaration)
          break

        case ExpressionStatement:
          this.parseExpressionStatement(item)
          break
      }
    })
  }

  parseExpressionStatement (node) {
    switch (node.expression.type) {
      case CallExpression:
        this.parseExportDefaultDeclaration(node.expression)
        break

      case AssignmentExpression:
        if (node.expression.left.object.name === 'module') {
          if (node.expression.left.property.name === 'exports') {
            this.parseComment(node)
            this.parseExportDefaultDeclaration(node.expression.right)
          }
        }
        break
    }
  }

  parseFunctionExpression (node) {
    this.parseExportDefaultDeclaration(node.body)
  }

  parseIdentifier (node) {
    this.parseExportDefaultDeclaration(node)
  }

  parseExportDefaultDeclaration (node) {
    switch (node.type) {
      case ObjectExpression:
        node.properties
          .filter(({ key }) => PROPERTIES.includes(key.name))
          .forEach((property) => this.parseFeature(property))
        break

      case CallExpression:
        if (node.arguments.length) {
          this.parseExportDefaultDeclaration(node.arguments[0])
        }
        break

      case FunctionExpression:
      case ArrowFunctionExpression:
        this.parseFunctionExpression(node)
        break

      case Identifier: {
        const identifierNode = this.declarations[node.name]

        if (identifierNode) {
          this.parseIdentifier(identifierNode)
        }
        break
      }

      default:
        throw new Error(`Unknow ExportDefaultDeclaration node: ${node.type}`)
    }
  }

  parseFeature (property) {
    let parser = null

    switch (property.key.name) {
      case PROPERTY_NAME:
        parser = new NameParser(this)
        break

      case PROPERTY_DATA:
        parser = new DataParser(this)
        break

      case PROPERTY_PROPS:
        parser = new PropParser(this)
        break

      case PROPERTY_COMPUTED:
        parser = new ComputedParser(this)
        break

      case PROPERTY_METHODS:
        parser = new MethodParser(this, {
          defaultVisibility: this.root.options.defaultMethodVisibility
        })
        break

      default:
        parser = new EventParser(this)
        break
    }

    parser.parse(property.value)
  }
}

module.exports.ScriptParser = ScriptParser
