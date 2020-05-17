const { ComponentTestCase } = require('./lib/TestUtils')

/* global describe */

describe('ScriptParser', () => {
  ComponentTestCase({
    name: 'Accorn parsing error',
    options: {
      filecontent: `
        <script>
          var != mù*! invalid syntax
        </script>
      `
    },
    expected: {
      errors: [
        'Unexpected token (2:4)'
      ]
    }
  })

  ComponentTestCase({
    name: 'parseComment() with disbaled description',
    options: {
      features: [ 'keywords' ],
      filecontent: `
        <script>
          /**
           * Disabled description
           */
          export default {}
        </script>
      `
    },
    expected: {
      description: undefined,
      keywords: [],
      errors: []
    }
  })

  ComponentTestCase({
    name: 'parseComment() with disabled keywords',
    options: {
      features: [ 'description' ],
      filecontent: `
        <script>
          /**
           * Component description
           */
          export default {}
        </script>
      `
    },
    expected: {
      description: 'Component description',
      keywords: undefined,
      errors: []
    }
  })

  ComponentTestCase({
    name: 'Handle keyword @name prior than the component name',
    options: {
      filecontent: `
        <script>
          /**
           * @name my-checkbox
           */
          export default {
            name: MethodThatIsHandledAsUndefined()
          }
        </script>
      `
    },
    expected: {
      name: 'my-checkbox'
    }
  })

  ComponentTestCase({
    name: 'with undefined references',
    options: {
      filecontent: `
        <script>
          export default {
            name: MethodThatIsHandledAsUndefined(),
            props: {
              somePropCall: MethodThanReturnAString(),
              somePropRef: CallsSomeOtherMethod,
            },
            methods: {
              someMethodCall: MethodThatReturnAFunction(),
              someMethodRef: CallsSomeOtherMethod
            }
          }
        </script>
      `
    },
    expected: {
      name: '__undefined__',
      props: [
        {
          kind: 'prop',
          name: 'some-prop-call',
          type: '__undefined__',
          visibility: 'public',
          description: '',
          keywords: [],
          default: '__undefined__',
          nativeType: '__undefined__',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          name: 'some-prop-ref',
          type: 'CallsSomeOtherMethod',
          visibility: 'public',
          description: '',
          keywords: [],
          default: '__undefined__',
          nativeType: '__undefined__',
          required: false,
          describeModel: false
        }
      ],
      methods: [
        {
          kind: 'method',
          name: 'someMethodCall',
          visibility: 'public',
          description: '',
          keywords: [],
          params: [],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          name: 'someMethodRef',
          visibility: 'public',
          description: '',
          keywords: [],
          params: [],
          return: {
            type: 'void',
            description: ''
          }
        }
      ]
    }
  })

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
              load(schema, model = 'hello') {}
            }
          }
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
        }
      ]
    }
  })
})
