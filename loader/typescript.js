const JavaScriptLoader = require('./javascript');

/**
 * @note Don't fotget to install `typescript` and `@types/node` dependencies
 * according the [official documentation](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API)
 */
class TypeScriptLoader extends JavaScriptLoader {}

module.exports = TypeScriptLoader;
