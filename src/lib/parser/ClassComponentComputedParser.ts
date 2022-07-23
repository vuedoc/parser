import { ComputedParser } from './ComputedParser.js';
import { ComputedEntry } from '../entity/ComputedEntry.js';
import { Syntax, Type } from '../Enum.js';
import { Vuedoc } from '../../../types/index.js';

import * as Babel from '@babel/types';

export class ClassComponentComputedParser extends ComputedParser {
  parseNode(node: Babel.ClassMethod | Babel.ClassPrivateMethod, type: Vuedoc.Parser.Type = Type.unknown, dependencies: string[] = []) {
    const name = node.key.type === Syntax.Identifier
      ? node.key.name
      : this.getValue(node.key).value;

    const entry = new ComputedEntry({ name, type, dependencies });

    this.parseEntry(entry, node.body, node);
  }
}
