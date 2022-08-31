import { Parser } from '../../types/Parser.js';
import { Value } from './Value.js';

export class RestValue extends Value {
  name: string;

  constructor(type: Parser.Type, name: string) {
    super(type, {}, `{ ...${name} }`);

    this.name = name;
  }
}
