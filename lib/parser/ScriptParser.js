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
const { Syntax, Properties, Features } = require('../Enum')

const acorn = AcornParser.extend(AcornStage3)

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

    this.source = root.options.source.script.trim()
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
    if (!this.root.features.includes(Features.description)
        && !this.root.features.includes(Features.keywords)) {
      return
    }

    const comment = this.findComment(node)

    if (comment) {
      const { description, keywords } = CommentParser.parse(comment.text)

      if (this.root.features.includes(Features.description)) {
        if (description) {
          this.emit(new DescriptionEntry(description))
        }
      }

      if (this.root.features.includes(Features.keywords)) {
        if (keywords) {
          this.emit(new KeywordsEntry(keywords))
        }
      }
    }
  }

  parse (node = this.ast) {
    node.body.forEach((item) => {
      switch (item.type) {
        case Syntax.VariableDeclaration:
          item.declarations.forEach((declaration) => {
            this.declarations[declaration.id.name] = declaration.init
          })

          this.parseVariableDeclaration(item)
          break

        case Syntax.ExportNamedDeclaration:
        case Syntax.ExportDefaultDeclaration:
          this.parseComment(item)
          this.parseExportDefaultDeclaration(item.declaration)
          break

        case Syntax.ExpressionStatement:
          this.parseExpressionStatement(item)
          break
      }
    })
  }

  parseExpressionStatement (node) {
    switch (node.expression.type) {
      case Syntax.CallExpression:
        this.parseExportDefaultDeclaration(node.expression)
        break

      case Syntax.AssignmentExpression:
        this.parseAssignmentExpression(node.expression)
        break
    }
  }

  parseAssignmentExpression (node) {
    let enableParsing = false

    switch (node.left.object.name) {
      case 'module':
        if (node.left.property.name === 'exports') {
          enableParsing = true
        }
        break

      case 'exports':
        if (node.left.property.value === 'default') {
          enableParsing = true
        }
        break
    }

    if (enableParsing) {
      this.parseComment(node)
      this.parseExportDefaultDeclaration(node.right)
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
      case Syntax.ObjectExpression:
        node.properties
          .filter(({ key }) => Properties.hasOwnProperty(key.name))
          .forEach((property) => this.parseFeature(property))
        break

      case Syntax.CallExpression:
        if (node.arguments.length) {
          this.parseExportDefaultDeclaration(node.arguments[0])
        }
        break

      case Syntax.FunctionExpression:
      case Syntax.ArrowFunctionExpression:
        this.parseFunctionExpression(node)
        break

      case Syntax.Identifier: {
        const identifierNode = this.declarations[node.name]

        if (identifierNode) {
          this.parseIdentifier(identifierNode)
        }
        break
      }

      default:
        // Ignore statement
    }
  }

  parseFeature (property) {
    let parser = null

    switch (property.key.name) {
      case Properties.name:
        parser = new NameParser(this)
        break

      case Properties.data:
        parser = new DataParser(this)
        break

      case Properties.props:
        parser = new PropParser(this)
        break

      case Properties.computed:
        parser = new ComputedParser(this)
        break

      case Properties.methods:
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
