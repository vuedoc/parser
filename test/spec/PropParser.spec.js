import { describe, expect, it } from 'vitest';

describe('PropParser', () => {
  it('Props with @type', async () => {
    const options = {
      filecontent: `
        <script>
          export default {
            name: 'TextInput',
            props: {
              /**
               * The input format callback
               * @type TextInput.FormatCallback
               */
              format: {
                type: Function
              }
            }
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      props: [
        {
          describeModel: false,
          description: 'The input format callback',
          keywords: [],
          kind: 'prop',
          name: 'format',
          required: false,
          type: 'TextInput.FormatCallback',
          visibility: 'public',
        },
      ],
    });
  });

  it('Props with @default', async () => {
    const options = {
      filecontent: `
        <script>
          export default {
            name: 'TextInput',
            props: {
              /**
               * The input format callback
               * @default value.trim()
               */
              format: {
                type: Function,
                default: (value = '') => \`\${value}\`.trim()
              }
            }
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      props: [
        {
          default: 'value.trim()',
          describeModel: false,
          description: 'The input format callback',
          keywords: [],
          kind: 'prop',
          name: 'format',
          required: false,
          type: 'function',
          visibility: 'public',
        },
      ],
    });
  });

  it('Props with multiple @type', async () => {
    const options = {
      filecontent: `
        <script>
          export default {
            props: {
              /**
               * @type ComplexObject
               * @type Complex.Object
               */
              complex: Object
            }
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      props: [
        {
          describeModel: false,
          keywords: [],
          kind: 'prop',
          name: 'complex',
          required: false,
          type: 'Complex.Object',
          visibility: 'public',
        },
      ],
    });
  });

  it('Props with multiple @default', async () => {
    const options = {
      filecontent: `
        <script>
          export default {
            props: {
              /**
               * Custom default value with @default keyword.
               * Only the last defined keyword will be used
               * @default { key: 'value' }
               * @default { last: 'keyword' }
               */
              complex: {
                type: Object,
                default: () => {
                  // complex operations
                  return complexOperationsResultObject
                }
              }
            }
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      props: [
        {
          default: '{ last: \'keyword\' }',
          describeModel: false,
          category: undefined,
          description: 'Custom default value with @default keyword.\nOnly the last defined keyword will be used',
          keywords: [],
          kind: 'prop',
          name: 'complex',
          required: false,
          type: 'object',
          visibility: 'public' },
      ],
    });
  });

  it('Falsy default value', async () => {
    const options = {
      filecontent: `
          <script>
            export default {
              props: {
                disabled: { type: Boolean, default: false }
              }
            }
          </script>
        `,
    };

    await expect(options).toParseAs({
      props: [
        {
          default: 'false',
          describeModel: false,
          keywords: [],
          kind: 'prop',
          name: 'disabled',
          required: false,
          type: 'boolean',
          visibility: 'public',
        },
      ],
    });
  });

  it('with multiple types', async () => {
    const options = {
      filecontent: `
        <script>
          export default {
            props: {
              disabled: [Boolean, Number]
            }
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      props: [
        {
          describeModel: false,
          keywords: [],
          kind: 'prop',
          name: 'disabled',
          required: false,
          type: [
            'boolean',
            'number',
          ],
          visibility: 'public',
        },
      ],
    });
  });

  it('@kind function', async () => {
    const options = {
      filecontent: `
        <script>
          export default {
            props: {
              /**
               * @default identity function
               * @kind function
               * @syntax regexObj.exec(str: string): any[]
               * @param {string} x - the x param description
               * @returns the return value description
               */
              functionPropWithDefaultAsKeyword: {
                type: Function,
                default: (x) => x
              },
              /**
               * The input validation function
               * @kind function
               * @param {any} value - User input value to validate
               * @returns {boolean} - \`true\` if validation succeeds; \`false\` otherwise.
               */
              validator: {
                type: Function,
                default: (value) => !Number.isNaN(value)
              },
            }
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      props: [
        {
          default: 'identity function',
          describeModel: false,
          keywords: [],
          kind: 'prop',
          name: 'function-prop-with-default-as-keyword',
          required: false,
          type: 'function',
          visibility: 'public',
          function: {
            name: 'functionPropWithDefaultAsKeyword',
            keywords: [],
            syntax: [
              'regexObj.exec(str: string): any[]',
            ],
            params: [
              {
                name: 'x',
                type: 'string',
                description: 'the x param description',
                rest: false,
              },
            ],
            returns: {
              type: 'unknown',
              description: 'the return value description',
            },
          },
        },
        {
          default: '(value) => !Number.isNaN(value)',
          describeModel: false,
          description: 'The input validation function',
          keywords: [],
          kind: 'prop',
          name: 'validator',
          required: false,
          type: 'function',
          visibility: 'public',
          function: {
            name: 'validator',
            description: 'The input validation function',
            keywords: [],
            syntax: [
              'function validator(value: any): boolean',
            ],
            params: [
              {
                name: 'value',
                type: 'any',
                description: 'User input value to validate',
                rest: false,
              },
            ],
            returns: {
              type: 'boolean',
              description: '`true` if validation succeeds; `false` otherwise.',
            },
          },
        },
      ],
    });
  });

  it('TSAsExpression', async () => {
    const options = {
      filecontent: `
        <script lang='ts'>
            import mixins         from 'vue-typed-mixins'
            import {PropOptions}  from 'vue'

            const Vue = mixins()
            export default Vue.extend({
                name: "TestComponent",
                props: {
                  testProp: {
                      type: Object as PropOptions<Record<string, any>>,
                      default: () => ({
                          a: 1,
                          b: 2,
                      })
                  },
                  testProp2: {
                      type: Array as number[],
                      default: () => [1,2]
                  },
                  testProp3: {
                      type: Object as PropOptions<any>,
                      default: () => {
                        return {
                          a: 1,
                          b: 2,
                        };
                      }
                  },
                  testProp4: {
                      type: Object as PropOptions<any>,
                      default: function() {
                        return {
                          a: 1,
                          b: 2,
                        };
                      }
                  },
                  testProp5: {
                      type: Object as PropOptions<any>,
                      default() {
                        const x = 1;

                        return {
                          a: x,
                          b: 2,
                        };
                      }
                  },
                }
            })
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      name: 'TestComponent',
      props: [
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          type: 'Record<string, any>',
          default: '{"a":1,"b":2}',
          name: 'test-prop',
          describeModel: false,
          required: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          type: 'number[]',
          default: '[1,2]',
          name: 'test-prop2',
          describeModel: false,
          required: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          type: 'any',
          default: '{"a":1,"b":2}',
          name: 'test-prop3',
          describeModel: false,
          required: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          type: 'any',
          default: '{"a":1,"b":2}',
          name: 'test-prop4',
          describeModel: false,
          required: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          type: 'any',
          name: 'test-prop5',
          describeModel: false,
          required: false,
        },
      ],
    });
  });

  it('Multiline type', async () => {
    const options = {
      filecontent: `
        <script lang="ts">
          import mixins         from 'vue-typed-mixins'
          import {PropType}  from 'vue'

          const Vue = mixins()
          export default Vue.extend({
            name: "TestComponent",
            props: {
              /**
               * private get context(): void {}
               */
              contextFactory: {
                type: Function as (selectedItemsData: Array<any>) => Array<any>,
              },
              contextFactory2: {
                type: Function as PropType<FactoryFunction>,
              },
              menuFactory: {
                type: Function,
              } as PropOptions<(selectedItemsData: Array<any>) => Array<IContextMenuItem<any>>>,
              menuFactoryMultiline: {
                type: Function as (
                  selectedItemsData: Array<any>
                ) => Array<IContextMenuItem<any>>,
                default: new Function(),
              },
              menuFactoryMultiline2: {
                type: Function as (
                  selectedItemsData: Array<any>
                ) => Array<IContextMenuItem<any>>,
                default: function test() { return 1 },
              },
            }
          })
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      name: 'TestComponent',
      props: [
        {
          kind: 'prop',
          visibility: 'public',
          description: 'private get context(): void {}',
          keywords: [],
          type: '(selectedItemsData: Array<any>) => Array<any>',
          name: 'context-factory',
          describeModel: false,
          required: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          type: 'FactoryFunction',
          name: 'context-factory2',
          describeModel: false,
          required: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          type: '(selectedItemsData: Array<any>) => Array<IContextMenuItem<any>>',
          name: 'menu-factory',
          describeModel: false,
          required: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          type: '(selectedItemsData: Array<any>) => Array<IContextMenuItem<any>>',
          default: 'new Function()',
          name: 'menu-factory-multiline',
          describeModel: false,
          required: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          type: '(selectedItemsData: Array<any>) => Array<IContextMenuItem<any>>',
          default: 'function() { return 1 }',
          name: 'menu-factory-multiline2',
          describeModel: false,
          required: false,
        },
      ],
    });
  });
});
