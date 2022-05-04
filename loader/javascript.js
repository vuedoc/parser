import { Loader } from '../lib/Loader';

export class JavaScriptLoader extends Loader {
  load (source) {
    return this.emitScript(source);
  }
}
