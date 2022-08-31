import { afterAll, beforeAll, describe, expect, it, vi } from 'vitest';
import { loadSFC } from '../lib/SFC.js';

const mockfs = {
  'foo.js': `
    export default "Hello, World!"
  `,
  'bar.js': `
    export const text = "Hello, World!"
  `,
};

describe('ImportDeclaration', () => {
  beforeAll(() => {
    vi.mock('resolve/sync.js', async () => ({
      default: vi.fn().mockImplementation((path) => path),
    }));

    vi.mock('node:fs', async () => ({
      ...(await vi.importActual < typeof import('node:fs') > ('node:fs')),
      readFileSync: vi.fn().mockImplementation((path) => mockfs[path]),
    }));
  });

  afterAll(() => vi.restoreAllMocks());

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
