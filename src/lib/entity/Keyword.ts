import { Vuedoc } from '../../../types/index.js';

export class Keyword implements Vuedoc.Entry.Keyword {
  name: string;
  description: string | undefined;

  constructor(name?: string, description?: string) {
    this.name = name || '';
    this.description = description;
  }
}
