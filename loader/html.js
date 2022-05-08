import { Loader } from '../lib/Loader.js';

export class HtmlLoader extends Loader {
  async load (source) {
    return this.emitTemplate(source);
  }
}
