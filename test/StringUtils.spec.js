const { StringUtils } = require('../lib/utils/StringUtils')

/* global describe it expect */

describe('StringUtils', () => {
  describe('toKebabCase(text)', () => {
    [
      [ 'helloWorld', 'hello-world' ],
      [ 'HelloWorld', 'hello-world' ],
      [ 'HelloWorldItsMe', 'hello-world-its-me' ],
    ].forEach(([ camelCase, kebabCase ]) => it(`${camelCase} -> ${kebabCase}`, () => {
      expect(StringUtils.toKebabCase(camelCase)).toEqual(kebabCase)
    }));
  })
})
