import { generateArrayGenerator, generateNullGenerator, generateObjectGenerator, Value } from '../entity/Value.js';

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
  parseType(value: any): string {
    const type = typeof value;

    if (type === 'object') {
      if (value === null) {
        return null;
      }

      if (value instanceof Array) {
        if (value.length) {
          const types = value.map(DTS.parseType);

          if (types.length === 1) {
            return `${types[0]}[]`;
          }

          return `Array<${types.join(' | ')}>`;
        }

        return 'unknow[]';
      }

      let output = '';

      for (const key in value) {
        const currentValue = value[key];
        const currentType = DTS.parseType(currentValue);

        output += `${key}: ${currentType};`;
      }

      return `{ ${output} }`;
    }

    return type;
  },
};
