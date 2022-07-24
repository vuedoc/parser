import { Vuedoc } from '../../types/index.js';

export type Options = Pick<Vuedoc.Parser.ResolvedOptions, 'source'> & {
  definitions: Vuedoc.Loader.Definition[];
};

export abstract class Loader implements Vuedoc.Loader.Interface {
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

  constructor(options: Options) {
    this.options = options;
  }

  abstract load(data: Vuedoc.Loader.TemplateData | Vuedoc.Loader.ScriptData): Promise<void>;

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
