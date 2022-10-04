import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { readFile } from 'fs/promises';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const Fixture = {
  path: join(__dirname, '../fixtures'),
  resolve(filename) {
    return join(this.path, filename);
  },
  async get(filename) {
    return (await readFile(this.resolve(filename), 'utf8')).toString();
  },
};
