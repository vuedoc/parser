const { AbstractParser } = require('./AbstractParser')
const { CommentParser } = require('./CommentParser')

const { Syntax } = require('../Enum')

class AbstractExpressionParser extends AbstractParser {
  parseEntryComment (entry, node, defaultVisibility = 'public') {
    const comment = this.root.findComment(node)

    if (comment) {
      const parsedComment = CommentParser.parse(comment.text, defaultVisibility)

      Object.assign(entry, parsedComment)
    } else {
      entry.visibility = defaultVisibility
    }

    return comment
  }

  parseObjectExpression (node) {
    switch (node.type) {
      case Syntax.SpreadElement:
        this.parse(node.argument)
        break
    }
  }

  parseBlockStatement (node) {
    if (!node.body) {
      return
    }

    for (const item of node.body) {
      switch (item.type) {
        case Syntax.VariableDeclaration:
          this.parseVariableDeclaration(item)
          break

        case Syntax.ExpressionStatement:
          this.parseExpressionStatement(item)
          break

        case Syntax.IfStatement:
          this.parseConsequentStatement(item.consequent)
          break

        case Syntax.ForStatement:
        case Syntax.ForInStatement:
        case Syntax.ForOfStatement:
        case Syntax.WhileStatement:
        case Syntax.DoWhileStatement:
          this.parseLoopStatement(item)
          break

        case Syntax.SwitchStatement:
          this.parseSwitchStatement(item)
          break

        case Syntax.TryStatement:
          this.parseTryStatement(item)
          break
      }
    }
  }

  /**
   * @param {IfStatement|SwitchCase} node
   */
  parseConsequentStatement (node) {
    switch (node.type) {
      case Syntax.BlockStatement:
        this.parseBlockStatement(node)
        break

      case Syntax.VariableDeclaration:
        this.parseVariableDeclaration(node)
        break

      case Syntax.ExpressionStatement:
        this.parseExpressionStatement(node)
        break
    }
  }

  /**
   * @param {ForStatement|ForInStatement|ForOfStatement|WhileStatement|DoWhileStatement} node
   */
  parseLoopStatement (node) {
    switch (node.body.type) {
      case Syntax.BlockStatement:
        this.parseBlockStatement(node.body)
        break
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
