import { DataParser } from './DataParser.js';

import { DataEntry } from '../entity/DataEntry.js';
import { Parser } from '../../types/Parser.js';
import { Syntax } from '../lib/Enum.js';

import * as Babel from '@babel/types';

export class ClassComponentDataParser extends DataParser {
  parse(node: Babel.Node, type?: Parser.Type) {
    if (node.type === Syntax.ClassProperty) {
      if ('name' in node.key) {
        this.parseClassData(node, node.key.name, node.value, type);
      }
    } else if ('expression' in node && typeof node.expression === 'object') {
      switch (node.expression.type) {
        case Syntax.AssignmentExpression:
          if ('property' in node.expression.left && 'name' in node.expression.left.property) {
            this.parseClassData(
              node,
              node.expression.left.property.name,
              node.expression.right,
              type
            );
          }
          break;
      }
    }
  }

  parseClassData(node: Babel.Node, name: string, value: Babel.Node, type?: Parser.Type) {
    const ref = this.getValue(value);
    const entry = new DataEntry({
      name,
      type: type || this.getTSTypeRaw(node, ref.type),
      initialValue: ref.raw,
    });

    this.setScopeValue(entry.name, value || node, ref, {
      global: true,
    });

    this.parseEntryComment(entry, node);
    DataParser.mergeEntryKeywords(entry);

    if ('accessibility' in node && node.accessibility) {
      entry.visibility = node.accessibility;
    }

    this.emit(entry);
  }
}
