import { readdir } from 'fs/promises';
import { describe } from '@jest/globals';
import { fileURLToPath } from 'url';
import { join, dirname, basename } from 'path';
import { VueDocExample } from '../lib/VueDocExample.js';

const __dirname = dirname(fileURLToPath(import.meta.url));

const examplesPath = join(__dirname, '../examples');

async function getDirectories(path) {
  const files = await readdir(path);
  const prefix = basename(path);

  return files.map((file) => [join(prefix, file), join(path, file)]);
}

const exampleFiles = await getDirectories(examplesPath);

describe('Compatibility between vue2 and vue3', () => {
  describe.each(exampleFiles)('%s', (name, path) => VueDocExample.validate(path));
});
