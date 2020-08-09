/* eslint-disable max-len */
/* global describe */

const { ComponentTestCase } = require('./lib/TestUtils')

describe('PropParser', () => {
  ComponentTestCase({
    name: 'Props with @type',
    options: {
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
      `
    },
    expected: {
      props: [
        {
          default: undefined,
          describeModel: false,
          category: null,
          description: 'The input format callback',
          keywords: [],
          kind: 'prop',
          name: 'format',
          required: false,
          type: 'TextInput.FormatCallback',
          visibility: 'public' }
      ]
    }
  })

  ComponentTestCase({
    name: 'Props with @default',
    options: {
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
      `
    },
    expected: {
      props: [
        {
          default: 'value.trim()',
          describeModel: false,
          category: null,
          description: 'The input format callback',
          keywords: [],
          kind: 'prop',
          name: 'format',
          required: false,
          type: 'Function',
          visibility: 'public' }
      ]
    }
  })

  ComponentTestCase({
    name: 'Props with multiple @type',
    options: {
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
      `
    },
    expected: {
      props: [
        {
          default: undefined,
          describeModel: false,
          category: null,
          description: '',
          keywords: [],
          kind: 'prop',
          name: 'complex',
          required: false,
          type: 'Complex.Object',
          visibility: 'public' }
      ]
    }
  })

  ComponentTestCase({
    name: 'Props with multiple @default',
    options: {
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
      `
    },
    expected: {
      props: [
        {
          default: '{ last: \'keyword\' }',
          describeModel: false,
          category: null,
          description: 'Custom default value with @default keyword.\nOnly the last defined keyword will be used',
          keywords: [],
          kind: 'prop',
          name: 'complex',
          required: false,
          type: 'Object',
          visibility: 'public' }
      ]
    }
  })

  ComponentTestCase({
    name: 'Falsy default value',
    options: {
      filecontent: `
        <script>
          export default {
            props: {
              disabled: { type: Boolean, default: false }
            }
          }
        </script>
      `
    },
    expected: {
      props: [
        {
          default: 'false',
          describeModel: false,
          category: null,
          description: '',
          keywords: [],
          kind: 'prop',
          name: 'disabled',
          required: false,
          type: 'Boolean',
          visibility: 'public' }
      ]
    }
  })
})
