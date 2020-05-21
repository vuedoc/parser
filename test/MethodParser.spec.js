const { ComponentTestCase } = require('./lib/TestUtils')

/* global describe */
/* eslint-disable no-template-curly-in-string */

// [paramName, paramDefaultValue, expectedParamType, expectedDefaultValue = paramDefaultValue]
const defaultParams = [
  [ 'unset', undefined, 'any' ],
  [ 'undefine', 'undefined', 'any' ],
  [ 'negativeNumber', '-1', 'number' ],
  [ 'positiveNumber', '1', 'number' ],
  [ 'zeroNumber', '0', 'number' ],
  [ 'numeric', '1_000_000_000', 'number', '1000000000' ],
  [ 'numeric', '101_475_938.38', 'number', '101475938.38' ],
  [ 'binary', '0b111110111', 'number', '503' ],
  [ 'octalLiteral', '0o767', 'number', '503' ],
  [ 'thruty', 'true', 'boolean' ],
  [ 'falsy', 'false', 'boolean' ],
  [ 'string', '"hello"', 'string' ],
  [ 'unicode', '"𠮷"', 'string' ],
  [ 'unicode', '"\u{20BB7}"', 'string' ],
  [ 'emptyString', '""', 'string' ],
  [ 'literal', '`hello`', 'string' ],
  [ 'literal', '`hello ${name}`', 'string', '`hello ${name}`' ],
  [ 'tagged', 'tagged`hello`', 'string', '`hello`' ],
  [ 'tagged', 'tagged`hello ${name}`', 'string', '`hello ${name}`' ],
  [ 'math', 'Number.EPSILON', 'number' ],
  [ 'nully', 'null', 'any' ],
  [ 'symbol', 'Symbol(2)', 'symbol' ],
  [ 'bigint', '9007199254740991n', 'bigint' ],
  [ 'bigint', 'BigInt(9007199254740991)', 'bigint' ],
]

