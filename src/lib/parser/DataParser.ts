import { AbstractExpressionParser } from './AbstractExpressionParser.js';

import { DataEntry } from '../entity/DataEntry.js';
import { CompositionAPIComputedValues, Feature, Syntax, Tag, Type } from '../Enum.js';
import { JSDoc } from '../JSDoc.js';

import { KeywordsUtils } from '../utils/KeywordsUtils.js';
import { MethodParser } from './MethodParser.js';
import { Value } from '../entity/Value.js';

export type ParseDataValueOptions = {
  name: string;
  value: Value;
  nodeTyping: any;
  nodeComment: any;
};

export class DataParser extends AbstractExpressionParser {
  static mergeEntryKeywords(entry) {
    KeywordsUtils.parseCommonEntryTags(entry);
    KeywordsUtils.mergeEntryKeyword(entry, Tag.type);
    KeywordsUtils.mergeEntryKeyword(entry, Tag.initialValue);

    entry.type = JSDoc.parseType(entry.type);
  }

  get compositionComputedKeys() {
    // FIXME Handle this
    // return CompositionAPIComputedValues.concat(this.options.composition.computed);
    return CompositionAPIComputedValues; // .concat(this.options.composition.computed);
  }

  parseObjectExpressionProperty(property) {
    this.parseData(property);
  }

  parseData(property) {
    const name = this.parseKey(property);
    const propertyValue = property?.value || property;
    const value = this.getValue(propertyValue);

    this.parseDataValue({
      name,
      value,
      nodeTyping: propertyValue,
      nodeComment: property,
    });
  }

  parseDataValue({ name, value, nodeTyping, nodeComment }: ParseDataValueOptions) {
    if (value.type === Type.function && value.$kind && !this.compositionComputedKeys.includes(value.$kind as any)) {
      this.parseDataValueMethod({ name, value, nodeTyping, nodeComment });
    } else {
      this.parseDataValueRaw({ name, value, nodeTyping, nodeComment });
    }
  }

  parseDataValueMethod({ name, nodeTyping, nodeComment }: ParseDataValueOptions) {
    if (this.features.includes(Feature.methods)) {
      const { value: node = nodeTyping, comment: nComment = nodeComment } = this.scope[name]?.node || {};

      if (!node.key) {
        node.key = nodeComment.key || nodeTyping.id;
      }

      new MethodParser(this.root).parseMethodProperty(node, node, nComment);
    }
  }

  parseDataValueRaw({ name, value, nodeTyping, nodeComment }: ParseDataValueOptions) {
    if (this.root.features.includes(Feature.data)) {
      const entry = new DataEntry({
        name,
        type: this.getTSType(nodeTyping, value.kind),
        initialValue: value.raw,
      });

      value.member = true;

      this.setScopeValue(name, nodeTyping, value, { global: true });
      this.parseEntryComment(entry, nodeComment);
      DataParser.mergeEntryKeywords(entry);
      this.emit(entry);
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

            case Syntax.FunctionDeclaration:
              this.parseFunctionDeclaration(item);
              break;
          }
        });
        break;
    }
  }

  parseFunctionDeclaration(node) {
    this.setScopeValue(node.id.name, node, this.getValue(node));
  }

  parseReturnStatement(node) {
    switch (node.argument.type) {
      case Syntax.ObjectExpression:
        this.parseObjectExpression(node.argument);
        break;
    }
  }
}
