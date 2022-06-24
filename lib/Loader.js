import { readFile } from 'node:fs/promises';

export class Loader {
  static extend(name, loader) {
    return { name, loader };
  }

  static get(name, options) {
    const item = options.definitions.find((loader) => name === loader.name);

    if (!item) {
      throw new Error(`Missing loader for ${name}`);
    }

    return item.loader;
  }

  static async getFileContent(filename, options) {
    const buffer = await readFile(filename, options);

    return buffer.toString();
  }

  constructor(options) {
    this.options = options;
  }

  /* istanbul ignore next */
  /* eslint-disable-next-line class-methods-use-this */
  // eslint-disable-next-line no-unused-vars
  async load(data) {
    throw new Error('Cannot call abstract Loader.load() method');
  }

  emitTemplate(data) {
    this.options.source.template = data;
  }

  emitScript(data) {
    this.options.source.script = data;
  }

  emitErrors(errors) {
    this.options.source.errors.push(...errors);
  }

  async pipe(name, data) {
    const LoaderClass = Loader.get(name, this.options);

    return new LoaderClass(this.options).load(data);
  }
}
