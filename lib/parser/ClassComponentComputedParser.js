import { ComputedParser } from './ComputedParser.js';
import { ComputedEntry } from '../entity/ComputedEntry.js';
import { Syntax } from '../Enum.js';

export class ClassComponentComputedParser extends ComputedParser {
  parse (node, { type = null, dependencies = [] } = {}) {
    const name = node.key.type === Syntax.Identifier
      ? node.key.name
      : this.getValue(node.key).value;

    const entry = new ComputedEntry({ name, type, dependencies });

    this.parseEntry(entry, node.body, node);
  }
}
