import { describe, expect, it } from 'vitest';

describe('TypeDoc', () => {
  it('@param <param name>', async () => {
    const options = {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * @param text  Comment for parameter ´text´.
               */
              doSomething(target: any, text: string): number {}
            }
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'doSomething(target: any, text: string): number',
          ],
          name: 'doSomething',
          keywords: [],
          params: [
            {
              name: 'target',
              type: 'any',
              rest: false,
            },
            {
              name: 'text',
              type: 'string',
              description: 'Comment for parameter ´text´.',
              rest: false,
            },
          ],
          returns: {
            type: 'number',
          },
          visibility: 'public',
        },
      ],
    });
  });

  it('@return(s)', async () => {
    const options = {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * @returns      Comment for special return value.
               */
              doSomething(target: any, value: number): number {}
            }
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'doSomething(target: any, value: number): number',
          ],
          name: 'doSomething',
          keywords: [],
          params: [
            {
              name: 'target',
              type: 'any',
              rest: false,
            },
            {
              name: 'value',
              type: 'number',
              rest: false,
            },
          ],
          returns: {
            type: 'number',
            description: 'Comment for special return value.',
          },
          visibility: 'public',
        },
      ],
    });
  });

  it('@hidden and @ignore', async () => {
    const options = {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * @hidden
               */
              doSomething(target: any, value: number): number {},
              /**
               * @ignore
               */
              doSomething2(target: any, value: number): number {},
            }
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      methods: [],
    });
  });

  it('@category', async () => {
    const options = {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * Regular description
               *
               * @category Category Name
               */
              doSomething() {}
            }
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      props: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'doSomething(): void',
          ],
          name: 'doSomething',
          description: 'Regular description',
          keywords: [],
          category: 'Category Name',
          params: [],
          returns: {
            type: 'void',
          },
          visibility: 'public',
        },
      ],
    });
  });
});
