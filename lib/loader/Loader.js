const { readFileSync } = require('fs')

class Loader {
  static extend (name, loader) {
    return { name, loader }
  }

  static get (name, options) {
    const item = options.loaders.find((loader) => name === loader.name)

    if (!item) {
      throw new Error(`Missing loader for ${name}`)
    }

    return item.loader
  }

  static parse (name, source, options) {
    const LoaderClass = Loader.get(name, options)

    new LoaderClass(options).load(source)
  }

  static getFileContent (filename, options) {
    return readFileSync(filename, options.encoding).toString()
  }

  constructor (options) {
    this.options = options
  }

  load (source) {
    this.options.source.script = source
  }
}

module.exports.Loader = Loader
