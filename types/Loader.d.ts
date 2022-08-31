import { Parser } from './Parser';

export namespace Loader {
  abstract class Interface {
    static extend(name: LoaderName, loader: Interface): Definition;
    abstract load(data: ScriptData | TemplateData): void;
    emitTemplate(data: TemplateData): void;
    emitScript(data: ScriptData): void;
    emitErrors(errors: string[]): void;
    pipe(name: string, data: ScriptData | TemplateData): void;
  }

  type ScriptData = Parser.Script;
  type TemplateData = Parser.Source;

  /**
   * The loader name, which is either the extension of the file or the value of
   * the attribute `lang`
   */
  type LoaderName = string;

  type Definition = {
    name: LoaderName;
    loader: Interface;
  };
}
