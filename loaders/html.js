import { Loader } from '../lib/Loader.js';

export class HtmlLoader extends Loader {
  async load(data) {
    this.emitTemplate(data);
  }
}
