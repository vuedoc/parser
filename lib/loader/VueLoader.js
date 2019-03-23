const { parseComponent } = require('vue-template-compiler')

const { Loader } = require('./Loader')

const DEFAULT_TEMPLATE_LANG = 'html'
const DEFAULT_SCRIPT_LANG = 'js'

class VueLoader extends Loader {
  static loadFilecontent (filecontent, options) {
    const result = parseComponent(filecontent)

    const template = result.template || {
      attrs: {
        lang: DEFAULT_TEMPLATE_LANG
      }
    }

    const script = result.script || {
      attrs: {
        lang: DEFAULT_SCRIPT_LANG
      }
    }

    if (!template.attrs.lang) {
      template.attrs.lang = DEFAULT_TEMPLATE_LANG
    }

    if (!script.attrs.lang) {
      script.attrs.lang = DEFAULT_SCRIPT_LANG
    }

    Loader.parse(template.attrs.lang, template.content, options)
    Loader.parse(script.attrs.lang, script.content, options)

    return {
      template: template.content || '',
      script: script.content || '',
      errors: result.errors
    }
  }

  load (source) {
    this.options.source = VueLoader.loadFilecontent(source, this.options)
  }
}

module.exports.VueLoader = VueLoader
