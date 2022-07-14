import { AbstractExpressionParser } from './AbstractExpressionParser.js';

import { DataEntry } from '../entity/DataEntry.js';
import { Feature, Syntax, Tag, Type } from '../Enum.js';
import { JSDoc } from '../JSDoc.js';

import { KeywordsUtils } from '../utils/KeywordsUtils.js';
import { MethodParser } from './MethodParser.js';

export class DataParser extends AbstractExpressionParser {
  static mergeEntryKeywords(entry) {
    KeywordsUtils.parseCommonEntryTags(entry);
    KeywordsUtils.mergeEntryKeyword(entry, Tag.type);
    KeywordsUtils.mergeEntryKeyword(entry, Tag.initialValue);

    entry.type = JSDoc.parseType(entry.type);
  }

  parseObjectExpressionProperty(property) {
    this.parseData(property);
  }

  parseData(property) {
    const name = this.parseKey(property);
    const propertyValue = property?.value || property;
    const value = this.getValue(propertyValue);

    if (value.type === Type.function) {
      const { node = propertyValue, nodeComment = property } = this.nodes[name] || {};

      node.key = property.key;

      if (this.features.includes(Feature.methods)) {
        new MethodParser(this.root).parseMethodProperty(node, node, nodeComment, false);
      }
    } else {
      this.root.setScopeValue(name, propertyValue, value);
      this.parseDataValue({
        name,
        value,
        nodeTyping: propertyValue,
        nodeComment: property,
      });
    }
  }

  parseDataValue({ name, value, nodeTyping, nodeComment }) {
    const entry = new DataEntry(name, {
      type: this.getTSType(nodeTyping, value.kind),
      value: value.raw,
    });

    value.member = true;

    this.parseEntryComment(entry, nodeComment);
    DataParser.mergeEntryKeywords(entry);
    this.root.parseExposedEntry(entry);

    this.emit(entry);
  }

  parseCallExpression(node) {
    if (node.callee.name === 'expose' && node.arguments.length) {
      const exposedValue = this.getValue(node.arguments[0]);

      if (exposedValue.type === Type.object) {
        Object.keys(exposedValue.value).forEach((name) => this.parseDataValue({
          name,
          value: this.scope[name],
          nodeComment: this.nodes[name].nodeComment,
          nodeTyping: this.nodes[name].nodeTyping,
        }));
      }
    }
  }

  parseExpressionStatement(node) {
    if (node.expression.type === Syntax.CallExpression) {
      this.parseCallExpression(node.expression);
    }
  }

  parseFunctionExpression(node) {
    switch (node.type) {
      case Syntax.ObjectExpression:
        this.parseObjectExpression(node);
        break;

      case Syntax.TSAsExpression:
        this.parseFunctionExpression(node.expression);
        break;

      default:
        node.body.forEach((item) => {
          switch (item.type) {
            case Syntax.ReturnStatement:
              this.parseReturnStatement(item);
              break;

            case Syntax.ExpressionStatement:
              this.parseExpressionStatement(item);
              break;

            case Syntax.VariableDeclaration:
              this.parseVariableDeclaration(item);
              break;
          }
        });
        break;
    }
  }

  parseReturnStatement(node) {
    switch (node.argument.type) {
      case Syntax.ObjectExpression:
        this.parseObjectExpression(node.argument);
        break;
    }
  }
}
