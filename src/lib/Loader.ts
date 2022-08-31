import { Parser } from '../../types/Parser.js';
import { Loader as LoaderNS } from '../../types/Loader.js';

export type LoaderOptions = {
  source: {
    template?: Parser.Source;
    script?: Omit<Parser.Script, 'ast'>;
    errors: string[];
  };
  definitions: LoaderNS.Definition[];
};

export class MissingLoaderError extends Error {}

export abstract class Loader implements LoaderNS.Interface {
  options: LoaderOptions;

  static extend(name: string, loader: any) {
    return { name, loader };
  }

  static get(name: string, options: LoaderOptions) {
    const item = options.definitions.find((loader) => loader.name === name);

    if (!item) {
      throw new MissingLoaderError(`Missing loader for ${name}`);
    }

    return item.loader;
  }

  constructor(options: LoaderOptions) {
    this.options = options;
  }

  get source() {
    return this.options.source;
  }

  abstract load(data: LoaderNS.TemplateData | LoaderNS.ScriptData): void;

  emitTemplate(data: LoaderNS.TemplateData) {
    this.options.source.template = data;
  }

  emitScript(data: LoaderNS.ScriptData) {
    this.options.source.script = data;
  }

  emitErrors(errors: string[]) {
    this.options.source.errors.push(...errors);
  }

  pipe(name: string, data: LoaderNS.TemplateData | LoaderNS.ScriptData) {
    const LoaderClass: any = Loader.get(name, this.options);

    return new LoaderClass(this.options).load(data);
  }
}
