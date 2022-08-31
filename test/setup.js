import { join } from 'node:path';

// eslint-disable-next-line no-undef
globalThis.FAKE_NODEMODULES_PATHS = [
  join(__dirname, './fake_node_modules'),
];