describe('MethodParser', () => {
  ComponentTestCase({
    name: 'JSDoc',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * Set the checkbox ID
               * @param {string} id - The checkbox ID
               * @param {string} [name] - The checkbox name
               * @param {number} [order=1] - The checkbox order
               * @param {string|string[]} [values] - The checkbox values
               * @param {*} [...rest] - The rest options
               * @return {boolean} True on success; ortherwise false
               */
              set (id, name, ...rest) {
                const status = true
                /**
                 * Emitted the event \`finished\` when loaded
                 * Multilign
                 * @param {*} status - The finishing status
                 */
                this.$emit('finished', status)
              },

              //
              // Names, types, and descriptions
              // The following examples show how to include names, types, and
              // descriptions in a @param tag.
              //

              /**
               * Name only
               * @param somebody
               */
              nameOnly(somebody) {
                alert('Hello ' + somebody);
              },

              /**
               * Name and type
               * @param {string} somebody
               */
              nameAndType(somebody) {
                alert('Hello ' + somebody);
              },

              /**
               * Name, type, and description
               * @param {string} somebody Somebody's name.
               */
              nameTypeAndDescription(somebody) {
                alert('Hello ' + somebody);
              },

              /**
               * Name, type, and description, with a hyphen before the description
               * @param {string} somebody - Somebody's name.
               */
              nameTypeAndDescriptionWithHyphen(somebody) {
                alert('Hello ' + somebody);
              },

              //
              // Documenting a parameter's properties
              // If a parameter is expected to have a specific property, you can
              // document that property by providing an additional @param tag. For
              // example, if an employee parameter is expected to have name and
              // department properties, you can document it as follows:
              //

              /**
               * Assign the project to an employee.
               * @param {Object} employee - The employee who is responsible for the project.
               * @param {string} employee.name - The name of the employee.
               * @param {string} employee.department - The employee's department.
               */
              withParameterProperties(employee) {
                // ...
              },

              /**
               * Assign the project to an employee.
               * @param {Object} employee - The employee who is responsible for the project.
               * @param {string} employee.name - The name of the employee.
               * @param {string} employee.department - The employee's department.
               */
              withDestructuringParameter({ name, department }) {
                // ...
              },

              /**
               * Assign the project to a list of employees.
               * @param {Object[]} employees - The employees who are responsible for the project.
               * @param {string} employees[].name - The name of an employee.
               * @param {string} employees[].department - The employee's department.
               */
              withPropertiesOfValuesInAnArray(employees) {
                // ...
              },

              /**
               * An optional parameter (using JSDoc syntax)
               * @param {string} [somebody] - Somebody's name.
               */
              withOptionalParameter(somebody) {
                if (!somebody) {
                  somebody = 'John Doe';
                }

                alert('Hello ' + somebody);
              },

              /**
               * An optional parameter and default value
              * @param {string} [somebody=John Doe] - Somebody's name.
              */
              withOptionalParameterAndDefaultValue(somebody) {
                  if (!somebody) {
                      somebody = 'John Doe';
                  }
                  alert('Hello ' + somebody);
              },

              //
              // Multiple types and repeatable parameters
              // The following examples show how to use type expressions to indicate
              // that a parameter can accept multiple types (or any type), and that a
              // parameter can be provided more than once. See the @type tag
              // documentation for details about the type expressions that JSDoc
              // supports.
              //

              /**
               * Allows one type OR another type (type union)
               * @param {(string|string[])} [somebody=John Doe] - Somebody's name, or an array of names.
               */
              withMultipleType(somebody) {
                if (!somebody) {
                  somebody = 'John Doe';
                } else if (Array.isArray(somebody)) {
                  somebody = somebody.join(', ');
                }

                alert('Hello ' + somebody);
              },

              /**
               * Allows any type
               * @param {*} somebody - Whatever you want.
               */
              withAnyType(somebody) {
                console.log('Hello ' + JSON.stringify(somebody));
              },

              /**
               * Allows a parameter to be repeated.
               * Returns the sum of all numbers passed to the function.
               * @param {...number} num - A positive or negative number.
               */
              withSpreadNotation(num) {
                var i = 0, n = arguments.length, t = 0;
                for (; i < n; i++) {
                    t += arguments[i];
                }
                return t;
              },

              //
              // Callback functions
              // If a parameter accepts a callback function, you can use the @callback
              // tag to define a callback type, then include the callback type in the
              // @param tag.
              //

              /**
               * This callback type is called \`requestCallback\` and is displayed as a global symbol.
               *
               * @callback requestCallback
               * @param {number} responseCode
               * @param {string} responseMessage
               */

              /**
               * Does something asynchronously and executes the callback on completion.
               * @param {requestCallback} cb - The callback that handles the response.
               */
              doSomethingAsynchronously(cb) {
                // code
              },

              /**
               * Returns the sum of a and b
               * @param {number} a
               * @param {number} b
               * @returns {number}
               */
              withType(a, b) {
                  return a + b;
              },

              /**
               * Returns the sum of a and b
               * @param {number} a
               * @param {number} b
               * @param {boolean} retArr If set to true, the function will return an array
               * @returns {(number|Array)} Sum of a and b or an array that contains a, b and the sum of a and b.
               */
              withMultipleType(a, b, retArr) {
                if (retArr) {
                    return [a, b, a + b];
                }
                return a + b;
              },

              /**
               * Returns the sum of a and b
               * @param {number} a
               * @param {number} b
               * @returns {Promise} Promise object represents the sum of a and b
               */
              withPromise(a, b) {
                return new Promise(function(resolve, reject) {
                  resolve(a + b);
                });
              }
            }
          };
        </script>
      `
    },
    expected: {
      methods: [
        {
          kind: 'method',
          visibility: 'public',
          description: 'Set the checkbox ID',
          keywords: [],
          name: 'set',
          params: [
            {
              type: 'string',
              name: 'id',
              description: 'The checkbox ID'
            },
            {
              type: 'string',
              name: 'name',
              description: 'The checkbox name',
              optional: true
            },
            {
              type: 'number',
              name: 'order',
              description: 'The checkbox order',
              optional: true,
              defaultValue: '1'
            },
            {
              type: [
                'string',
                'string[]'
              ],
              name: 'values',
              description: 'The checkbox values',
              optional: true
            },
            {
              type: 'any',
              name: '...rest',
              description: 'The rest options',
              optional: true
            }
          ],
          return: {
            type: 'boolean',
            description: 'True on success; ortherwise false'
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: 'Name only',
          keywords: [],
          name: 'nameOnly',
          params: [
            {
              type: 'any',
              name: 'somebody'
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: 'Name and type',
          keywords: [],
          name: 'nameAndType',
          params: [
            {
              type: 'string',
              name: 'somebody'
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: 'Name, type, and description',
          keywords: [],
          name: 'nameTypeAndDescription',
          params: [
            {
              type: 'string',
              name: 'somebody',
              description: 'Somebody\'s name.'
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: 'Name, type, and description, with a hyphen before the description',
          keywords: [],
          name: 'nameTypeAndDescriptionWithHyphen',
          params: [
            {
              type: 'string',
              name: 'somebody',
              description: 'Somebody\'s name.'
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: 'Assign the project to an employee.',
          keywords: [],
          name: 'withParameterProperties',
          params: [
            {
              type: 'Object',
              name: 'employee',
              description: 'The employee who is responsible for the project.'
            },
            {
              type: 'string',
              name: 'employee.name',
              description: 'The name of the employee.'
            },
            {
              type: 'string',
              name: 'employee.department',
              description: 'The employee\'s department.'
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: 'Assign the project to an employee.',
          keywords: [],
          name: 'withDestructuringParameter',
          params: [
            {
              type: 'Object',
              name: 'employee',
              description: 'The employee who is responsible for the project.'
            },
            {
              type: 'string',
              name: 'employee.name',
              description: 'The name of the employee.'
            },
            {
              type: 'string',
              name: 'employee.department',
              description: 'The employee\'s department.'
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: 'Assign the project to a list of employees.',
          keywords: [],
          name: 'withPropertiesOfValuesInAnArray',
          params: [
            {
              type: 'Object[]',
              name: 'employees',
              description: 'The employees who are responsible for the project.'
            },
            {
              type: 'string',
              name: 'employees[].name',
              description: 'The name of an employee.'
            },
            {
              type: 'string',
              name: 'employees[].department',
              description: 'The employee\'s department.'
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: 'An optional parameter (using JSDoc syntax)',
          keywords: [],
          name: 'withOptionalParameter',
          params: [
            {
              type: 'string',
              name: 'somebody',
              description: 'Somebody\'s name.',
              optional: true
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: 'An optional parameter and default value',
          keywords: [],
          name: 'withOptionalParameterAndDefaultValue',
          params: [
            {
              type: 'string',
              name: 'somebody',
              description: 'Somebody\'s name.',
              optional: true,
              defaultValue: 'John Doe'
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: 'Allows one type OR another type (type union)',
          keywords: [],
          name: 'withMultipleType',
          params: [
            {
              type: [
                'string',
                'string[]'
              ],
              name: 'somebody',
              description: 'Somebody\'s name, or an array of names.',
              optional: true,
              defaultValue: 'John Doe'
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: 'Allows any type',
          keywords: [],
          name: 'withAnyType',
          params: [
            {
              type: 'any',
              name: 'somebody',
              description: 'Whatever you want.'
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: 'Allows a parameter to be repeated.\nReturns the sum of all numbers passed to the function.',
          keywords: [],
          name: 'withSpreadNotation',
          params: [
            {
              type: 'number',
              name: 'num',
              description: 'A positive or negative number.',
              repeated: true
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: 'Does something asynchronously and executes the callback on completion.',
          keywords: [],
          name: 'doSomethingAsynchronously',
          params: [
            {
              type: 'requestCallback',
              name: 'cb',
              description: 'The callback that handles the response.'
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: 'Returns the sum of a and b',
          keywords: [],
          name: 'withType',
          params: [
            {
              type: 'number',
              name: 'a'
            },
            {
              type: 'number',
              name: 'b'
            }
          ],
          return: {
            type: 'number',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: 'Returns the sum of a and b',
          keywords: [],
          name: 'withMultipleType',
          params: [
            {
              type: 'number',
              name: 'a'
            },
            {
              type: 'number',
              name: 'b'
            },
            {
              type: 'boolean',
              name: 'retArr',
              description: 'If set to true, the function will return an array'
            }
          ],
          return: {
            type: [
              'number',
              'Array'
            ],
            description: 'Sum of a and b or an array that contains a, b and the sum of a and b.'
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: 'Returns the sum of a and b',
          keywords: [],
          name: 'withPromise',
          params: [
            {
              type: 'number',
              name: 'a'
            },
            {
              type: 'number',
              name: 'b'
            }
          ],
          return: {
            type: 'Promise',
            description: 'Promise object represents the sum of a and b'
          }
        }
      ]
    }
  })

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
          description: '',
          keywords: [],
          params: [
            {
              name: paramName,
              type: expectedType,
              description: '',
              declaration: '',
              defaultValue: expectedValue
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

  ComponentTestCase({
    name: 'vuedoc/md#19 - does not render default param values for function',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * Load the given \`schema\` with initial filled \`value\`
               * Use this to load async schema.
               *
               * @param {object} schema - The JSON Schema object to load
               * @param {Number|String|Array|Object|Boolean} model - The initial data for the schema.
               *
               * @Note \`model\` is not a two-way data bindings.
               * To get the form data, use the \`v-model\` directive.
               */
              load(schema, model = 'hello') {},
              /**
               * @param {object} schema - The JSON Schema object to load
               */
              withImplicitUndefinedReturn(schema) {
                return undefined;
              },
              /**
               * @param {object} schema - The JSON Schema object to load
               * @return undefined
               */
              withExplicitUndefinedReturn(schema) {},
              /**
               * @return {int} 123
               */
              withExplicitReturn() {}
            }
          };
        </script>
      `
    },
    expected: {
      methods: [
        {
          kind: 'method',
          name: 'load',
          visibility: 'public',
          description: 'Load the given `schema` with initial filled `value`\nUse this to load async schema.',
          keywords: [
            {
              name: 'Note',
              description: '`model` is not a two-way data bindings.\nTo get the form data, use the `v-model` directive.'
            }
          ],
          params: [
            {
              name: 'schema',
              type: 'object',
              description: 'The JSON Schema object to load'
            },
            {
              name: 'model',
              type: [ 'Number', 'String', 'Array', 'Object', 'Boolean' ],
              description: 'The initial data for the schema.',
              defaultValue: '"hello"'
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          name: 'withImplicitUndefinedReturn',
          visibility: 'public',
          description: '',
          keywords: [],
          params: [
            {
              name: 'schema',
              type: 'object',
              description: 'The JSON Schema object to load'
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          name: 'withExplicitUndefinedReturn',
          visibility: 'public',
          description: '',
          keywords: [],
          params: [
            {
              name: 'schema',
              type: 'object',
              description: 'The JSON Schema object to load'
            }
          ],
          return: {
            type: 'any',
            description: 'undefined'
          }
        },
        {
          kind: 'method',
          name: 'withExplicitReturn',
          visibility: 'public',
          description: '',
          keywords: [],
          params: [],
          return: {
            type: 'int',
            description: '123'
          }
        }
      ]
    }
  })
})
