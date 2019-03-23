const { Loader } = require('./Loader')

class JavaScriptLoader extends Loader {
  load (source) {
    return this.emitScript(source)
  }
}

module.exports.JavaScriptLoader = JavaScriptLoader
