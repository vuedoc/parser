const { AbstractParser } = require('./AbstractParser');
const { CommentParser } = require('./CommentParser');
const { Syntax, Visibility } = require('../Enum');

class AbstractExpressionParser extends AbstractParser {
  getSourceString (node) {
    const source = super.getSourceString(node);

    switch (node.type) {
      case Syntax.MemberExpression:
        if (node.object.type === Syntax.Identifier) {
          if (node.object.name === 'Symbol') {
            return `[${source}]`;
          }
        }
        break;
    }

    return source;
  }

  parse (node) {
    switch (node.type) {
      case Syntax.BlockStatement:
        this.parseBlockStatement(node);
        break;

      default:
        super.parse(node);
    }
  }

  parseEntryComment (entry, node, defaultVisibility = Visibility.public) {
    const comment = this.root.findComment(node);

    if (comment) {
      const parsedComment = CommentParser.parse(comment, defaultVisibility);

      Object.assign(entry, parsedComment);
    } else {
      entry.visibility = defaultVisibility;
    }

    if (!entry.description) {
      delete entry.description;
    }

    return comment;
  }

  parseSpreadElement (node) {
    this.parse(node.argument);
  }

  parseObjectExpression (node) {
    node.properties.forEach((property) => {
      switch (property.type) {
        case Syntax.SpreadElement:
          this.parseSpreadElement(property);
          break;

        default:
          this.parseObjectExpressionProperty(property);
      }
    });
  }

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseObjectExpressionProperty (node) {}

  parseBlockStatement (node) {
    for (const item of node.body) {
      this.parseBlockStatementItem(item);
    }
  }

  parseBlockStatementItem (item) {
    switch (item.type) {
      case Syntax.VariableDeclaration:
        this.parseVariableDeclaration(item);
        break;

      case Syntax.ExpressionStatement:
        this.parseExpressionStatement(item);
        break;

      case Syntax.IfStatement:
        this.parseConsequentStatement(item.consequent);
        break;

      case Syntax.ForStatement:
      case Syntax.ForInStatement:
      case Syntax.ForOfStatement:
      case Syntax.WhileStatement:
      case Syntax.DoWhileStatement:
        this.parseLoopStatement(item);
        break;

      case Syntax.SwitchStatement:
        this.parseSwitchStatement(item);
        break;

      case Syntax.TryStatement:
        this.parseTryStatement(item);
        break;
    }
  }

  /**
   * @param {IfStatement|SwitchCase} node
   */
  parseConsequentStatement (node) {
    switch (node.type) {
      case Syntax.BlockStatement:
        this.parseBlockStatement(node);
        break;

      case Syntax.ExpressionStatement:
        this.parseExpressionStatement(node);
        break;
    }
  }

  /**
   * @param {ForStatement|ForInStatement|ForOfStatement|WhileStatement|DoWhileStatement} node
   */
  parseLoopStatement (node) {
    switch (node.body.type) {
      case Syntax.BlockStatement:
        this.parseBlockStatement(node.body);
        break;
    }
  }

  /**
   * @param {SwitchStatement} node
   */
  parseSwitchStatement (node) {
    for (const item of node.cases) {
      for (const consequent of item.consequent) {
        this.parseConsequentStatement(consequent);
      }
    }
  }

  /**
   * @param {TryStatement} node
   */
  parseTryStatement (node) {
    this.parseBlockStatement(node.block);

    if (node.handler) {
      this.parseBlockStatement(node.handler.body);
    }

    if (node.finalizer) {
      this.parseBlockStatement(node.finalizer);
    }
  }

  /**
   * @param {FunctionExpression} node
   */
  parseFunctionExpression (node) {
    switch (node.type) {
      case Syntax.BlockStatement:
        this.parseBlockStatement(node);
        break;
    }
  }
}

module.exports.AbstractExpressionParser = AbstractExpressionParser;
