const { Parser: AcornParser } = require('acorn')
const AcornStage3 = require('acorn-stage3')

const { AbstractParser } = require('./AbstractParser')
const { AbstractSlotParser } = require('./AbstractSlotParser')
const { NameParser } = require('./NameParser')
const { ModelParser } = require('./ModelParser')
const { PropParser } = require('./PropParser')
const { DataParser } = require('./DataParser')
const { ComputedParser } = require('./ComputedParser')
const { MethodParser } = require('./MethodParser')
const { EventParser } = require('./EventParser')
const { CommentParser } = require('./CommentParser')
const { InheritAttrsParser } = require('./InheritAttrsParser')
const { InlineTemplateParser } = require('./InlineTemplateParser')

const { Comment } = require('../entity/Comment')
const { DescriptionEntry } = require('../entity/DescriptionEntry')
const { KeywordsEntry } = require('../entity/KeywordsEntry')
const { ClassComponentValue } = require('../entity/ClassComponentValue')

const { Syntax, Properties, Features } = require('../Enum')

const acorn = AcornParser.extend(AcornStage3)

class ScriptParser extends AbstractParser {
  /**
   * @param {Parser} parser - The Parser object
   */
  constructor (root, source, { comments = [], tokens = [] } = {}) {
    super(root)

    this.comments = comments
    this.tokens = tokens
    this.declarations = {}
    this.eventsEmmited = {}

    this.source = source
  }

  parse () {
    const locations = true
    const onComment = (block, text, start, end, loc) => {
      this.comments.push(new Comment(block, text, start, end, loc))
    }

    const onToken = (token) => this.tokens.push(token)
    const options = { ...this.root.options, locations, onComment, onToken }

    const node = acorn.parse(this.source, options)

    this.parseAst(node)
  }

  getTokenNode (token) {
    const locations = true
    const options = { ...this.root.options, locations }

    return acorn.parseExpressionAt(this.source, token.start, options)
  }

  findTokenIndex (node) {
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
          AbstractSlotParser.extractSlotKeywords(keywords)
            .forEach((slot) => this.emit(slot))

          this.emit(new KeywordsEntry(keywords))
        }
      }
    }
  }

  parseComponent (node, declaration) {
    this.parseComment(node)
    this.parseExportDefaultDeclaration(declaration)
  }

  parseAst (node) {
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
          this.parseComponent(item, item.declaration)
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

  parseAssignmentMemberExpression (node) {
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
      this.parseComponent(node, node.right)
    }
  }

  parseAssignmentIdentifier (node) {
    if (node.right.callee.name === '__decorate') {
      const [ decorators, classIdentifier ] = node.right.arguments;
      const className = classIdentifier.name
      const { value } = this.scope[className]

      this.declarations[className] = new ClassComponentValue(decorators, value)
    }
  }

  parseAssignmentExpression (node) {
    switch (node.left.type) {
      case Syntax.MemberExpression:
        this.parseAssignmentMemberExpression(node)
        break

      case Syntax.Identifier:
        this.parseAssignmentIdentifier(node)
        break

      case Syntax.ExpressionStatement:
        this.parseAssignmentExpression(node.expression)
        break

      default:
        super.parseAssignmentExpression(node)
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
          if (identifierNode instanceof ClassComponentValue) {
            this.parseClassComponent(identifierNode)
          } else {
            this.parseIdentifier(identifierNode)
          }
        }
        break
      }

      case Syntax.NewExpression:
        if (node.callee.name === 'Vue') {
          // Vue Instance
          if (node.arguments.length) {
            this.parseExportDefaultDeclaration(node.arguments[0])
          }
        }
        break

      default:
        // Ignore statement
    }
  }

  parseBaseClassComponent (node) {
    // eslint-disable-next-line global-require
    const { ClassComponentParser } = require('./ClassComponentParser')

    new ClassComponentParser(this).parse(node)
  }

  parseDecorator (node) {
    switch (node.type) {
      case Syntax.CallExpression:
        if (node.callee.name === 'Component') {
          for (const argument of node.arguments) {
            this.parseExportDefaultDeclaration(argument)
            break
          }
        }
        break
    }
  }

  parseClassComponent ({ value }) {
    const { decorators, baseClassNode } = value

    this.parseBaseClassComponent(baseClassNode)
    decorators.elements.forEach((node) => this.parseDecorator(node))
  }

  parseFeature (property) {
    let parser = null

    switch (property.key.name) {
      case Properties.name:
        parser = new NameParser(this)
        break

      case Properties.inheritAttrs:
        parser = new InheritAttrsParser(this)
        break

      case Properties.model:
        parser = new ModelParser(this)
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

      case Properties.template:
        parser = new InlineTemplateParser(this)
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
