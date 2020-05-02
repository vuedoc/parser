// eslint-disable-next-line import/no-unresolved
const ts = require('typescript')
const Loader = require('./Loader')

class TypeScriptLoader extends Loader {
  load (source) {
    const options = {
      compilerOptions: {
        target: ts.ModuleKind.ESNext,
        module: ts.ModuleKind.ESNext
      }
    }

    const { outputText } = ts.transpileModule(source, options)

    // don't forget the return here
    return this.emitScript(outputText)
  }
}

module.exports = TypeScriptLoader
