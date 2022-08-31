import { ScriptParser } from './ScriptParser.js';
import { AbstractExpressionParser } from './AbstractExpressionParser.js';

import { DataEntry } from '../entity/DataEntry.js';
import { Feature, Syntax, Tag, Type } from '../lib/Enum.js';

import { KeywordsUtils } from '../utils/KeywordsUtils.js';
import { Parser } from '../../types/Parser.js';
import { Value } from '../entity/Value.js';

export type ParseDataValueOptions = {
  name: string;
  value: Value;
  nodeTyping: any;
  nodeComment: any;
};

export type ParseDataValueTypedOptions = ParseDataValueOptions & {
  type?: Parser.Type | Parser.Type[];
};

export class DataParser<
  Root extends ScriptParser<any, any> = ScriptParser<any, any>
> extends AbstractExpressionParser<Root> {
  static mergeEntryKeywords(entry) {
    KeywordsUtils.parseCommonEntryTags(entry);
    KeywordsUtils.mergeEntryKeyword(entry, Tag.type);
    KeywordsUtils.mergeEntryKeyword(entry, Tag.initialValue);
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

  parseDataValue({ name, value, type, nodeTyping, nodeComment }: ParseDataValueTypedOptions) {
    if (value.type === Type.function) {
      this.parseDataValueMethod({ name, value, nodeTyping, nodeComment });
    } else {
      this.parseDataValueRaw({ name, value, type, nodeTyping, nodeComment });
    }
  }

  parseDataValueMethod({ name, nodeTyping, nodeComment }: ParseDataValueOptions) {
    if (this.features.includes(Feature.methods)) {
      const ref = this.getScopeValue(name);

      if (ref) {
        const { value: node = nodeTyping, comment: nComment = nodeComment } = ref.node;

        if (!node.key) {
          node.key = nodeComment.key || nodeTyping.id;
        }

        this.root.parsers.methods.sync(this.scope).parseMethodProperty(node, node, nComment);
      }
    }
  }

  parseDataValueRaw({ name, value, type, nodeTyping, nodeComment }: ParseDataValueTypedOptions) {
    if (this.root.features.includes(Feature.data)) {
      let _type = type || this.getTSType(nodeTyping, value.kind);

      if (_type === Type.null) {
        _type = Type.unknown;
      }

      const entry = new DataEntry({
        name,
        type: _type,
        initialValue: this.getRawValue(name, value.raw),
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
