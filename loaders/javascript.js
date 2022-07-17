import { Loader } from '../lib/Loader.js';

export class JavaScriptLoader extends Loader {
  async load(data) {
    this.emitScript(data);
  }
}
