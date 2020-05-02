// eslint-disable-next-line import/no-unresolved
const pug = require('pug')
const Vuedoc = require('@vuedoc/parser')

class PugLoader extends Vuedoc.Loader {
  load (source) {
    const outputText = pug.render(source, {
      compileDebug: false
    })

    // don't forget the return here
    return this.emitTemplate(outputText)
  }
}

module.exports = PugLoader
