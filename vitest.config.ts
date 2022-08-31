// eslint-disable-next-line import/extensions
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: process.env.UPDATE_EXAMPLES_RESULTS ? 'verbose' : 'default',
    setupFiles: [
      'test/setup.js',
    ],
    watchExclude: [
      'test/examples/**',
      'esm/**',
    ],
  },
});
