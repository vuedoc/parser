const { parse: RecastParser } = require('recast')

const { AbstractParser } = require('./AbstractParser')
const { SlotParser } = require('./SlotParser')
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

const { NameEntry } = require('../entity/NameEntry')
const { DescriptionEntry } = require('../entity/DescriptionEntry')
const { KeywordsEntry } = require('../entity/KeywordsEntry')
const { ClassComponentValue } = require('../entity/ClassComponentValue')

const { StringUtils } = require('../StringUtils')
const { Syntax, Properties, Features } = require('../Enum')

const EXCLUDED_KEYWORDS = [ 'name', 'slot', 'mixin' ]

class ScriptParser extends AbstractParser {
  /**
   * @param {Parser} parser - The Parser object
   */
  constructor (root, source) {
    super(root)

    this.source = source

    this.declarations = {}
    this.eventsEmmited = {}
    this.ignoredMothods = []
    this.callbacks = {}

    for (const feature in Features) {
      this.callbacks[feature] = {}
    }
  }

  registerFeatureCallback(feature, entryName, callback) {
    if (!this.callbacks[feature][entryName]) {
      this.callbacks[feature][entryName] = []
    }

    this.callbacks[feature][entryName].push(callback)
  }

  callFeatureCallback(feature, entryName, context) {
    if (this.callbacks[feature][entryName]) {
      this.callbacks[feature][entryName].forEach((callback) => {
        callback(context)
      })
    }
  }

  parse () {
    let node = null

    try {
      const ast = RecastParser(this.source, {
        parser: require('recast/parsers/typescript'),

      })

      node = ast.program
    } catch (error) {
      this.emitter.emit('error', error)
    }

    if (node) {
      this.parseAst(node)
    }
  }

  /* eslint-disable class-methods-use-this */
  getFunctionExpressionValue (node) {
    return node
  }

  findComment ({ leadingComments = [] }) {
    const leadingComment = leadingComments.reverse()[0]

    return leadingComment ? leadingComment.value : null
  }

  hasExplicitMixinKeyword (node) {
    const comment = this.findComment(node)

    if (comment) {
      const { keywords } = CommentParser.parse(comment)

      return keywords.some(({ name }) => name === 'mixin')
    }

    return false
  }

  parseCommentNode (node) {
    const comment = this.findComment(node)

    if (comment) {
      const { description, keywords } = CommentParser.parse(comment)

      this.parseComment(description, keywords)
    }
  }

  parseComment (description, keywords) {
    if (this.root.features.includes(Features.description)) {
      if (description) {
        this.emit(new DescriptionEntry(description))
      }
    }

    if (this.root.features.includes(Features.name)) {
      if (keywords.length) {
        const nameKeywords = ScriptParser.extractKeywords(keywords, 'name', true)
        const nameKeyword = nameKeywords.pop()

        if (nameKeyword && nameKeyword.description) {
          this.emit(new NameEntry(nameKeyword.description))
        }
      }
    }

    if (keywords.length) {
      if (this.root.features.includes(Features.slots)) {
        SlotParser.extractSlotKeywords(keywords).forEach((slot) => this.emit(slot))
      }

      if (this.root.features.includes(Features.keywords)) {
        keywords = keywords.filter(({ name }) => !EXCLUDED_KEYWORDS.includes(name))

        this.emit(new KeywordsEntry(keywords))
      }
    }
  }

  parseComponent (node, declaration) {
    this.parseExportDefaultDeclaration(declaration)
    this.parseCommentNode(node)
  }

  parseAst (node) {
    node.body.forEach((item) => this.parseAstItem(item))
  }

  parseAstItem (item) {
    switch (item.type) {
      case Syntax.VariableDeclaration:
        this.parseVariableDeclaration(item)
        break

      case Syntax.ExportNamedDeclaration:
        if (this.hasExplicitMixinKeyword(item)) {
          this.parseExplicitMixinDeclaration(item)
        } else {
          this.parseAstItem(item.declaration)
        }
        break

      case Syntax.ExportDefaultDeclaration:
        if (this.hasExplicitMixinKeyword(item)) {
          this.parseExplicitMixinDeclaration(item)
        } else {
          this.parseComponent(item, item.declaration)
        }
        break

      case Syntax.ExpressionStatement:
        this.parseExpressionStatement(item)
        break
    }
  }

