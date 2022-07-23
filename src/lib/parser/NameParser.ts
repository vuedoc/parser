import { AbstractLiteralParser } from './AbstractLiteralParser.js';
import { NameEntry } from '../entity/NameEntry.js';
import { UndefinedValue } from '../entity/Value.js';
import { Type } from '../Enum.js';
import { Vuedoc } from '../../../types/index.js';
import * as Babel from '@babel/types';

export class NameParser extends AbstractLiteralParser<Vuedoc.Parser.Script> {
  parseObjectProperty(node: Babel.ObjectProperty) {
    const ref = this.getValue(node.value);
    const name = ref.type === Type.string ? ref.value : UndefinedValue.value;
    const entry = new NameEntry(name);

    this.emit(entry);
  }
}
