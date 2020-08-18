const { parseComponent } = require('vue-template-compiler');

const Loader = require('../lib/Loader');

const DEFAULT_TEMPLATE_LANG = 'html';
const DEFAULT_SCRIPT_LANG = 'js';

class VueLoader extends Loader {
  load (source) {
    const result = parseComponent(source);

    const template = result.template || {
      attrs: {
        lang: DEFAULT_TEMPLATE_LANG
      }
    };

    const script = result.script || {
      attrs: {
        lang: DEFAULT_SCRIPT_LANG
      }
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

    return Promise.all([
      this.pipe(script.attrs.lang, script.content),
      this.pipe(template.attrs.lang, template.content)
    ]);
  }
}

module.exports = VueLoader;
