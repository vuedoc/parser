const fs = require('fs');

class Loader {
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

  static getFileContent (filename, options) {
    return fs.readFileSync(filename, options).toString();
  }

  constructor (options) {
    this.options = options;
  }

  /* istanbul ignore next */
  /* eslint-disable-next-line class-methods-use-this */
  load () {
    throw new Error('Cannot call abstract Loader.load() method');
  }

  emitTemplate (source) {
    this.options.source.template = source || '';

    return Promise.resolve();
  }

  emitScript (source) {
    this.options.source.script = source || '';

    return Promise.resolve();
  }

  emitErrors (errors) {
    this.options.source.errors.push(...errors);

    return Promise.resolve();
  }

  pipe (name, source) {
    const LoaderClass = Loader.get(name, this.options);

    return new LoaderClass(this.options).load(source);
  }
}

module.exports = Loader;
