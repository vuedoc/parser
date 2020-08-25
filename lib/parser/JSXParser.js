const { AbstractExpressionParser } = require('./AbstractExpressionParser');
const { MarkupTemplateParser } = require('./MarkupTemplateParser');
const { Syntax } = require('../Enum');

class JSXParser extends AbstractExpressionParser {
  parse (node) {
    switch (node.type) {
      case Syntax.ObjectProperty:
        this.parseObjectProperty(node.value);
        break;

      case Syntax.ObjectMethod:
        this.parseBlockStatement(node.body);
        break;
    }
  }

  parseObjectProperty (node) {
    switch (node.type) {
      case Syntax.FunctionExpression:
        this.parseFunctionExpression(node);
        break;

      case Syntax.ArrowFunctionExpression:
        this.parseArrowFunctionExpression(node);
        break;
    }
  }

  parseFunctionExpression (node) {
    switch (node.body.type) {
      case Syntax.BlockStatement:
        this.parseBlockStatement(node.body);
        break;
    }
  }

  parseArrowFunctionExpression (node) {
    switch (node.body.type) {
      case Syntax.JSXElement:
        this.parseJSXElement(node.body);
        break;

      case Syntax.BlockStatement:
        this.parseBlockStatement(node.body);
        break;
    }
  }

  parseBlockStatementItem (item) {
    switch (item.type) {
      case Syntax.ReturnStatement:
        this.parseReturnStatement(item);
        break;
    }
  }

  parseReturnStatement (node) {
    switch (node.argument.type) {
      case Syntax.JSXElement:
        this.parseJSXElement(node.argument);
        break;
    }
  }

  parseJSXElement (node) {
    const template = this.getSourceString(node);
    const parser = new MarkupTemplateParser(this.root, template);

    parser.parse();
  }
}

module.exports.JSXParser = JSXParser;
