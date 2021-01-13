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
    name: 'Automatic type detection',
    options: {
      filecontent: `
        <script?>
          export default Vue.extend({
            data: () => ({
              a: 1,
              b: true,
              c: null,
              d: 'hello',
              e: \`hello\`,
              f: /ab/,
              g: 100n,
              h: ~1,
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
          type: 'number',
          initialValue: '1',
          name: 'a',
        },
        {
          kind: 'data',
          visibility: 'public',
          category: undefined,
          version: undefined,
          description: undefined,
          keywords: [],
          type: 'boolean',
          initialValue: 'true',
          name: 'b',
        },
        {
          kind: 'data',
          visibility: 'public',
          category: undefined,
          version: undefined,
          description: undefined,
          keywords: [],
          type: 'unknow',
          initialValue: 'null',
          name: 'c',
        },
        {
          kind: 'data',
          visibility: 'public',
          category: undefined,
          version: undefined,
          description: undefined,
          keywords: [],
          type: 'string',
          initialValue: '"hello"',
          name: 'd',
        },
        {
          kind: 'data',
          visibility: 'public',
          category: undefined,
          version: undefined,
          description: undefined,
          keywords: [],
          type: 'string',
          initialValue: '`hello`',
          name: 'e',
        },
        {
          kind: 'data',
          visibility: 'public',
          category: undefined,
          version: undefined,
          description: undefined,
          keywords: [],
          type: 'regexp',
          initialValue: '/ab/',
          name: 'f',
        },
        {
          kind: 'data',
          visibility: 'public',
          category: undefined,
          version: undefined,
          description: undefined,
          keywords: [],
          type: 'bigint',
          initialValue: '100n',
          name: 'g',
        },
        {
          kind: 'data',
          visibility: 'public',
          category: undefined,
          version: undefined,
          description: undefined,
          keywords: [],
          type: 'binary',
          initialValue: '~1',
          name: 'h',
        },
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
              // data x
              x: {} as Record<string, number>
            } as any)
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
          description: 'data x',
          keywords: [],
          type: 'Record<string, number>',
          initialValue: '{}',
          name: 'x',
        },
      ]
    }
  });
});
