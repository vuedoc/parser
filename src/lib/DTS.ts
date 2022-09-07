import { Parser } from '../../types/Parser.js';
import { ANY_VALUE, generateArrayGenerator, generateNullGenerator, generateObjectGenerator, Value } from '../entity/Value.js';
import { Type } from './Enum.js';

const PARAM_RE = /^[a-zA-Z0-9$&_]+$/;
const TYPES_TO_TRANSFORM = [Type.object, Type.array];

export const DTS = {
  parseValue(type: string | string[] | Record<string, any>) {
    if (typeof type === 'string') {
      switch (type) {
        case 'object':
          return generateNullGenerator.next().value;

        default:
          return new Value(type, undefined, '');
      }
    }

    if (type instanceof Array) {
      return generateArrayGenerator.next().value;
    }

    const ref = generateObjectGenerator.next().value;

    for (const key in type) {
      const keyType = type[key];
      const keyRef = DTS.parseValue(keyType);

      ref.value[key] = keyRef.value;
      ref.rawObject[key] = keyRef;
    }

    ref.raw = JSON.stringify(ref.value);

    return ref;
  },
  parseType(ref: Parser.Value<any>): string {
    if (ref.value === ANY_VALUE) {
      return Type.any;
    }

    if (!TYPES_TO_TRANSFORM.includes(ref.type as any)) {
      return typeof ref.type === 'string' ? ref.type : ref.type.join(' | ');
    }

    if (ref.value === null) {
      return Type.unknown;
    }

    const value = ref.value;

    if (TYPES_TO_TRANSFORM.includes(ref.type as any)) {
      if (ref.rawObject instanceof Array) {
        if (ref.rawObject.length) {
          const types = ref.rawObject.map(DTS.parseType).reduce((items, item) => {
            if (!items.includes(item)) {
              items.push(item);
            }

            return items;
          }, []);

          if (types.length === 1) {
            return `${types[0]}[]`;
          }

          return `Array<${types.join(' | ')}>`;
        }

        return `${Type.unknown}[]`;
      }

      const output = [];

      for (const key in value) {
        const currentRef = ref.rawObject[key];
        const currentType = DTS.parseType(currentRef);

        if (PARAM_RE.test(key)) {
          output.push(`${key}: ${currentType};`);
        } else if (key.startsWith('...')) {
          output.push(`[${key.substring(3)}: string]: ${currentType};`);
        } else {
          output.push(`'${key}': ${currentType};`);
        }
      }

      return output.length ? `{ ${output.join(' ')} }` : Type.object;
    }

    return value.type instanceof Array ? value.type.join(' | ') : value.type;
  },
  parseTsValueType(tsValue: Parser.AST.TSValue) {
    if (typeof tsValue.type === 'string' || tsValue.type instanceof Array) {
      return tsValue.type;
    }

    const raw = {};

    for (const key in tsValue.type) {
      const type = tsValue.type[key];

      raw[key] = Array.isArray(type) ? type.join('|') : type;
    }

    return JSON.stringify(raw);
  },
};
