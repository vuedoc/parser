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
            category: undefined,
            description: undefined,
            keywords: [],
            params: [
              {
                name: paramName,
                type: expectedType,
                description: undefined,
                defaultValue: expectedValue ? `${expectedValue}` : expectedValue,
                rest: false
              }
            ],
            returns: {
              type: 'void',
              description: undefined
            }
          },
          {
            kind: 'method',
            syntax: [
              `withDefaultValueAndTyping(${expectedArgs}): void`
            ],
            name: 'withDefaultValueAndTyping',
            visibility: 'public',
            category: undefined,
            description: undefined,
            keywords: [],
            params: [
              {
                name: paramName,
                type: expectedType,
                description: undefined,
                defaultValue: expectedValue ? `${expectedValue}` : expectedValue,
                rest: false
              }
            ],
            returns: {
              type: 'void',
              description: undefined
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
          category: undefined,
          description: 'Name only',
          keywords: [],
          name: 'nameOnly',
          params: [
            {
              type: 'unknow',
              name: 'somebody',
              description: undefined,
              defaultValue: undefined,
              rest: false
            }
          ],
          returns: {
            type: 'void',
            description: undefined
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
          category: undefined,
          description: 'Name only',
          keywords: [],
          name: 'nameOnly',
          params: [
            {
              type: 'string[]',
              name: 'somebody',
              description: undefined,
              defaultValue: undefined,
              rest: true
            }
          ],
          returns: {
            type: 'unknow',
            description: undefined
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
          category: undefined,
          description: 'Name only',
          keywords: [],
          name: 'nameOnly',
          params: [
            {
              type: 'string[]',
              name: 'somebody',
              description: undefined,
              defaultValue: undefined,
              rest: true
            }
          ],
          returns: {
            type: 'void',
            description: undefined
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
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'nameOnly',
          params: [],
          returns: {
            type: 'unknow',
            description: undefined
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
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'nameOnly',
          params: [],
          returns: {
            type: 'void',
            description: undefined
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
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'nameOnly',
          params: [],
          returns: {
            type: 'Promise',
            description: undefined
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
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'nameOnly',
          params: [],
          returns: {
            type: 'Promise<unknow>',
            description: undefined
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
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'nameOnly',
          params: [],
          returns: {
            type: 'Promise<string>',
            description: undefined
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
              /**
               * The **\`exec()\`** method executes a search for a match in a specified
               * string. Returns a result array, or \`null\`.
               *
               * JavaScript \`RegExp\` objects are **stateful** when they have the \`global\`
               * or \`sticky\` flags set (e.g. \`/foo/g\` or \`/foo/y\`). They store a
               * \`lastIndex\` from the previous match. Using this internally, \`exec()\` can
               * be used to iterate over multiple matches in a string of text (with
               * capture groups), as opposed to getting just the matching strings with
               * \`String.prototype.match()\`.
               *
               * A newer function has been proposed to simplify matching multiple parts of a string (with capture groups): \`String.prototype.matchAll()\`.
               *
               * If you are executing a match simply to find \`true\` or \`false\`, use
               * \`RegExp.prototype.test()\` method or String.prototype.search() instead.
               *
               * @example
               * \`\`\`js
               * const regex1 = RegExp('foo*','g');
               * const str1 = 'table football, foosball';
               * let array1;
               *
               * while ((array1 = regex1.exec(str1)) !== null) {
               *   console.log(\`Found \${array1[0]}. Next starts at \${regex1.lastIndex}.\`);
               *   // expected output: "Found foo. Next starts at 9."
               *   // expected output: "Found foo. Next starts at 19."
               * }
               * \`\`\`
               *
               * @syntax regexObj.exec(str: string): any[]
               * @param {string} str - The string against which to match the regular expression.
               * @returns If the match succeeds, the exec() method returns an array (with extra properties index and input; see below) and updates the lastIndex property of the regular expression object. The returned array has the matched text as the first item, and then one item for each parenthetical capture group of the matched text.
               * If the match fails, the exec() method returns null, and sets lastIndex to 0.
               */
              exec(str) {}
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
            'regexObj.exec(str: string): any[]'
          ],
          visibility: 'public',
          category: undefined,
          description: 'The **`exec()`** method executes a search for a match in a specified\n' +
            'string. Returns a result array, or `null`.\n' +
            '\n' +
            'JavaScript `RegExp` objects are **stateful** when they have the `global`\n' +
            'or `sticky` flags set (e.g. `/foo/g` or `/foo/y`). They store a\n' +
            '`lastIndex` from the previous match. Using this internally, `exec()` can\n' +
            'be used to iterate over multiple matches in a string of text (with\n' +
            'capture groups), as opposed to getting just the matching strings with\n' +
            '`String.prototype.match()`.\n' +
            '\n' +
            'A newer function has been proposed to simplify matching multiple parts of a string (with capture groups): `String.prototype.matchAll()`.\n' +
            '\n' +
            'If you are executing a match simply to find `true` or `false`, use\n' +
            '`RegExp.prototype.test()` method or String.prototype.search() instead.',
          keywords: [
            {
              name: 'example',
              description: '```js\n' +
                "const regex1 = RegExp('foo*','g');\n" +
                "const str1 = 'table football, foosball';\n" +
                'let array1;\n' +
                '\n' +
                'while ((array1 = regex1.exec(str1)) !== null) {\n' +
                '  console.log(`Found ${array1[0]}. Next starts at ${regex1.lastIndex}.`);\n' +
                '  // expected output: "Found foo. Next starts at 9."\n' +
                '  // expected output: "Found foo. Next starts at 19."\n' +
                '}\n' +
                '```'
            }
          ],
          name: 'exec',
          version: undefined,
          params: [
            {
              name: 'str',
              type: 'string',
              description: 'The string against which to match the regular expression.',
              defaultValue: undefined,
              rest: false,
            }
          ],
          returns: {
            type: 'void',
            description: 'If the match succeeds, the exec() method returns an array (with extra properties index and input; see below) and updates the lastIndex property of the regular expression object. The returned array has the matched text as the first item, and then one item for each parenthetical capture group of the matched text.\n'
              + 'If the match fails, the exec() method returns null, and sets lastIndex to 0.'
          }
        },
      ]
    }
  })

  ComponentTestCase({
    name: '@param with mutiline',
    options: {
      filecontent: `
        <script>
          export default {
            name: 'NumericInput',
            methods: {
              /**
               * @param {number} value - Lorem ipsum dolor sit amet, consectetur adipiscing elit.
               *                         Curabitur suscipit odio nisi, vel pellentesque augue tempor sed.
               *                         Quisque tempus tortor metus, sit amet vehicula nisi tempus sit amet.
               */
              check(value) {}
            }
          }
        </script>
      `
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'check(value: number): void'
          ],
          name: 'check',
          visibility: 'public',
          category: undefined,
          description: undefined,
          version: undefined,
          keywords: [],
          params: [
            {
              name: 'value',
              type: 'number',
              defaultValue: undefined,
              rest: false,
              description: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit.\n'
                + 'Curabitur suscipit odio nisi, vel pellentesque augue tempor sed.\n'
                + 'Quisque tempus tortor metus, sit amet vehicula nisi tempus sit amet.'
            }
          ],
          returns: {
            type: 'void',
            description: undefined
          }
        }
      ]
    }
  });
})
