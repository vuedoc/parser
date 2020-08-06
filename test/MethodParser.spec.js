const { ComponentTestCase } = require('./lib/TestUtils')

/* global describe */

// [paramName, paramDefaultValue, expectedParamType, expectedDefaultValue = paramDefaultValue]
const defaultParams = [
  [ 'unset', undefined, 'any' ],
  [ 'undefine', 'undefined', 'any' ],
  [ 'negativeNumber', '-1', 'number' ],
  [ 'positiveNumber', '1', 'number' ],
  [ 'zeroNumber', '0', 'number' ],
  [ 'numeric', '1_000_000_000', 'number' ],
  [ 'numeric', '101_475_938.38', 'number' ],
  [ 'binary', '0b111110111', 'number' ],
  [ 'octalLiteral', '0o767', 'number' ],
  [ 'thruty', 'true', 'boolean' ],
  [ 'falsy', 'false', 'boolean' ],
  [ 'string', '"hello"', 'string', '"hello"' ],
  [ 'unicode', '"𠮷"', 'string', '"𠮷"' ],
  [ 'unicode', '"\u{20BB7}"', 'string', '"𠮷"' ],
  [ 'emptyString', '""', 'string', '""' ],
  [ 'literal', '`hello`', 'string' ],
  [ 'literal', '`hello ${name}`', 'string' ],
  [ 'tagged', 'tagged`hello`', 'string', '`hello`' ],
  [ 'tagged', 'tagged`hello ${name}`', 'string', '`hello ${name}`' ],
  [ 'math', 'Math.PI', 'number' ],
  [ 'math', 'Math.blabla', 'number' ],
  [ 'number', 'Number.MAX_VALUE', 'number' ],
  [ 'number', 'Number.blabla', 'number' ],
  [ 'obj', 'Bool.TRUE', 'object' ],
  [ 'nully', 'null', 'any' ],
  [ 'symbol', 'Symbol(2)', 'symbol' ],
  [ 'bigint', '9007199254740991n', 'bigint' ],
  [ 'bigint', 'BigInt(9007199254740991)', 'bigint' ]
]

describe('MethodParser', () => {
  defaultParams.forEach(([ paramName, paramValue, expectedType, expectedValue = paramValue, args = paramValue ? `${paramName} = ${paramValue}` : `${paramName}` ]) => ComponentTestCase({
    name: `Default param for function(${paramValue ? `${paramName}: ${expectedType} = ${paramValue}` : `${paramName}: ${expectedType}`}): void`,
    options: {
      filecontent: `
        <script>
          const name = 'Arya Stark'

          export default {
            methods: {
              withDefaultValue(${args}) {}
            }
          };
        </script>
      `
    },
    expected: {
      methods: [
        {
          kind: 'method',
          name: 'withDefaultValue',
          visibility: 'public',
          category: null,
          description: '',
          keywords: [],
          params: [
            {
              name: paramName,
              type: expectedType,
              description: '',
              defaultValue: expectedValue ? `${expectedValue}` : expectedValue,
              rest: false
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        }
      ]
    }
  }))
})
