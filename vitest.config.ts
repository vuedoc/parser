// eslint-disable-next-line import/extensions
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    watchExclude: [
      'test/examples/**',
      'esm/**',
    ],
    passWithNoTests: true,
  },
});
