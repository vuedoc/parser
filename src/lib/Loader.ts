import { readFile } from 'node:fs/promises';
import { Vuedoc } from '../../types/index.js';

export type Options = Pick<Vuedoc.Parser.ResolvedOptions, 'source'> & {
  definitions: Vuedoc.Loader.Definition[];
};

export class Loader implements Vuedoc.Loader.Interface {
  options: Options;

  static extend(name: string, loader: any) {
    return { name, loader };
  }

  static get(name: string, options: Options) {
    const item = options.definitions.find((loader) => name === loader.name);

    if (!item) {
      throw new Error(`Missing loader for ${name}`);
    }

    return item.loader;
  }

  static async getFileContent(filename: string, encoding?: string) {
    const buffer = await readFile(filename, encoding as any);

    return buffer.toString();
  }

  constructor(options: Options) {
    this.options = options;
  }

  /* istanbul ignore next */
  /* eslint-disable-next-line class-methods-use-this */
  // eslint-disable-next-line no-unused-vars
  async load(data: Vuedoc.Loader.TemplateData | Vuedoc.Loader.ScriptData) {
    throw new Error('Cannot call abstract Loader.load() method');
  }

  emitTemplate(data: Vuedoc.Loader.TemplateData) {
    this.options.source.template = data;
  }

  emitScript(data: Vuedoc.Loader.ScriptData) {
    this.options.source.script = data;
  }

  emitErrors(errors: string[]) {
    this.options.source.errors.push(...errors);
  }

  async pipe(name: string, data: Vuedoc.Loader.TemplateData | Vuedoc.Loader.ScriptData) {
    const LoaderClass: any = Loader.get(name, this.options);

    return new LoaderClass(this.options).load(data);
  }
}
