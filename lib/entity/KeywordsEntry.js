import { AbstractLiteralEntry } from './AbstractLiteralEntry';

export class KeywordsEntry extends AbstractLiteralEntry {
  constructor (keywords) {
    super('keywords');

    this.value = keywords;
  }
}
