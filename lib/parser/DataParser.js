import { AbstractExpressionParser } from './AbstractExpressionParser.js';

import { DataEntry } from '../entity/DataEntry.js';
import { Syntax, Tag } from '../Enum.js';
import { JSDoc } from '../JSDoc.js';

import { KeywordsUtils } from '../utils/KeywordsUtils.js';

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

  parseData(node) {
    const name = this.parseKey(node);
    const value = this.getValue(node.value);

    this.root.setScopeValue(name, node.value, value);
    this.parseDataValue({
      name,
      value,
      nodeTyping: node.value,
      nodeComment: node,
    });
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

            case Syntax.VariableDeclaration:
              this.parseVariableDeclaration(item);
              break;
          }
        });
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
