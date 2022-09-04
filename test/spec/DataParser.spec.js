import { describe, expect, it } from 'vitest';

describe('DataParser', () => {
  it('Data with empty value', async () => {
    const options = {
      filecontent: `
          <script>
            export default {
              data: () => ({
                initialValue: ''
              })
            }
          </script>
        `,
    };

    await expect(options).toParseAs({
      data: [
        {
          keywords: [],
          kind: 'data',
          name: 'initialValue',
          initialValue: '""',
          type: 'string',
          visibility: 'public',
        },
      ],
    });
  });

  it('Automatic type detection', async () => {
    const options = {
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
        `,
    };

    await expect(options).toParseAs({
      errors: [],
      data: [
        {
          kind: 'data',
          visibility: 'public',
          keywords: [],
          type: 'number',
          initialValue: '1',
          name: 'a',
        },
        {
          kind: 'data',
          visibility: 'public',
          keywords: [],
          type: 'boolean',
          initialValue: 'true',
          name: 'b',
        },
        {
          kind: 'data',
          visibility: 'public',
          keywords: [],
          type: 'unknown',
          initialValue: 'null',
          name: 'c',
        },
        {
          kind: 'data',
          visibility: 'public',
          keywords: [],
          type: 'string',
          initialValue: '"hello"',
          name: 'd',
        },
        {
          kind: 'data',
          visibility: 'public',
          keywords: [],
          type: 'string',
          initialValue: '`hello`',
          name: 'e',
        },
        {
          kind: 'data',
          visibility: 'public',
          keywords: [],
          type: 'regexp',
          initialValue: '/ab/',
          name: 'f',
        },
        {
          kind: 'data',
          visibility: 'public',
          keywords: [],
          type: 'bigint',
          initialValue: '100n',
          name: 'g',
        },
        {
          kind: 'data',
          visibility: 'public',
          keywords: [],
          type: 'binary',
          initialValue: '~1',
          name: 'h',
        },
      ],
    });
  });

  it('TSAsExpression', async () => {
    const options = {
      filecontent: `
          <script lang='ts'>
            export default Vue.extend({
              data: () => ({
                // data x
                x: {} as Record<string, number>
              } as any)
            })
          </script>
        `,
    };

    await expect(options).toParseAs({
      errors: [],
      data: [
        {
          kind: 'data',
          visibility: 'public',
          description: 'data x',
          keywords: [],
          type: 'Record<string, number>',
          initialValue: '{}',
          name: 'x',
        },
      ],
    });
  });
});
