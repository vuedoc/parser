const { ScriptParser } = require('./ScriptParser')

// eslint-disable-next-line max-len
const { ClassComponentComputedParser } = require('./ClassComponentComputedParser')
const { ClassComponentMethodParser } = require('./ClassComponentMethodParser')
const { ClassComponentDataParser } = require('./ClassComponentDataParser')
const { EventParser } = require('./EventParser')

const { Syntax, Features, Properties } = require('../Enum')

class ClassComponentParser extends ScriptParser {
  constructor (root) {
    super(root, root.source, root)

    this.options = root.root.options
  }

  parse (node) {
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

        if (this.features.includes(Features.methods)) {
          this.parseMethod(node)
        }

        if (this.features.includes(Features.events)) {
          // parse events on methods and hooks
          new EventParser(this.root).parse(node.value)
        }
        break
    }
  }

  parseMemberExpression (node) {
    this.parseIdentifier({
      ...node,
      key: {
        name: this.getSource(node.key)
      }
    })
  }

  parseContructor ({ body }) {
    body.body.forEach((node) => {
      switch (node.expression.type) {
        case Syntax.CallExpression:
          if (this.features.includes(Features.events)) {
            new EventParser(this.root).parse(node.expression)
          }
          break

        case Syntax.AssignmentExpression:
          if (this.features.includes(Features.data)) {
            this.parseAssignmentExpression(node.expression)
          }
          break
      }
    })
  }

  parseMethod (node) {
    if (Properties.hasOwnProperty(node.key.name)) {
      // don't parse lifecycle hooks
      return
    }

    const options = {
      defaultVisibility: this.options.defaultMethodVisibility
    }

    new ClassComponentMethodParser(this.root, options).parse(node)
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
