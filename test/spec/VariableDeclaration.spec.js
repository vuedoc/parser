import { describe, expect, it } from 'vitest';
import { loadSFC } from '../lib/SFC.js';

describe('VariableDeclaration', () => {
  it('should register simple variable declaration', () => {
    const { scope } = loadSFC(`
      <script>
        const count = 0;
      </script>
    `);

    expect(scope).toHaveProperty('count');
    expect(scope.count.key).toBe('count');
    expect(scope.count.value).toEqual({
      type: 'number',
      value: 0,
      raw: '0',
      member: false,
    });
  });

  it('alias variable declaration', () => {
    const { scope } = loadSFC(`
      <script>
        const count = 0;
        const length = count;
      </script>
    `);

    expect(scope).toHaveProperty('length');
    expect(scope.length.key).toBe('length');
    expect(scope.length.value).toEqual({
      type: 'number',
      value: 0,
      raw: '0',
      member: false,
    });
  });

  it('object variable declaration', () => {
    const { scope } = loadSFC(`
      <script>
        const account = {
          username: 'chaka_zoulou',
        };
      </script>
    `);

    expect(scope).toHaveProperty('account');
    expect(scope.account.key).toBe('account');
    expect(scope.account.value.rawNode).toHaveProperty('username');

    delete scope.account.value.rawNode;

    expect(scope.account.value).toEqual({
      type: '{ username: string; }',
      value: {
        username: 'chaka_zoulou',
      },
      raw: '{"username":"chaka_zoulou"}',
      rawObject: {
        username: {
          type: 'string',
          member: false,
          value: 'chaka_zoulou',
          raw: '"chaka_zoulou"',
        },
      },
      member: false,
    });
  });

  it('alias variable declaration with inner prop', () => {
    const { scope } = loadSFC(`
      <script>
        const account = {
          username: 'chaka_zoulou',
        };

        const username = account.username;
      </script>
    `);

    expect(scope).toHaveProperty('username');
    expect(scope.username.key).toBe('username');
    expect(scope.username.value).toEqual({
      type: 'string',
      value: 'chaka_zoulou',
      raw: '"chaka_zoulou"',
      member: false,
    });
  });

  it('alias variable declaration with deeply prop level = 2', () => {
    const { scope } = loadSFC(`
      <script>
        const user = {
          account: {
            username: 'chaka_zoulou',
          },
        };

        const username = user.account.username;
      </script>
    `);

    expect(scope).toHaveProperty('username');
    expect(scope.username.key).toBe('username');
    expect(scope.username.value).toEqual({
      type: 'string',
      value: 'chaka_zoulou',
      raw: '"chaka_zoulou"',
      member: false,
    });
  });

  it('alias variable declaration with deeply prop level = 3', () => {
    const { scope } = loadSFC(`
      <script>
        const user = {
          account: {
            name: {
              first: 'chaka',
              last: 'zoulou',
            },
          },
        };

        const firstName = user.account.name.first;
      </script>
    `);

    expect(scope).toHaveProperty('firstName');
    expect(scope.firstName.key).toBe('firstName');
    expect(scope.firstName.value).toEqual({
      type: 'string',
      value: 'chaka',
      raw: '"chaka"',
      member: false,
    });
  });

  it('alias variable declaration with deeply prop level = 3 #2', () => {
    const { scope } = loadSFC(`
      <script>
        const user = {
          account: {
            name: {
              first: 'chaka',
              last: 'zoulou',
            },
          },
        };

        const firstName = user['account'].name['first'];
      </script>
    `);

    expect(scope).toHaveProperty('firstName');
    expect(scope.firstName.key).toBe('firstName');
    expect(scope.firstName.value).toEqual({
      type: 'string',
      value: 'chaka',
      raw: '"chaka"',
      member: false,
    });
  });

  it('alias variable declaration with deeply prop level = 3 #3', () => {
    const { scope } = loadSFC(`
      <script>
        const user = {
          account: {
            name: {
              first: 'chaka',
              last: 'zoulou',
            },
          },
        };

        const account = user['account'];
        const firstName = account.name['first'];
      </script>
    `);

    expect(scope).toHaveProperty('firstName');
    expect(scope.firstName.key).toBe('firstName');
    expect(scope.firstName.value).toEqual({
      type: 'string',
      value: 'chaka',
      raw: '"chaka"',
      member: false,
    });
  });

  describe('destructuring array', () => {
    const { scope } = loadSFC(`
      <script>
        const user = {
          account: {
            name: ['chaka', 'zoulou'],
          },
        };

        const [, last, voidx = 'empty'] = user.account.name;
        const [a, , , [d, e, , g]] = [0, 1, 2, [3, 4, 5]]
      </script>
    `);

    it('should parse last', () => {
      expect(scope).toHaveProperty('last');
      expect(scope.last.key).toBe('last');
      expect(scope.last.value).toEqual({
        type: 'string',
        value: 'zoulou',
        raw: '"zoulou"',
        member: false,
      });
    });

    it('should parse void', () => {
      expect(scope).toHaveProperty('voidx');
      expect(scope.voidx.key).toBe('voidx');
      expect(scope.voidx.value).toEqual({
        type: 'string',
        value: 'empty',
        raw: '"empty"',
        member: false,
      });
    });

    it('should parse a', () => {
      expect(scope).toHaveProperty('a');
      expect(scope.a.value).toEqual({
        type: 'number',
        value: 0,
        raw: '0',
        member: false,
      });
    });

    it('should parse d', () => {
      expect(scope).toHaveProperty('a');
      expect(scope.d.value).toEqual({
        type: 'number',
        value: 3,
        raw: '3',
        member: false,
      });
    });

    it('should parse e', () => {
      expect(scope).toHaveProperty('e');
      expect(scope.e.value).toEqual({
        type: 'number',
        value: 4,
        raw: '4',
        member: false,
      });
    });
  });

  describe('destructuring object', () => {
    it('destructuring object', () => {
      const { scope } = loadSFC(`
        <script>
          const user = {
            account: {
              name: {
                first: 'chaka',
                last: 'zoulou',
              },
            },
          };

          const { first } = user.account.name;
        </script>
      `);

      expect(scope).toHaveProperty('first');
      expect(scope.first.key).toBe('first');
      expect(scope.first.value).toEqual({
        type: 'string',
        value: 'chaka',
        raw: '"chaka"',
        member: false,
      });
    });

    it('nested destructuring object', () => {
      const { scope } = loadSFC(`
        <script>
          const user = {
            account: {
              name: {
                first: 'chaka',
                last: 'zoulou',
              },
            },
          };

          const { account: { name } } = user;
        </script>
      `);

      expect(scope).toHaveProperty('name');
      expect(scope.name.key).toBe('name');
      expect(scope.name.value.rawNode).toHaveProperty('first');
      expect(scope.name.value.rawNode).toHaveProperty('last');

      delete scope.name.value.rawNode;

      expect(scope.name.value).toEqual({
        type: 'object',
        value: {
          first: 'chaka',
          last: 'zoulou',
        },
        raw: '{"first":"chaka","last":"zoulou"}',
        rawObject: {
          first: {
            member: false,
            raw: '"chaka"',
            value: 'chaka',
            type: 'string',
          },
          last: {
            member: false,
            raw: '"zoulou"',
            value: 'zoulou',
            type: 'string',
          },
        },
        member: false,
      });
    });

    it('destructuring object with new name', () => {
      const { scope } = loadSFC(`
        <script>
          const user = {
            account: {
              name: {
                first: 'chaka',
                last: 'zoulou',
              },
            },
          };

          const { first: firstName } = user.account.name;
        </script>
      `);

      expect(scope).toHaveProperty('firstName');
      expect(scope.firstName.key).toBe('firstName');
      expect(scope.firstName.source).toBe('first');
      expect(scope.firstName.value).toEqual({
        type: 'string',
        value: 'chaka',
        raw: '"chaka"',
        member: false,
      });
    });

    it('destructuring object with default value which has no effect', () => {
      const { scope } = loadSFC(`
        <script>
          const user = {
            account: {
              name: {
                first: 'chaka',
                last: 'zoulou',
              },
            },
          };

          const { first = 'Eren' } = user.account.name;
        </script>
      `);

      expect(scope).toHaveProperty('first');
      expect(scope.first.key).toBe('first');
      expect(scope.first.value).toEqual({
        type: 'string',
        value: 'chaka',
        raw: '"chaka"',
        member: false,
      });
    });

    it('destructuring object with default value', () => {
      const { scope } = loadSFC(`
        <script>
          const user = {
            account: {
              name: {
                first: 'chaka',
                last: 'zoulou',
              },
            },
          };

          const { middle = 'Eren' } = user.account.name;
        </script>
      `);

      expect(scope).toHaveProperty('middle');
      expect(scope.middle.key).toBe('middle');
      expect(scope.middle.value).toEqual({
        type: 'string',
        value: 'Eren',
        raw: '"Eren"',
        member: false,
      });
    });

    it('destructuring object with new name and default value', () => {
      const { scope } = loadSFC(`
        <script>
          const user = {
            account: {
              name: {
                first: 'chaka',
                last: 'zoulou',
              },
            },
          };

          const { middle: middleName = 'Eren' } = user.account.name;
        </script>
      `);

      expect(scope).toHaveProperty('middleName');
      expect(scope.middleName.key).toBe('middleName');
      expect(scope.middleName.source).toBe('middle');
      expect(scope.middleName.value).toEqual({
        type: 'string',
        value: 'Eren',
        raw: '"Eren"',
        member: false,
      });
    });

    it('destructuring object with spread element', () => {
      const { scope } = loadSFC(`
        <script>
          const user = {
            account: {
              name: {
                first: 'chaka',
                last: 'zoulou',
              },
            },
          };

          const { ...userName } = user.account.name;
        </script>
      `);

      expect(scope).toHaveProperty('userName');
      expect(scope.userName.key).toBe('userName');
      expect(scope.userName.value.rawNode).toHaveProperty('first');
      expect(scope.userName.value.rawNode).toHaveProperty('last');

      delete scope.userName.value.rawNode;

      expect(scope.userName.value).toEqual({
        type: 'object',
        value: {
          first: 'chaka',
          last: 'zoulou',
        },
        raw: '{"first":"chaka","last":"zoulou"}',
        rawObject: {
          first: {
            member: false,
            raw: '"chaka"',
            value: 'chaka',
            type: 'string',
          },
          last: {
            member: false,
            raw: '"zoulou"',
            value: 'zoulou',
            type: 'string',
          },
        },
        member: false,
      });
    });
  });

  it('should successfully register variable with call expression as init value', () => {
    const { scope } = loadSFC(`
      <script>
        function getCurrentThread(state) {
          return state.currentThreadID
            ? state.threads[state.currentThreadID]
            : {}
        }

        const currentThread = getCurrentThread()
      </script>
    `);

    expect(scope).toHaveProperty('currentThread');
    expect(scope.currentThread.value).toEqual({
      type: ['unknown', 'object'],
      value: 'getCurrentThread()',
      raw: 'getCurrentThread()',
      member: false,
      function: false,
      $kind: 'getCurrentThread',
    });
  });

  it('should successfully register variable with class instantiation as init value', () => {
    const { scope } = loadSFC(`
      <script>
        class CustomeObject {}

        const currentThread = new CustomeObject();
      </script>
    `);

    expect(scope).toHaveProperty('currentThread');
    expect(scope.currentThread.value).toEqual({
      type: 'CustomeObject',
      value: 'new CustomeObject()',
      raw: 'new CustomeObject()',
      member: false,
    });
  });

  it('should successfully register variable with unary expression typeof', () => {
    const { scope } = loadSFC(`
      <script>
        const url = 'https://wikipedia.com';
        const isHttpUrl = typeof url === 'string' && url.startsWith('http');
      </script>
    `);

    expect(scope).toHaveProperty('isHttpUrl');
    expect(scope.isHttpUrl.value).toEqual({
      type: 'boolean',
      value: "typeof url === 'string' && url.startsWith('http')",
      raw: "typeof url === 'string' && url.startsWith('http')",
      member: false,
    });
  });

  it('should successfully register variable with complex binary expression', () => {
    const { scope } = loadSFC(`
      <script>
        const hasFeedback = Boolean(this.help) || Boolean(this.error) || Boolean(this.$slots.error);
      </script>
    `);

    expect(scope).toHaveProperty('hasFeedback');
    expect(scope.hasFeedback.value).toEqual({
      type: 'boolean',
      value: 'Boolean(this.help) || Boolean(this.error) || Boolean(this.$slots.error)',
      raw: 'Boolean(this.help) || Boolean(this.error) || Boolean(this.$slots.error)',
      member: false,
    });
  });

  it('should successfully register variable with unary expression which contains object expression', () => {
    const { scope } = loadSFC(`
      <script>
        const currentThread = state.currentThreadID ? state.threads[state.currentThreadID] : {};
      </script>
    `);

    expect(scope).toHaveProperty('currentThread');
    expect(scope.currentThread.value).toEqual({
      type: ['unknown', 'object'],
      value: 'state.currentThreadID ? state.threads[state.currentThreadID] : {}',
      raw: 'state.currentThreadID ? state.threads[state.currentThreadID] : {}',
      member: false,
    });
  });

  it('should successfully register variable with unary expression which contains array expression', () => {
    const { scope } = loadSFC(`
      <script>        
        const currentMessages = thread.messages ? thread.messages.map(id => state.messages[id]) : [];
      </script>
    `);

    expect(scope).toHaveProperty('currentMessages');
    expect(scope.currentMessages.value).toEqual({
      type: ['unknown', 'unknown[]'],
      value: 'thread.messages ? thread.messages.map(id => state.messages[id]) : []',
      raw: 'thread.messages ? thread.messages.map(id => state.messages[id]) : []',
      member: false,
    });
  });

  it('should successfully register array variable with different items', () => {
    const { scope } = loadSFC(`
      <script>        
        const groceryList = [
          { id: 0, text: 'Vegetables' },
          { id: 1, text: 'Cheese' },
          { id: 2, text: 'Whatever else humans are supposed to eat' },
        ];
      </script>
    `);

    expect(scope).toHaveProperty('groceryList');
    expect(scope.groceryList.value.value).toEqual([
      { id: 0, text: 'Vegetables' },
      { id: 1, text: 'Cheese' },
      { id: 2, text: 'Whatever else humans are supposed to eat' },
    ]);

    expect(scope.groceryList.value.type).toEqual('{ id: number; text: string; }[]');
  });
});
