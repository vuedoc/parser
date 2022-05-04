import { dirname, join } from 'path';
import { readFileSync } from 'fs';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));

export const Fixture = {
  resolve (filename) {
    return join(__dirname, `../fixtures/${filename}`);
  },
  get (filename) {
    return readFileSync(this.resolve(filename), 'utf8').toString();
  }
};