  parseExplicitMixinDeclaration (node) {
    switch (node.declaration.type) {
      case Syntax.VariableDeclaration:
        node.declaration.declarations
          .slice(0, 1)
          .forEach((declaration) => this.parseComponent(node, declaration.init))
        break

      case Syntax.ObjectExpression:
        this.parseComponent(node, node.declaration)
        break

      case Syntax.FunctionDeclaration:
      case Syntax.ArrowFunctionExpression:
        this.parseExplicitMixinDeclarationFunction(node.declaration.body)
        break
    }
  }

  parseExplicitMixinDeclarationFunction (node) {
    switch (node.type) {
      case Syntax.BlockStatement:
        node.body.forEach((item) => {
          switch (item.type) {
            case Syntax.VariableDeclaration:
              this.parseVariableDeclaration(item)
              break

            case Syntax.ReturnStatement:
              this.parseExportDefaultDeclaration(item.argument)
              break
          }
        })
        break

      case Syntax.Identifier:
        this.parseIdentifier(node)
        break
    }
  }

  parseVariableDeclaration (node) {
    node.declarations.forEach((declaration) => {
      this.declarations[declaration.id.name] = declaration.init
    })

    super.parseVariableDeclaration(node)
  }

  parseExpressionStatement (node) {
    switch (node.expression.type) {
      case Syntax.CallExpression:
        switch (node.expression.callee.type) {
          case Syntax.Identifier:
            if (node.expression.callee.name === '__decorate') {
              const [ decorators, , name ] = node.expression.arguments

              this.parseExpressionDecorators(decorators, name)
            }
            break

          default:
            this.parseExportDefaultDeclaration(node.expression)
        }
        break

      case Syntax.AssignmentExpression:
        this.parseAssignmentExpression(node.expression)
        break
    }
  }

