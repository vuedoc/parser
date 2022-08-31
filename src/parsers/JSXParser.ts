import { AbstractExpressionParser } from './AbstractExpressionParser.js';
import { MarkupTemplateParser } from './MarkupTemplateParser.js';
import { Syntax } from '../lib/Enum.js';

import * as Babel from '@babel/types';

export class JSXParser extends AbstractExpressionParser {
  parse(node) {
    switch (node.type) {
      case Syntax.ObjectProperty:
        this.parseObjectProperty(node.value);
        break;

      case Syntax.ObjectMethod:
        this.parseBlockStatement(node.body);
        break;
    }
  }

  parseObjectProperty(node) {
    switch (node.type) {
      case Syntax.FunctionExpression:
        this.parseFunctionExpression(node);
        break;

      case Syntax.ArrowFunctionExpression:
        this.parseArrowFunctionExpression(node);
        break;
    }
  }

  parseFunctionExpression(node: Babel.FunctionExpression) {
    switch (node.body.type) {
      case Syntax.BlockStatement:
        this.parseBlockStatement(node.body);
        break;
    }
  }

  parseArrowFunctionExpression(node: Babel.ArrowFunctionExpression) {
    switch (node.body.type) {
      case Syntax.JSXElement:
        this.parseJSXElement(node.body);
        break;

      case Syntax.BlockStatement:
        this.parseBlockStatement(node.body);
        break;
    }
  }

  parseBlockStatementItem(item) {
    switch (item.type) {
      case Syntax.ReturnStatement:
        this.parseReturnStatement(item);
        break;
    }
  }

  parseReturnStatement(node: Babel.ReturnStatement) {
    switch (node.argument?.type) {
      case Syntax.JSXElement:
        this.parseJSXElement(node.argument);
        break;
    }
  }

  parseJSXElement(node) {
    const template = this.getSourceString(node);
    const parser = new MarkupTemplateParser(this.emitter, {
      attrs: {
        lang: 'html',
      },
      content: template,
    });

    parser.parse();
  }
}
