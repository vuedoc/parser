import { Loader } from '../lib/Loader.js';
import { Vuedoc } from '../../types/index.js';

export class JavaScriptLoader extends Loader {
  async load(data: Vuedoc.Loader.ScriptData) {
    this.emitScript(data);
  }
}
