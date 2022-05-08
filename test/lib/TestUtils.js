import * as parser from '../../index.js';

/* global describe beforeAll it expect */

export const ComponentTestCase = ({ name, description, expected, options }) => {
  describe(description ? `${name}: ${description}` : name, () => {
    let component = null;

    beforeAll(async () => {
      if (options.filecontent instanceof Promise) {
        options.filecontent = await options.filecontent;
      }

      component = await parser.parse(options);
    });

    Object.keys(expected).forEach((key) => {
      it(`should successfully parse ${key}`, () => {
        expect(component[key]).toEqual(expected[key]);
      });
    });
  });
};
