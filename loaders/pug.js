// eslint-disable-next-line import/no-unresolved
import pug from 'pug';
import { Loader } from '../lib/Loader.js';

/**
 * @note Install the [pug](https://www.npmjs.com/package/pug) dependency
 */
export class PugLoader extends Loader {
  async load(source) {
    const outputText = pug.render(source, {
      compileDebug: false,
    });

    this.emitTemplate(outputText);
  }
}
