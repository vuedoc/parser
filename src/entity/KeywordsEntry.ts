import { Entry } from '../../types/Entry.js';
import { AbstractLiteralEntry } from './AbstractLiteralEntry.js';

export class KeywordsEntry extends AbstractLiteralEntry<'keyword', Entry.Keyword[]> implements Entry.KeywordsEntry {
  constructor(keywords: Entry.Keyword[]) {
    super('keyword', keywords);
  }
}
