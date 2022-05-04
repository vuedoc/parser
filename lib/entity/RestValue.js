import { Value } from './Value';

export class RestValue extends Value {
  constructor (type, name) {
    super(type, {}, `{ ...${name} }`);

    this.name = name;
  }
}
