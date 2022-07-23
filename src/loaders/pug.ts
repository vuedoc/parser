// eslint-disable-next-line import/no-unresolved
import pug from 'pug';
import { Loader } from '../lib/Loader.js';
import { Vuedoc } from '../../types/index.js';

/**
 * @note Install the [pug](https://www.npmjs.com/package/pug) dependency
 */
export class PugLoader extends Loader {
  async load(data: Vuedoc.Loader.TemplateData) {
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
