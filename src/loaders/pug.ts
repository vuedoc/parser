// eslint-disable-next-line import/no-unresolved
import pug from 'pug';
import { Loader } from '../lib/Loader.js';
import { Loader as LoaderNS } from '../../types/Loader.js';

/**
 * @note Install the [pug](https://www.npmjs.com/package/pug) peer dependency
 */
export class PugLoader extends Loader {
  load(data: LoaderNS.TemplateData) {
    this.emitTemplate({
      ...data,
      content: pug.render(data.content, {
        compileDebug: false,
      }),
      attrs: {
        ...data.attrs,
        lang: 'html',
      },
    });
  }
}
