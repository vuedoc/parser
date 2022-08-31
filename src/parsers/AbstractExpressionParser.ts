import { ScriptParser } from './ScriptParser.js';
import { AbstractParser } from './AbstractParser.js';
import { CommentParser } from './CommentParser.js';
import { Syntax, Visibility } from '../lib/Enum.js';
import { Entry } from '../../types/Entry.js';
import { Parser } from '../../types/Parser.js';

import * as Babel from '@babel/types';

export class AbstractExpressionParser<
  Root extends ScriptParser<any, any> = ScriptParser<any, any>
> extends AbstractParser<Parser.Script, Root> {
  getSourceString(node) {
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

  getRawValue(key: string, defaultValue: any) {
    const ref = this.getScopeValue(key);

    return ref?.composition && 'returningValue' in ref.composition
      ? ref.composition.returningValue
      : defaultValue;
  }

  parse(node) {
    switch (node.type) {
      case Syntax.BlockStatement:
        this.parseBlockStatement(node);
        break;

      default:
        super.parse(node);
        break;
    }
  }

  parseEntryComment(entry: Entry.TypeKeywords, node, defaultVisibility = Visibility.public) {
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

  parseSpreadElement(node: Babel.SpreadElement) {
    this.parse(node.argument);
  }

  parseObjectExpression(node: Babel.ObjectExpression) {
    node.properties.forEach((property) => {
      switch (property.type) {
        case Syntax.SpreadElement:
          this.parseSpreadElement(property);
          break;

        default:
          this.parseObjectExpressionProperty(property);
          break;
      }
    });
  }

  /* istanbul ignore next */
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseObjectExpressionProperty(_node: Babel.ObjectProperty | Babel.ObjectMethod) {}

  parseBlockStatement(node: Babel.BlockStatement) {
    for (const item of node.body) {
      this.parseBlockStatementItem(item);
    }
  }

  parseBlockStatementItem(item: Babel.Statement) {
    switch (item.type) {
      case Syntax.VariableDeclaration:
        this.parseVariableDeclaration(item as any);
        break;

      case Syntax.ExpressionStatement:
        this.parseExpressionStatement(item);
        break;

      case Syntax.IfStatement:
        this.parseConsequentStatement(item.consequent);

        if (item.alternate) {
          this.parseAlternameStatement(item.alternate);
        }
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

  parseConsequentStatement(node: Babel.Statement) {
    switch (node.type) {
      case Syntax.BlockStatement:
        this.parseBlockStatement(node);
        break;

      case Syntax.ExpressionStatement:
        this.parseExpressionStatement(node);
        break;
    }
  }

  parseAlternameStatement(node: Babel.Statement) {
    this.parseConsequentStatement(node);
  }

  parseLoopStatement(node: Babel.Loop) {
    switch (node.body.type) {
      case Syntax.BlockStatement:
        this.parseBlockStatement(node.body);
        break;
    }
  }

  parseSwitchStatement(node: Babel.SwitchStatement) {
    for (const caseNode of node.cases) {
      for (const consequent of caseNode.consequent) {
        if ('test' in consequent) {
          this.parseConsequentStatement(consequent);
        } else {
          this.parseAlternameStatement(consequent);
        }
      }
    }
  }

  parseTryStatement(node: Babel.TryStatement) {
    this.parseBlockStatement(node.block);

    if (node.handler) {
      this.parseBlockStatement(node.handler.body);
    }

    if (node.finalizer) {
      this.parseBlockStatement(node.finalizer);
    }
  }

  parseFunctionExpression(node) {
    switch (node.type) {
      case Syntax.BlockStatement:
        this.parseBlockStatement(node);
        break;
    }
  }
}
