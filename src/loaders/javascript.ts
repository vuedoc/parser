import { Loader } from '../lib/Loader.js';
import { Loader as LoaderNS } from '../../types/Loader.js';

export class JavaScriptLoader extends Loader {
  load(data: LoaderNS.ScriptData) {
    this.emitScript(data);
  }
}
