/* eslint-disable no-undef */

import { join } from 'node:path';
import * as vuedoc from '../src/index.ts';

globalThis.VUEDOC_PACKAGE = vuedoc;
globalThis.VUEDOC_FAKE_NODEMODULES_PATHS = [
  join(__dirname, './fake_node_modules'),
];
