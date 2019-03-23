const { Loader } = require('./Loader')

class HtmlLoader extends Loader {
  load (source) {
    return this.emitTemplate(source)
  }
}

module.exports.HtmlLoader = HtmlLoader
