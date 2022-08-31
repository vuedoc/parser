import { ComputedParser } from './ComputedParser.js';
import { ComputedEntry } from '../entity/ComputedEntry.js';
import { Syntax, Type } from '../lib/Enum.js';
import { Parser } from '../../types/Parser.js';

import * as Babel from '@babel/types';

export class ClassComponentComputedParser extends ComputedParser {
  parseNode(node: Babel.ClassMethod | Babel.ClassPrivateMethod, type: Parser.Type = Type.unknown, dependencies: string[] = []) {
    const name = node.key.type === Syntax.Identifier
      ? node.key.name
      : this.getValue(node.key).value;

    const entry = new ComputedEntry({ name, type, dependencies });

    this.parseEntry(entry, node, node.body || node);
  }
}
