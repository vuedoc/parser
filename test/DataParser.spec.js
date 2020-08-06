/* eslint-disable max-len */
/* global describe */

const { ComponentTestCase } = require('./lib/TestUtils')

describe('DataParser', () => {
  ComponentTestCase({
    name: 'Data with empty value',
    options: {
      filecontent: `
        <script>
          export default {
            data: () => ({
              initialValue: ''
            })
          }
        </script>
      `
    },
    expected: {
      data: [
        {
          description: '',
          keywords: [],
          kind: 'data',
          name: 'initialValue',
          initialValue: '',
          type: 'string',
          visibility: 'public' }
      ]
    }
  })

  ComponentTestCase({
    name: 'Data with empty value with stringify',
    options: {
      stringify: true,
      filecontent: `
        <script>
          export default {
            data: () => ({
              initialValue: ''
            })
          }
        </script>
      `
    },
    expected: {
      data: [
        {
          description: '',
          keywords: [],
          kind: 'data',
          name: 'initialValue',
          initialValue: '""',
          type: 'string',
          visibility: 'public' }
      ]
    }
  })
})
