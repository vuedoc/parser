import { JSDoc } from '../lib/JSDoc.js';
import { ComponentTestCase } from './lib/TestUtils.js';
import { JSDocTypeSpec } from './spec/JSDocTypeSpec.js';

/* global describe it expect */

describe('JSDoc', () => {
  describe('parseTypeParam(type)', () => {
    it('should parse JSDoc type', () => {
      const type = 'string';
      const expected = { type: 'string' };
      const result = {};

      JSDoc.parseTypeParam(type, result);
      expect(result).toEqual(expected);
    });

    it('should parse JSDoc type with pipe char', () => {
      const type = 'string|string[]';
      const expected = { type: ['string', 'string[]'] };
      const result = {};

      JSDoc.parseTypeParam(type, result);
      expect(result).toEqual(expected);
    });

    it('should parse with repeated parameter', () => {
      const type = '...number';
      const expected = { type: 'number', rest: true };
      const result = {};

      JSDoc.parseTypeParam(type, result);
      expect(result).toEqual(expected);
    });

    it('should parse with * as type', () => {
      const type = '*';
      const expected = { type: 'any' };
      const result = {};

      JSDoc.parseTypeParam(type, result);
      expect(result).toEqual(expected);
    });
  });

  describe('parseParamKeyword(text)', () => {
    it('should parse @param keyword', () => {
      const comment = '{number} x - The x value.';
      const expected = {
        type: 'number',
        name: 'x',
        description: 'The x value.',
      };
      const result = JSDoc.parseParamKeyword(comment);

      expect(result).toEqual(expected);
    });

    it('should parse @param keyword with custom param generator', () => {
      function* customParamGenerator() {
        yield { name: null, type: 'void', description: undefined, kind: 'param' };
      }

      const comment = '{number} x - The x value.';
      const expected = {
        type: 'number',
        name: 'x',
        description: 'The x value.',
        kind: 'param',
      };

      const result = JSDoc.parseParamKeyword(comment, customParamGenerator());

      expect(result).toEqual(expected);
    });

    it('should parse @param keyword with template type', () => {
      const comment = '{Record<number>} x - The x value.';
      const expected = {
        type: 'Record<number>',
        name: 'x',
        description: 'The x value.',
      };
      const result = JSDoc.parseParamKeyword(comment);

      expect(result).toEqual(expected);
    });

    it('should parse @param keyword with missing dash separator', () => {
      const comment = '{number} x  The x value.';
      const expected = {
        type: 'number',
        name: 'x',
        description: 'The x value.',
      };
      const result = JSDoc.parseParamKeyword(comment);

      expect(result).toEqual(expected);
    });

    it('should parse @param keyword with an empty type', () => {
      const comment = '{} x - The x value.';
      const expected = { type: 'unknown', name: 'x', description: 'The x value.' };
      const result = JSDoc.parseParamKeyword(comment);

      expect(result).toEqual(expected);
    });

    it('should parse @param keyword with missing type', () => {
      const comment = 'x - The x value.';
      const expected = { type: 'unknown', name: 'x', description: 'The x value.' };
      const result = JSDoc.parseParamKeyword(comment);

      expect(result).toEqual(expected);
    });

    it('should parse @param keyword with malformated input', () => {
      const comment = '{ !x=> The x value.';
      const expected = { type: 'unknown', name: null, description: undefined };
      const result = JSDoc.parseParamKeyword(comment);

      expect(result).toEqual(expected);
    });

    it('should parse @param keyword with rest parameter', () => {
      const comment = '{...number} num - A positive or negative number.';
      const expected = {
        type: 'number',
        name: 'num',
        description: 'A positive or negative number.',
        rest: true,
      };
      const result = JSDoc.parseParamKeyword(comment);

      expect(result).toEqual(expected);
    });

    it('should parse @param keyword with any type', () => {
      const comment = '{*} somebody - Whatever you want.';
      const expected = {
        type: 'any',
        name: 'somebody',
        description: 'Whatever you want.',
      };
      const result = JSDoc.parseParamKeyword(comment);

      expect(result).toEqual(expected);
    });

    it('should parse @param with no descriptions', () => {
      const comment = '{any} somebody';
      const expected = {
        type: 'any',
        name: 'somebody',
        description: undefined,
      };
      const result = JSDoc.parseParamKeyword(comment);

      expect(result).toEqual(expected);
    });
  });

  describe('parseReturnsKeyword(text)', () => {
    it('should parse with just a type', () => {
      const comment = '{number}';
      const expected = { type: 'number', description: undefined };
      const result = JSDoc.parseReturnsKeyword(comment);

      expect(result).toEqual(expected);
    });

    it('should parse with just a template type', () => {
      const comment = '{Record<number>}';
      const expected = { type: 'Record<number>', description: undefined };
      const result = JSDoc.parseReturnsKeyword(comment);

      expect(result).toEqual(expected);
    });

    it('should parse with just a complex template type', () => {
      const comment = '{Record<number,string>}';
      const expected = { type: 'Record<number,string>', description: undefined };
      const result = JSDoc.parseReturnsKeyword(comment);

      expect(result).toEqual(expected);
    });

    it('should parse with just a complex template type (2)', () => {
      const comment = '{Record<number, string>}';
      const expected = { type: 'Record<number, string>', description: undefined };
      const result = JSDoc.parseReturnsKeyword(comment);

      expect(result).toEqual(expected);
    });

    it('should parse with just a complex template type (3)', () => {
      const comment = '{Record<number, string[]>}';
      const expected = { type: 'Record<number, string[]>', description: undefined };
      const result = JSDoc.parseReturnsKeyword(comment);

      expect(result).toEqual(expected);
    });

    it('should parse with just a complex template type (4)', () => {
      const comment = '{Record<T, K extends keyof T>}';
      const expected = { type: 'Record<T, K extends keyof T>', description: undefined };
      const result = JSDoc.parseReturnsKeyword(comment);

      expect(result).toEqual(expected);
    });

    it('should parse with just a complex template type (5)', () => {
      const comment = '{{new(): T; }}';
      const expected = { type: '{new(): T; }', description: undefined };
      const result = JSDoc.parseReturnsKeyword(comment);

      expect(result).toEqual(expected);
    });

    it('should parse with just a complex template type (6)', () => {
      const comment = '{new () => A}';
      const expected = { type: 'new () => A', description: undefined };
      const result = JSDoc.parseReturnsKeyword(comment);

      expect(result).toEqual(expected);
    });

    it('should parse @return keyword', () => {
      const comment = '{number} The x+y value.';
      const expected = { type: 'number', description: 'The x+y value.' };
      const result = JSDoc.parseReturnsKeyword(comment);

      expect(result).toEqual(expected);
    });

    it('should parse @return keyword with an empty retuning type', () => {
      const comment = '{} The x+y value.';
      const expected = { type: 'unknown', description: 'The x+y value.' };
      const result = JSDoc.parseReturnsKeyword(comment);

      expect(result).toEqual(expected);
    });

    it('should parse @return keyword with missing retuning type', () => {
      const comment = 'The x+y value.';
      const expected = { type: 'unknown', description: 'The x+y value.' };
      const result = JSDoc.parseReturnsKeyword(comment);

      expect(result).toEqual(expected);
    });

    it('should parse @return keyword with malformated input', () => {
      const comment = '';
      const expected = { type: 'unknown', description: undefined };
      const result = JSDoc.parseReturnsKeyword(comment);

      expect(result).toEqual(expected);
    });
  });

  JSDocTypeSpec.forEach(({ name, values, expected = values }) => {
    describe(`@type: ${name}`, () => {
      values.forEach((value, index) => {
        const description1 = `{${value}}`;
        const description2 = `${value}`;

        it(`JSDoc.parseType('${description1}')`, () => {
          expect(JSDoc.parseType(description1)).toEqual(expected[index]);
        });

        it(`JSDoc.parseType('${description2}')`, () => {
          expect(JSDoc.parseType(description2)).toEqual(expected[index]);
        });
      });
    });
  });

  ComponentTestCase({
    name: '@param and @return',
    description: 'Generic usage',
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
               * @param {...any} [rest] - The rest options
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
            }
          };
        </script>
      `,
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'set(id: string, name?: string, order?: number = 1, values?: string | string[], ...rest: any[]): boolean',
          ],
          visibility: 'public',
          category: undefined,
          description: 'Set the checkbox ID',
          keywords: [],
          name: 'set',
          params: [
            {
              type: 'string',
              name: 'id',
              description: 'The checkbox ID',
              defaultValue: undefined,
              rest: false,
            },
            {
              type: 'string',
              name: 'name',
              description: 'The checkbox name',
              defaultValue: undefined,
              optional: true,
              rest: false,
            },
            {
              type: 'number',
              name: 'order',
              description: 'The checkbox order',
              optional: true,
              defaultValue: '1',
              rest: false,
            },
            {
              type: [
                'string',
                'string[]',
              ],
              name: 'values',
              description: 'The checkbox values',
              defaultValue: undefined,
              optional: true,
              rest: false,
            },
            {
              type: 'any[]',
              name: 'rest',
              description: 'The rest options',
              defaultValue: undefined,
              optional: true,
              rest: true,
            },
          ],
          returns: {
            type: 'boolean',
            description: 'True on success; ortherwise false',
          },
        },
      ],
    },
  });

  // Names, types, and descriptions
  // The following examples show how to include names, types, and
  // descriptions in a @param tag.
  ComponentTestCase({
    name: '@param',
    description: 'Name only',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * Name only
               * @param somebody
               */
              nameOnly(somebody) {
                alert('Hello ' + somebody);
              },
            }
          };
        </script>
      `,
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'nameOnly(somebody: unknown): void',
          ],
          visibility: 'public',
          category: undefined,
          description: 'Name only',
          keywords: [],
          name: 'nameOnly',
          params: [
            {
              type: 'unknown',
              name: 'somebody',
              description: undefined,
              defaultValue: undefined,
              rest: false,
            },
          ],
          returns: {
            type: 'void',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@param',
    description: 'Name and type',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * Name and type
               * @param {string} somebody
               */
              nameAndType(somebody) {
                alert('Hello ' + somebody);
              },
            }
          };
        </script>
      `,
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'nameAndType(somebody: string): void',
          ],
          visibility: 'public',
          category: undefined,
          description: 'Name and type',
          keywords: [],
          name: 'nameAndType',
          params: [
            {
              type: 'string',
              name: 'somebody',
              description: undefined,
              defaultValue: undefined,
              rest: false,
            },
          ],
          returns: {
            type: 'void',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@param',
    description: 'Name, type, and description',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * Name, type, and description
               * @param {string} somebody Somebody's name.
               */
              nameTypeAndDescription(somebody) {
                alert('Hello ' + somebody);
              },
            }
          };
        </script>
      `,
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'nameTypeAndDescription(somebody: string): void',
          ],
          visibility: 'public',
          category: undefined,
          description: 'Name, type, and description',
          keywords: [],
          name: 'nameTypeAndDescription',
          params: [
            {
              type: 'string',
              name: 'somebody',
              description: 'Somebody\'s name.',
              defaultValue: undefined,
              rest: false,
            },
          ],
          returns: {
            type: 'void',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@param',
    description: 'Name, type, and description, with a hyphen before the description',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * Name, type, and description, with a hyphen before the description
               * @param {string} somebody - Somebody's name.
               */
              nameTypeAndDescriptionWithHyphen(somebody) {
                alert('Hello ' + somebody);
              },
            }
          };
        </script>
      `,
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'nameTypeAndDescriptionWithHyphen(somebody: string): void',
          ],
          visibility: 'public',
          category: undefined,
          description: 'Name, type, and description, with a hyphen before the description',
          keywords: [],
          name: 'nameTypeAndDescriptionWithHyphen',
          params: [
            {
              type: 'string',
              name: 'somebody',
              description: 'Somebody\'s name.',
              defaultValue: undefined,
              rest: false,
            },
          ],
          returns: {
            type: 'void',
            description: undefined,
          },
        },
      ],
    },
  });

  // Documenting a parameter's properties
  // If a parameter is expected to have a specific property, you can
  // document that property by providing an additional @param tag. For
  // example, if an employee parameter is expected to have name and
  // department properties, you can document it as follows:
  ComponentTestCase({
    name: '@param',
    description: 'With parameter properties',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * Assign the project to an employee.
               * @param {Object} employee - The employee who is responsible for the project.
               * @param {string} employee.name - The name of the employee.
               * @param {string} employee.department - The employee's department.
               */
              withParameterProperties(employee) {
                // ...
              },
            }
          };
        </script>
      `,
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'withParameterProperties(employee: Object): void',
          ],
          visibility: 'public',
          category: undefined,
          description: 'Assign the project to an employee.',
          keywords: [],
          name: 'withParameterProperties',
          params: [
            {
              type: 'Object',
              name: 'employee',
              description: 'The employee who is responsible for the project.',
              defaultValue: undefined,
              rest: false,
            },
            {
              type: 'string',
              name: 'employee.name',
              description: 'The name of the employee.',
              defaultValue: undefined,
              rest: false,
            },
            {
              type: 'string',
              name: 'employee.department',
              description: 'The employee\'s department.',
              defaultValue: undefined,
              rest: false,
            },
          ],
          returns: {
            type: 'void',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@param',
    description: 'With destructuring parameter',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * Assign the project to an employee.
               * @param {Object} employee - The employee who is responsible for the project.
               * @param {string} employee.name - The name of the employee.
               * @param {string} employee.department - The employee's department.
               */
              withDestructuringParameter({ name, department }) {
                // ...
              },
            }
          };
        </script>
      `,
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'withDestructuringParameter(employee: Object): void',
          ],
          visibility: 'public',
          category: undefined,
          description: 'Assign the project to an employee.',
          keywords: [],
          name: 'withDestructuringParameter',
          params: [
            {
              type: 'Object',
              name: 'employee',
              description: 'The employee who is responsible for the project.',
              defaultValue: undefined,
              rest: false,
            },
            {
              type: 'string',
              name: 'employee.name',
              description: 'The name of the employee.',
              defaultValue: undefined,
              rest: false,
            },
            {
              type: 'string',
              name: 'employee.department',
              description: 'The employee\'s department.',
              defaultValue: undefined,
              rest: false,
            },
          ],
          returns: {
            type: 'void',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@param',
    description: 'With properties of values in an array',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * Assign the project to a list of employees.
               * @param {Object[]} employees - The employees who are responsible for the project.
               * @param {string} employees[].name - The name of an employee.
               * @param {string} employees[].department - The employee's department.
               */
              withPropertiesOfValuesInAnArray(employees) {
                // ...
              },
            }
          };
        </script>
      `,
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'withPropertiesOfValuesInAnArray(employees: Object[]): void',
          ],
          visibility: 'public',
          category: undefined,
          description: 'Assign the project to a list of employees.',
          keywords: [],
          name: 'withPropertiesOfValuesInAnArray',
          params: [
            {
              type: 'Object[]',
              name: 'employees',
              description: 'The employees who are responsible for the project.',
              defaultValue: undefined,
              rest: false,
            },
            {
              type: 'string',
              name: 'employees[].name',
              description: 'The name of an employee.',
              defaultValue: undefined,
              rest: false,
            },
            {
              type: 'string',
              name: 'employees[].department',
              description: 'The employee\'s department.',
              defaultValue: undefined,
              rest: false,
            },
          ],
          returns: {
            type: 'void',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@param',
    description: 'An optional parameter',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
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
            }
          };
        </script>
      `,
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'withOptionalParameter(somebody?: string): void',
          ],
          visibility: 'public',
          category: undefined,
          description: 'An optional parameter (using JSDoc syntax)',
          keywords: [],
          name: 'withOptionalParameter',
          params: [
            {
              type: 'string',
              name: 'somebody',
              description: 'Somebody\'s name.',
              defaultValue: undefined,
              optional: true,
              rest: false,
            },
          ],
          returns: {
            type: 'void',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@param',
    description: 'An optional parameter and default value',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * An optional parameter and default value
              * @param {string} [somebody="John Doe"] - Somebody's name.
              */
              withOptionalParameterAndDefaultValue(somebody) {
                  if (!somebody) {
                      somebody = 'John Doe';
                  }
                  alert('Hello ' + somebody);
              },
            }
          };
        </script>
      `,
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'withOptionalParameterAndDefaultValue(somebody?: string = "John Doe"): void',
          ],
          visibility: 'public',
          category: undefined,
          description: 'An optional parameter and default value',
          keywords: [],
          name: 'withOptionalParameterAndDefaultValue',
          params: [
            {
              type: 'string',
              name: 'somebody',
              description: 'Somebody\'s name.',
              optional: true,
              defaultValue: '"John Doe"',
              rest: false,
            },
          ],
          returns: {
            type: 'void',
            description: undefined,
          },
        },
      ],
    },
  });

  // Multiple types and repeatable parameters
  // The following examples show how to use type expressions to indicate
  // that a parameter can accept multiple types (or any type), and that a
  // parameter can be provided more than once. See the @type tag
  // documentation for details about the type expressions that JSDoc
  // supports.
  ComponentTestCase({
    name: '@param',
    description: 'Allows one type OR another type (type union)',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * Allows one type OR another type (type union)
               * @param {(string|string[])} [somebody="John Doe"] - Somebody's name, or an array of names.
               */
              withMultipleType(somebody) {
                if (!somebody) {
                  somebody = 'John Doe';
                } else if (Array.isArray(somebody)) {
                  somebody = somebody.join(', ');
                }

                alert('Hello ' + somebody);
              },
            }
          };
        </script>
      `,
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'withMultipleType(somebody?: string | string[] = "John Doe"): void',
          ],
          visibility: 'public',
          category: undefined,
          description: 'Allows one type OR another type (type union)',
          keywords: [],
          name: 'withMultipleType',
          params: [
            {
              type: [
                'string',
                'string[]',
              ],
              name: 'somebody',
              description: 'Somebody\'s name, or an array of names.',
              optional: true,
              defaultValue: '"John Doe"',
              rest: false,
            },
          ],
          returns: {
            type: 'void',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@param',
    description: 'Allows any type',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * Allows any type
               * @param {*} somebody - Whatever you want.
               */
              withAnyType(somebody) {
                console.log('Hello ' + JSON.stringify(somebody));
              },
            }
          };
        </script>
      `,
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'withAnyType(somebody: any): void',
          ],
          visibility: 'public',
          category: undefined,
          description: 'Allows any type',
          keywords: [],
          name: 'withAnyType',
          params: [
            {
              type: 'any',
              name: 'somebody',
              description: 'Whatever you want.',
              defaultValue: undefined,
              rest: false,
            },
          ],
          returns: {
            type: 'void',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@param',
    description: 'Allows a parameter to be repeated',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
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
            }
          };
        </script>
      `,
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'withSpreadNotation(...num: number[]): unknown',
          ],
          visibility: 'public',
          category: undefined,
          description: 'Allows a parameter to be repeated.\nReturns the sum of all numbers passed to the function.',
          keywords: [],
          name: 'withSpreadNotation',
          params: [
            {
              type: 'number[]',
              name: 'num',
              description: 'A positive or negative number.',
              defaultValue: undefined,
              rest: true,
            },
          ],
          returns: {
            type: 'unknown',
            description: undefined,
          },
        },
      ],
    },
  });

  // Callback functions
  // If a parameter accepts a callback function, you can use the @callback
  // tag to define a callback type, then include the callback type in the
  // @param tag.
  ComponentTestCase({
    name: '@param',
    description: '@callback',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
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
            }
          };
        </script>
      `,
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'doSomethingAsynchronously(cb: requestCallback): void',
          ],
          visibility: 'public',
          category: undefined,
          description: 'Does something asynchronously and executes the callback on completion.',
          keywords: [],
          name: 'doSomethingAsynchronously',
          params: [
            {
              type: 'requestCallback',
              name: 'cb',
              description: 'The callback that handles the response.',
              defaultValue: undefined,
              rest: false,
            },
          ],
          returns: {
            type: 'void',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@returns',
    description: 'With type',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * Returns the sum of a and b
               * @param {number} a
               * @param {number} b
               * @returns {number}
               */
              withType(a, b) {
                  return a + b;
              },
            }
          };
        </script>
      `,
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'withType(a: number, b: number): number',
          ],
          visibility: 'public',
          category: undefined,
          description: 'Returns the sum of a and b',
          keywords: [],
          name: 'withType',
          params: [
            {
              type: 'number',
              name: 'a',
              description: undefined,
              defaultValue: undefined,
              rest: false,
            },
            {
              type: 'number',
              name: 'b',
              description: undefined,
              defaultValue: undefined,
              rest: false,
            },
          ],
          returns: {
            type: 'number',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@returns',
    description: 'With union type',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
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
            }
          };
        </script>
      `,
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'withMultipleType(a: number, b: number, retArr: boolean): number | Array',
          ],
          visibility: 'public',
          category: undefined,
          description: 'Returns the sum of a and b',
          keywords: [],
          name: 'withMultipleType',
          params: [
            {
              type: 'number',
              name: 'a',
              description: undefined,
              defaultValue: undefined,
              rest: false,
            },
            {
              type: 'number',
              name: 'b',
              description: undefined,
              defaultValue: undefined,
              rest: false,
            },
            {
              type: 'boolean',
              name: 'retArr',
              description: 'If set to true, the function will return an array',
              defaultValue: undefined,
              rest: false,
            },
          ],
          returns: {
            type: [
              'number',
              'Array',
            ],
            description: 'Sum of a and b or an array that contains a, b and the sum of a and b.',
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@returns',
    description: 'With promise',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
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
              },
            }
          };
        </script>
      `,
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'withPromise(a: number, b: number): Promise',
          ],
          visibility: 'public',
          category: undefined,
          description: 'Returns the sum of a and b',
          keywords: [],
          name: 'withPromise',
          params: [
            {
              type: 'number',
              name: 'a',
              description: undefined,
              defaultValue: undefined,
              rest: false,
            },
            {
              type: 'number',
              name: 'b',
              description: undefined,
              defaultValue: undefined,
              rest: false,
            },
          ],
          returns: {
            type: 'Promise',
            description: 'Promise object represents the sum of a and b',
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@returns',
    description: 'With spread param',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * Returns the sum of a and b
               * @param {number} a
               * @param {number} b
               * @returns {Promise} Promise object represents the sum of a and b
               */
              withSpreadParam(a, ...b) {
                return new Promise(function(resolve, reject) {
                  resolve(a + b);
                });
              }
            }
          };
        </script>
      `,
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'withSpreadParam(a: number, ...b: number[]): Promise',
          ],
          visibility: 'public',
          category: undefined,
          description: 'Returns the sum of a and b',
          keywords: [],
          name: 'withSpreadParam',
          params: [
            {
              type: 'number',
              name: 'a',
              description: undefined,
              defaultValue: undefined,
              rest: false,
            },
            {
              type: 'number[]',
              name: 'b',
              description: undefined,
              defaultValue: undefined,
              rest: true,
            },
          ],
          returns: {
            type: 'Promise',
            description: 'Promise object represents the sum of a and b',
          },
        },
      ],
    },
  });
});
