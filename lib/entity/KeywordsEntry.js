import { AbstractLiteralEntry } from './AbstractLiteralEntry.js';

export class KeywordsEntry extends AbstractLiteralEntry {
  constructor(keywords) {
    super('keywords', keywords);
  }
}
