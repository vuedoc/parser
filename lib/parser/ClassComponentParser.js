const { ScriptParser } = require('./ScriptParser')
const { ClassComponentDataParser } = require('./ClassComponentDataParser')
const { EventParser } = require('./EventParser')

const { Syntax, Features } = require('../Enum')

class ClassComponentParser extends ScriptParser {
  constructor (root) {
    super(root, root.source, root)
  }

  parse ({ body }) {
    body.body.forEach((node) => {
      switch (node.key.type) {
        case Syntax.Identifier:
          this.parseIdentifier(node)
          break

        default:
          throw new Error('Not Yet Implemented')
      }
    })
  }

  parseIdentifier (node) {
    switch (node.kind) {
      case 'constructor':
        this.parseContructor(node.value)
        break
    }
  }

  parseContructor ({ body }) {
    body.body.forEach((node) => {
      switch (node.expression.type) {
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
