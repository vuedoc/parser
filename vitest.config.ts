// eslint-disable-next-line import/extensions
import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    reporters: process.env.UPDATE_EXAMPLES_RESULTS ? 'verbose' : 'default',
    deps: {
      inline: [
        '@vuedoc/test-utils',
      ],
    },
    setupFiles: [
      '@vuedoc/test-utils',
      'test/setup.js',
    ],
    watchExclude: [
      'test/examples/**',
      'esm/**',
    ],
  },
});
