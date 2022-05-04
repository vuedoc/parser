import { Type } from '../Enum';
import { Value } from './Value';

export class RestValue extends Value {
  constructor (type = Type.object, name) {
    super(type, {}, `{ ...${name} }`);

    this.name = name;
  }
}
