import { Entry } from '../../types/Entry.js';

export class Keyword implements Entry.Keyword {
  name: string;
  description: string | undefined;

  constructor(name?: string, description?: string) {
    this.name = name || '';
    this.description = description;
  }
}
