import { readFile } from 'node:fs/promises';

export class Loader {
  static extend (name, loader) {
    return { name, loader };
  }

  static get (name, options) {
    const item = options.loaders.find((loader) => name === loader.name);

    if (!item) {
      throw new Error(`Missing loader for ${name}`);
    }

    return item.loader;
  }

  static async getFileContent (filename, options) {
    return (await readFile(filename, options)).toString();
  }

  constructor (options) {
    this.options = options;
  }

  /* istanbul ignore next */
  /* eslint-disable-next-line class-methods-use-this */
  async load () {
    throw new Error('Cannot call abstract Loader.load() method');
  }

  async emitTemplate (source) {
    this.options.source.template = source || '';
  }

  async emitScript (source) {
    this.options.source.script = source || '';
  }

  async emitErrors (errors) {
    this.options.source.errors.push(...errors);
  }

  pipe (name, source) {
    const LoaderClass = Loader.get(name, this.options);

    return new LoaderClass(this.options).load(source);
  }
}
