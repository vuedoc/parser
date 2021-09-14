const { AbstractExpressionParser } = require('./AbstractExpressionParser');

const { DataEntry } = require('../entity/DataEntry');
const { Syntax, Tag } = require('../Enum');
const { JSDoc } = require('../JSDoc');

const { KeywordsUtils } = require('../utils/KeywordsUtils');

class DataParser extends AbstractExpressionParser {
  static mergeEntryKeywords (entry) {
    KeywordsUtils.parseCommonEntryTags(entry);
    KeywordsUtils.mergeEntryKeyword(entry, Tag.type);
    KeywordsUtils.mergeEntryKeyword(entry, Tag.initialValue);

    entry.type = JSDoc.parseType(entry.type);
  }

  parseObjectExpressionProperty (property) {
    this.parseData(property);
  }

  parseData (node) {
    const name = this.parseKey(node);
    const ref = this.getValue(node.value);
    const entry = new DataEntry(name, {
      type: this.getTSType(node.value, ref.kind),
      value: ref.raw
    });

    ref.member = true;

    this.root.setScopeValue(entry.name, node.value, ref);
    this.parseEntryComment(entry, node);
    DataParser.mergeEntryKeywords(entry);
    this.emit(entry);
  }

  parseFunctionExpression (node) {
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

  parseReturnStatement (node) {
    switch (node.argument.type) {
      case Syntax.ObjectExpression:
        this.parseObjectExpression(node.argument);
        break;
    }
  }
}

module.exports.DataParser = DataParser;
