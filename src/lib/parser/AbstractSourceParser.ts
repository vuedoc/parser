import { AbstractParser } from './AbstractParser.js';
import { Vuedoc } from '../../../types/index.js';

import * as Babel from '@babel/types';

export abstract class AbstractSourceParser<
  Source extends Vuedoc.Parser.Source,
  Root = never
> extends AbstractParser<Source, Root> {
  abstract findComment(node: Babel.Node): string | null;

  emit(entry: Vuedoc.Entry.Type) {
    this.emitter.emitEntry(entry);
  }
}
