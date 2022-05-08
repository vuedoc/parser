import { Loader } from '../lib/Loader.js';

export class HtmlLoader extends Loader {
  async load(source) {
    this.emitTemplate(source);
  }
}
