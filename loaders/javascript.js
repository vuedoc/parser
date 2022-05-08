import { Loader } from '../lib/Loader.js';

export class JavaScriptLoader extends Loader {
  async load(source) {
    this.emitScript(source);
  }
}
