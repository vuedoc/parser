import { Loader } from '../lib/Loader.js';
import { Loader as LoaderNS } from '../../types/Loader.js';

export class HtmlLoader extends Loader {
  load(data: LoaderNS.TemplateData) {
    this.emitTemplate(data);
  }
}
