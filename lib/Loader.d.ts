declare module '@vuedoc/parser/lib/Loader.js' {
  abstract class Loader {
    static extend(name: LoaderName, loader: Loader): Definition;
    static getFileContent(filename: string, options?: GetFileContentOptions): Promise<string>;

    abstract load(data: ScriptData | TemplateData): Promise<void>;  
    emitTemplate(data: TemplateData): void;  
    emitScript(data: ScriptData): void;  
    emitErrors(errors: any[]): void;
    pipe(name: string, data: ScriptData | TemplateData): Promise<void>;
  }

  type GenericAttrs = {
    lang: string;
  };

  type ScriptAttrs = GenericAttrs & {
    setup: boolean;
  };

  type PipeData<Attrs extends GenericAttrs = GenericAttrs> = {
    content: string;
    attrs: Attrs;
  };

  type ScriptData = PipeData<ScriptAttrs>;
  type TemplateData = PipeData;

  /**
   * The loader name, which is either the extension of the file or the value of
   * the attribute `lang`
   */
  type LoaderName = string;

  type Definition = {
    name: LoaderName;
    loader: Loader;
  };

  type GetFileContentOptions = {
    /**
     * The file encoding
     */
    encoding?: string;
  };
}
