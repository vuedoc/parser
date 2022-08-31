import { AbstractParser } from './AbstractParser.js';
import { Entry } from '../../types/Entry.js';
import { Parser } from '../../types/Parser.js';

import * as Babel from '@babel/types';

export abstract class AbstractSourceParser<
  Source extends Parser.Source,
  Root = never
> extends AbstractParser<Source, Root> {
  abstract findComment(node: Babel.Node): string | null;

  emit(entry: Entry.Type) {
    this.emitter.emitEntry(entry);
  }
}
