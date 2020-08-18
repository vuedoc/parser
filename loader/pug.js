// eslint-disable-next-line import/no-unresolved
const pug = require('pug');
const Loader = require('../lib/Loader');

/**
 * @note Install the [pug](https://www.npmjs.com/package/pug) dependency
 */
class PugLoader extends Loader {
  load (source) {
    const outputText = pug.render(source, {
      compileDebug: false
    });

    // don't forget the return here
    return this.emitTemplate(outputText);
  }
}

module.exports = PugLoader;
