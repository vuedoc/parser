// eslint-disable-next-line import/no-unresolved
const ts = require('typescript')
const Loader = require('../lib/Loader')

/**
 * @note Don't fotget to install `typescript` and `@types/node` dependencies
 * according the [official documentation](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API)
 */
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
