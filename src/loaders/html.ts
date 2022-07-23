import { Loader } from '../lib/Loader.js';
import { Vuedoc } from '../../types/index.js';

export class HtmlLoader extends Loader {
  async load(data: Vuedoc.Loader.TemplateData) {
    this.emitTemplate(data);
  }
}
