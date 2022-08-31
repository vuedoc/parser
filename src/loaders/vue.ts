import { parseComponent } from 'vue-template-compiler';
import { Loader } from '../lib/Loader.js';
import { Loader as LoaderNS } from '../../types/Loader.js';

const DEFAULT_TEMPLATE_LANG = 'html';
const DEFAULT_SCRIPT_LANG = 'js';

export class VueLoader extends Loader {
  load(data: LoaderNS.TemplateData) {
    const result: any = parseComponent(data.content);

    const template = result.template || {
      attrs: {
        lang: DEFAULT_TEMPLATE_LANG,
      },
    };

    const script = result.script || result.scriptSetup || {
      attrs: {
        lang: DEFAULT_SCRIPT_LANG,
      },
    };

    if (!template.attrs.lang) {
      template.attrs.lang = DEFAULT_TEMPLATE_LANG;
    }

    if (!script.attrs.lang) {
      script.attrs.lang = DEFAULT_SCRIPT_LANG;
    }

    if (result.errors.length) {
      this.emitErrors(result.errors);
    }

    this.pipe(script.attrs.lang, script);
    this.pipe(template.attrs.lang, template);
  }
}
