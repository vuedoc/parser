// eslint-disable-next-line import/no-unresolved
import pug from 'pug';
import { Loader } from '../lib/Loader';

/**
 * @note Install the [pug](https://www.npmjs.com/package/pug) dependency
 */
export class PugLoader extends Loader {
  load (source) {
    const outputText = pug.render(source, {
      compileDebug: false
    });

    // don't forget the return here
    return this.emitTemplate(outputText);
  }
}
