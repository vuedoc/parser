const { ComponentTestCase } = require('./lib/TestUtils')

/* global describe */

// [paramName, paramDefaultValue, expectedParamType, expectedDefaultValue = paramDefaultValue]
const defaultParams = [
  [ 'unset', undefined, [ 'unknow', 'any' ] ],
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
  [ 'tagged', 'tagged`hello`', 'string' ],
  [ 'tagged', 'tagged`hello ${name}`', 'string' ],
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
  defaultParams.forEach(([ paramName, paramValue, expectedTypes, expectedValue = paramValue ]) => {
    const [ expectedType, expectedType2 = expectedType ] = expectedTypes instanceof Array ? expectedTypes : [ expectedTypes ]
    const args = paramValue ? `${paramName} = ${paramValue}` : `${paramName}`
    const argsWithTyping = paramValue ? `${paramName}: ${expectedType} = ${paramValue}` : `${paramName}`
    const expectedArgs = paramValue ? `${paramName}: ${expectedType2} = ${paramValue}` : `${paramName}: ${expectedType}`

    ComponentTestCase({
      name: `Default param for function(${paramValue ? `${paramName}: ${expectedType} = ${paramValue}` : `${paramName}: ${expectedType}`}): void`,
      options: {
        filecontent: `
          <script>
            const name = 'Arya Stark'

            export default {
              methods: {
                withDefaultValue(${args}) {},
                withDefaultValueAndTyping(${argsWithTyping}) {}
              }
            };
          </script>
        `
      },
      expected: {
        methods: [
          {
            kind: 'method',
            syntax: [
              `withDefaultValue(${expectedArgs}): void`
            ],
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
            returns: {
              type: 'void',
              description: ''
            }
          },
          {
            kind: 'method',
            syntax: [
              `withDefaultValueAndTyping(${expectedArgs}): void`
            ],
            name: 'withDefaultValueAndTyping',
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
            returns: {
              type: 'void',
              description: ''
            }
          }
        ]
      }
    })
  })

  ComponentTestCase({
    name: '@syntax',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * Name only
               * @syntax nameOnly(somebody: string) => void
               */
              nameOnly(somebody) {
                alert('Hello ' + somebody);
              },
            }
          };
        </script>
      `
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'nameOnly(somebody: string) => void'
          ],
          visibility: 'public',
          category: null,
          description: 'Name only',
          keywords: [],
          name: 'nameOnly',
          params: [
            {
              type: 'unknow',
              name: 'somebody',
              description: '',
              defaultValue: undefined,
              rest: false
            }
          ],
          returns: {
            type: 'void',
            description: ''
          }
        },
      ]
    }
  })

  ComponentTestCase({
    name: '@syntax',
    description: 'with rest param and returning arrow function',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * Name only
               */
              nameOnly: (...somebody: string[]) => alert('Hello ' + somebody)
            }
          };
        </script>
      `
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'nameOnly(...somebody: string[]): unknow'
          ],
          visibility: 'public',
          category: null,
          description: 'Name only',
          keywords: [],
          name: 'nameOnly',
          params: [
            {
              type: 'string[]',
              name: 'somebody',
              description: '',
              defaultValue: undefined,
              rest: true
            }
          ],
          returns: {
            type: 'unknow',
            description: ''
          }
        },
      ]
    }
  })

  ComponentTestCase({
    name: '@syntax',
    description: 'with rest param and empty arrow function',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * Name only
               */
              nameOnly: (...somebody: string[]) => {}
            }
          };
        </script>
      `
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'nameOnly(...somebody: string[]): void'
          ],
          visibility: 'public',
          category: null,
          description: 'Name only',
          keywords: [],
          name: 'nameOnly',
          params: [
            {
              type: 'string[]',
              name: 'somebody',
              description: '',
              defaultValue: undefined,
              rest: true
            }
          ],
          returns: {
            type: 'void',
            description: ''
          }
        },
      ]
    }
  })

  ComponentTestCase({
    name: '@syntax',
    description: 'with rest param and unknow identifier method',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              nameOnly
            }
          };
        </script>
      `
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'nameOnly(): unknow'
          ],
          visibility: 'public',
          category: null,
          description: '',
          keywords: [],
          name: 'nameOnly',
          params: [],
          returns: {
            type: 'unknow',
            description: ''
          }
        },
      ]
    }
  })

  ComponentTestCase({
    name: 'generator method',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              *nameOnly() {}
            }
          };
        </script>
      `
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            '*nameOnly(): void'
          ],
          visibility: 'public',
          category: null,
          description: '',
          keywords: [],
          name: 'nameOnly',
          params: [],
          returns: {
            type: 'void',
            description: ''
          }
        },
      ]
    }
  })

  ComponentTestCase({
    name: 'async method',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              async nameOnly() {}
            }
          };
        </script>
      `
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'async nameOnly(): Promise'
          ],
          visibility: 'public',
          category: null,
          description: '',
          keywords: [],
          name: 'nameOnly',
          params: [],
          returns: {
            type: 'Promise',
            description: ''
          }
        },
      ]
    }
  })

  ComponentTestCase({
    name: 'async method with returning statement',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              async nameOnly() {
                return 12
              }
            }
          };
        </script>
      `
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'async nameOnly(): Promise<unknow>'
          ],
          visibility: 'public',
          category: null,
          description: '',
          keywords: [],
          name: 'nameOnly',
          params: [],
          returns: {
            type: 'Promise<unknow>',
            description: ''
          }
        },
      ]
    }
  })

  ComponentTestCase({
    name: 'async method with explicit typing',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              async nameOnly(): Promise<string> {}
            }
          };
        </script>
      `
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'async nameOnly(): Promise<string>'
          ],
          visibility: 'public',
          category: null,
          description: '',
          keywords: [],
          name: 'nameOnly',
          params: [],
          returns: {
            type: 'Promise<string>',
            description: ''
          }
        },
      ]
    }
  })
})
