import { Loader } from '../lib/Loader';

export class HtmlLoader extends Loader {
  load (source) {
    return this.emitTemplate(source);
  }
}