  parseExpressionDecorators (node, name) {
    switch (node.type) {
      case Syntax.ArrayExpression:
        node.elements
          .filter(({ type }) => type === Syntax.CallExpression)
          .forEach((item) => this.parseDecorator(item, name))
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
    switch (node.right.type) {
      case Syntax.CallExpression:
        if (node.right.callee.name === '__decorate') {
          const [ decorators, classIdentifier ] = node.right.arguments;
          const className = classIdentifier.name
          const { value } = this.scope[className]

          this.declarations[className] = new ClassComponentValue(decorators, value)
        }
        break

      case Syntax.Literal:
        this.declarations[node.left.name] = node.right
        break
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
    switch (node.type) {
      case Syntax.ClassMethod:
      case Syntax.ObjectMethod:
      case Syntax.ClassPrivateMethod:
      case Syntax.FunctionExpression:
      case Syntax.ArrowFunctionExpression:
        this.parseExportDefaultDeclaration(node.body)
        break

      case Syntax.BlockStatement:
        this.parseExplicitMixinDeclarationFunction(node)
        break
    }
  }

  parseIdentifier (node) {
    this.parseExportDefaultDeclaration(node)
  }

  parseObjectExpression (node) {
    node.properties
      .filter(({ key }) => Properties.hasOwnProperty(key.name))
      .forEach((property) => this.parseFeature(property, node.properties))
  }

  parseExportDefaultDeclaration (node) {
    switch (node.type) {
      case Syntax.ObjectExpression:
        this.parseObjectExpression(node)
        break

      case Syntax.CallExpression:
        if (node.arguments.length) {
          this.parseExportDefaultDeclaration(node.arguments[0])
        }
        break

      case Syntax.ClassMethod:
      case Syntax.ObjectMethod:
      case Syntax.ClassPrivateMethod:
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

  parseDecorator (node, nameNode = {}) {
    switch (node.type) {
      case Syntax.CallExpression: {
        switch (node.callee.name) {
          case 'Component':
            if (node.arguments.length) {
              this.parseExportDefaultDeclaration(node.arguments[0])
            }
            break

          case 'Prop':
            if (node.arguments.length) {
              this.parsePropDecorator(nameNode, node.arguments[0])
            }
            break

          case 'PropSync':
            if (node.arguments.length) {
              this.parsePropSyncDecorator(node, nameNode)
            }
            break

          case 'Model':
            if (node.arguments.length) {
              this.parseModelDecorator(node, nameNode)
            }
            break

          case 'Emit':
            this.parseEmitDecorator(node, nameNode)
            break

          case 'Watch':
            this.parseWatchDecorator(node, nameNode)
            break
        }
        break
      }
    }
  }

  parsePropDecorator(name, prop) {
    if (!this.root.features.includes(Features.props)) {
      return
    }

    new PropParser(this).parse({
      type: Syntax.ObjectExpression,
      properties: [
        {
          type: Syntax.Property,
          computed: false,
          kind: 'init',
          loc: prop.loc,
          start: prop.start,
          end: prop.end,
          key: name,
          value: prop
        }
      ]
    })
  }

  parseModelDecorator(node, literalPropNode) {
    const [ literalEventNode, propNode ] = node.arguments

    if (this.root.features.includes(Features.model)) {
      new ModelParser(this).parse({
        type: Syntax.ObjectExpression,
        loc: node.loc,
        start: node.start,
        end: node.end,
        properties: [
          {
            type: Syntax.Property,
            computed: false,
            kind: 'init',
            key: {
              type: Syntax.Literal,
              name: 'prop'
            },
            value: literalPropNode
          },
          {
            type: Syntax.Property,
            computed: false,
            kind: 'init',
            key: {
              type: Syntax.Literal,
              name: 'event'
            },
            value: literalEventNode
          }
        ]
      })
    }

    this.parsePropDecorator(literalPropNode, propNode)
  }

  parsePropSyncDecorator(node, literalComputedNode) {
    const [ literalPropNode, propNode ] = node.arguments
    const propName = literalPropNode.value

    this.parsePropDecorator(literalPropNode, propNode)

    if (this.root.features.includes(Features.computed)) {
      new ComputedParser(this).parseEntryNode(node, literalComputedNode.value, [
        propName
      ])
    }

    if (this.root.features.includes(Features.events)) {
      new EventParser(this).parseEntryNode(node, `update:${propName}`, [
        propName
      ])
    }
  }

  parseEmitDecorator(node, methodNameLiteralNode) {
    this.ignoredMothods.push(methodNameLiteralNode.value)

    if (this.root.features.includes(Features.events)) {
      const methodName = methodNameLiteralNode.value

      this.registerFeatureCallback(Features.methods, methodName, (context) => {
        const [ explicitEventNameLiteralNode ] = node.arguments

        const eventCamelName = explicitEventNameLiteralNode
          ? explicitEventNameLiteralNode.value
          : methodName

        const eventName = StringUtils.toKebabCase(eventCamelName)
        const parser = new EventParser(this)

        const args = context.node.value.params
          .map((arg) => parser.getArgument(arg))

        parser.parseEntryNode(node, eventName, args)
      })
    }
  }

  parseWatchDecorator(node, literalWatchNode) {
    this.ignoredMothods.push(literalWatchNode.value)
  }

  parseClassComponent ({ value }) {
    const { decorators, baseClassNode } = value

    this.parseBaseClassComponent(baseClassNode)
    decorators.elements.forEach((node) => this.parseDecorator(node))
  }

  parseFeature (property, properties) {
    switch (property.key.name) {
      case Properties.name:
        if (this.features.includes(Features.name)) {
          new NameParser(this).parse(property)
        }
        break

      case Properties.inheritAttrs:
        new InheritAttrsParser(this).parse(property)
        break

      case Properties.model:
        if (!this.root.model) {
          // Make sure to load the model feature once
          new ModelParser(this).parse(property)
        }
        break

      case Properties.data:
        if (this.features.includes(Features.data)) {
          new DataParser(this).parse(property)
        }
        break

      case Properties.props:
        if (this.features.includes(Features.props)) {
          if (!this.root.model) {
            // Make sure to load the model feature before
            const modelProperty = properties.find(({ key }) => key.name === Properties.model)

            if (modelProperty) {
              this.parseFeature(modelProperty)
            }
          }

          new PropParser(this).parse(property)
        }
        break

      case Properties.computed:
        if (this.features.includes(Features.computed)) {
          new ComputedParser(this).parse(property)
        }
        break

      case Properties.template:
        new InlineTemplateParser(this).parse(property)
        break

      case Properties.methods:
        new MethodParser(this, {
          defaultVisibility: this.root.options.defaultMethodVisibility
        }).parse(property)
        break

      default:
        if (this.features.includes(Features.events)) {
          new EventParser(this).parse(property)
        }
        break
    }
  }
}

module.exports.ScriptParser = ScriptParser
