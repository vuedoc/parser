/* eslint-disable max-len */
/* global describe */

const { ComponentTestCase } = require('./lib/TestUtils');

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
          category: undefined,
          description: undefined,
          keywords: [],
          kind: 'data',
          name: 'initialValue',
          initialValue: '""',
          type: 'string',
          visibility: 'public' }
      ]
    }
  });

  ComponentTestCase({
    name: 'TSAsExpression',
    options: {
      filecontent: `
        <script lang='ts'>
          export default Vue.extend({
            data: () => ({
              x: {} as Record<string, number>
            })
          })
        </script>
      `
    },
    expected: {
      errors: [],
      data: [
        {
          kind: 'data',
          visibility: 'public',
          category: undefined,
          version: undefined,
          description: undefined,
          keywords: [],
          type: 'Record<string, number>',
          initialValue: '{}',
          name: 'x',
        },
      ]
    }
  });
});
