const Loader = require('../lib/Loader');

class HtmlLoader extends Loader {
  load (source) {
    return this.emitTemplate(source);
  }
}

module.exports = HtmlLoader;
