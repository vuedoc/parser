import { parseComponent } from '../../src/index.ts';
import { beforeAll, describe, expect, it } from 'vitest';

export const ComponentTestCase = ({ name, description, expected, options }) => {
  describe.concurrent(description ? `${name}: ${description}` : name, () => {
    let component = null;

    beforeAll(async () => {
      if (options.filecontent instanceof Promise) {
        options.filecontent = await options.filecontent;
      }

      component = await parseComponent(options);
    });

    Object.keys(expected).forEach((key) => {
      it(`should successfully parse ${key}`, () => {
        expect(component[key]).toEqual(expected[key]);
      });
    });
  });
};
