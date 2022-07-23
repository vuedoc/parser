import { Vuedoc } from '../../../types/index.js';
import { AbstractLiteralEntry } from './AbstractLiteralEntry.js';

export class KeywordsEntry extends AbstractLiteralEntry<'keyword', Vuedoc.Entry.Keyword[]> implements Vuedoc.Entry.KeywordsEntry {
  constructor(keywords: Vuedoc.Entry.Keyword[]) {
    super('keyword', keywords);
  }
}
