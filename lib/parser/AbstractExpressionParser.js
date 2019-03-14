const { AbstractParser } = require('./AbstractParser')
const { CommentParser } = require('./CommentParser')

const {
  VariableDeclaration,
  ExpressionStatement,
  IfStatement,
  ForStatement,
  ForInStatement,
  ForOfStatement,
  WhileStatement,
  DoWhileStatement,
  SwitchStatement,
  TryStatement,
  BlockStatement,
  BreakStatement,
  ContinueStatement,
  LabeledStatement,
  SpreadElement
} = require('../Enum')

class AbstractExpressionParser extends AbstractParser {
  parseEntryComment (entry, node, defaultVisibility = 'public') {
    const comment = this.root.findComment(node)

    if (comment) {
      const parsedComment = CommentParser.parse(comment.text, defaultVisibility)

      Object.assign(entry, parsedComment)
    } else {
      entry.visibility = defaultVisibility
    }
  }

  parseObjectExpression (node) {
    switch (node.type) {
      case SpreadElement:
        this.parse(node.argument)
        break

      default:
        throw new Error(`Unknow ObjectExpression node: ${node.type}`)
    }
  }

  parseBlockStatement (node) {
    for (const item of node.body) {
      switch (item.type) {
        case VariableDeclaration:
          this.parseVariableDeclaration(item)
          break

        case ExpressionStatement:
          this.parseExpressionStatement(item)
          break

        case IfStatement:
          this.parseConsequentStatement(item.consequent)
          break

        case ForStatement:
        case ForInStatement:
        case ForOfStatement:
        case WhileStatement:
        case DoWhileStatement:
          this.parseLoopStatement(item)
          break

        case SwitchStatement:
          this.parseSwitchStatement(item)
          break

        case TryStatement:
          this.parseTryStatement(item)
          break

        default:
          throw new Error(`Unknow FunctionExpression node: ${item.type}`)
      }
    }
  }

  /**
   * @param {IfStatement|SwitchCase} node
   */
  parseConsequentStatement (node) {
    switch (node.type) {
      case BlockStatement:
        this.parseBlockStatement(node)
        break

      case VariableDeclaration:
        this.parseVariableDeclaration(node)
        break

      case ExpressionStatement:
        this.parseExpressionStatement(node)
        break

      case BreakStatement:
      case ContinueStatement:
      case LabeledStatement:
        break

      default:
        throw new Error(`Unknow ConsequentStatement node: ${node.type}`)
    }
  }

  /**
   * @param {ForStatement|ForInStatement|ForOfStatement|WhileStatement|DoWhileStatement} node
   */
  parseLoopStatement (node) {
    switch (node.body.type) {
      case BlockStatement:
        this.parseBlockStatement(node.body)
        break

      default:
        throw new Error(`Unknow LoopStatement node: ${node.type}`)
    }
  }

  /**
   * @param {SwitchStatement} node
   */
  parseSwitchStatement (node) {
    for (const item of node.cases) {
      for (const consequent of item.consequent) {
        this.parseConsequentStatement(consequent)
      }
    }
  }

  /**
   * @param {TryStatement} node
   */
  parseTryStatement (node) {
    this.parseBlockStatement(node.block)

    if (node.handler) {
      this.parseBlockStatement(node.handler.body)
    }

    if (node.finalizer) {
      this.parseBlockStatement(node.finalizer)
    }
  }

  /**
   * @param {FunctionExpression} node
   */
  parseFunctionExpression (node) {
    this.parseBlockStatement(node)
  }
}

module.exports.AbstractExpressionParser = AbstractExpressionParser
