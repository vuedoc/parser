import { describe, expect, it } from 'vitest';
import { loadSFC } from '../lib/SFC.js';

describe('ImportDeclaration', () => {
  it('should successfully register variable with identifier from another file #0', () => {
    const { scope } = loadSFC(`
      <script>
        import x from 'foo.js';

        const message = x;
      </script>
    `);

    expect(scope).toHaveProperty('message');
    expect(scope.message.value).toEqual({
      type: 'string',
      value: 'Hello, World!',
      raw: '"Hello, World!"',
      member: false,
    });
  });

  it('should successfully register variable with identifier from another file #1', () => {
    const { scope } = loadSFC(`
      <script>
        import { text } from 'bar.js';

        const message = text;
      </script>
    `);

    expect(scope).toHaveProperty('message');
    expect(scope.message.value).toEqual({
      type: 'string',
      value: 'Hello, World!',
      raw: '"Hello, World!"',
      member: false,
    });
  });

  it('should successfully register variable with identifier from another file #2', () => {
    const { scope } = loadSFC(`
      <script>
        import { text as hello } from 'bar.js';

        const message = hello;
      </script>
    `);

    expect(scope).toHaveProperty('message');
    expect(scope.message.value).toEqual({
      type: 'string',
      value: 'Hello, World!',
      raw: '"Hello, World!"',
      member: false,
    });
  });

  it('should successfully register variable with identifier from another file #3', () => {
    const { scope } = loadSFC(`
      <script>
        import * as hello from 'bar.js';

        const message = hello.text;
      </script>
    `);

    expect(scope).toHaveProperty('message');
    expect(scope.message.value).toEqual({
      type: 'string',
      value: 'Hello, World!',
      raw: '"Hello, World!"',
      member: false,
    });
  });
});
