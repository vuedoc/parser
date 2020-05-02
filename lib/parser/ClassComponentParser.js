const { ScriptParser } = require('./ScriptParser')

// eslint-disable-next-line max-len
const { ClassComponentComputedParser } = require('./ClassComponentComputedParser')
const { ClassComponentMethodParser } = require('./ClassComponentMethodParser')
const { ClassComponentDataParser } = require('./ClassComponentDataParser')

const { DataParser } = require('./DataParser')
const { EventParser } = require('./EventParser')

const { NameEntry } = require('../entity/NameEntry')

const { Syntax, Features, Properties } = require('../Enum')

class ClassComponentParser extends ScriptParser {
  constructor (root) {
    super(root, root.source, root)

    this.options = root.root.options
  }

  parse (node) {
    this.parseName(node)
    this.parseComment(node)

    node.body.body.forEach((node) => {
      switch (node.key.type) {
        case Syntax.Identifier:
          this.parseIdentifier(node)
          break

        case Syntax.MemberExpression:
          this.parseMemberExpression(node)
          break
      }
    })
  }

  parseName ({ id }) {
    if (!this.features.includes(Features.name)) {
      return
    }

    const entry = new NameEntry(id.name)

    this.emit(entry)
  }

  parseIdentifier (node) {
    switch (node.kind) {
      case 'constructor':
        this.parseContructor(node.value)
        break

      case 'get':
        if (this.features.includes(Features.computed)) {
          new ClassComponentComputedParser(this.root).parse(node)
        }
        break

      case 'method':
        if (node.static === true) {
          // ignore static methods
          break
        }

        this.parseMethod(node)
        break
    }
  }

  parseMethod (node) {
    if (this.features.includes(Features.methods)) {
      // don't parse lifecycle hooks as methods
      if (!Properties.hasOwnProperty(node.key.name)) {
        const methodName = node.key.name

        this.root.callFeatureCallback(Features.methods, methodName, { node })

        if (!this.root.ignoredMothods.includes(methodName)) {
          const options = {
            defaultVisibility: this.options.defaultMethodVisibility
          }

          new ClassComponentMethodParser(this.root, options).parse(node)
        }
      }
    }

    if (node.key.name === Features.data) {
      if (this.features.includes(Features.computed)) {
        new DataParser(this.root).parse(node.value)
      }
    }

    if (this.features.includes(Features.events)) {
      // parse events on methods and hooks
      new EventParser(this.root).parse(node.value)
    }
  }

  toIdentifierNode(node) {
    return {
      ...node,
      key: {
        type: Syntax.Identifier,
        name: this.getSource(node.key)
      }
    }
  }

  parseMemberExpression (node) {
    this.parseIdentifier(this.toIdentifierNode(node))
  }

  parseContructor ({ body }) {
    body.body.forEach((node) => {
      switch (node.expression.type) {
        case Syntax.CallExpression:
          new EventParser(this.root).parse(node.expression)
          break

        case Syntax.AssignmentExpression:
          if (this.features.includes(Features.data)) {
            this.parseAssignmentExpression(node.expression)
          }
          break
      }
    })
  }

  parseAssignmentExpression (node) {
    switch (node.left.type) {
      case Syntax.MemberExpression:
        this.parseAssignmentMemberExpression(node)
        break

      default:
        super.parseAssignmentExpression(node)
    }
  }

  parseAssignmentMemberExpression (node) {
    switch (node.left.object.type) {
      case Syntax.ThisExpression:
        new ClassComponentDataParser(this.root).parse(node)
        break

      default:
        super.parseAssignmentMemberExpression(node)
    }
  }
}

module.exports.ClassComponentParser = ClassComponentParser
