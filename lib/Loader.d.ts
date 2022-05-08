declare module '@vuedoc/parser/lib/Loader.js' {
  abstract class Loader {
    static extend(name: LoaderName, loader: Loader): Definition;
    static getFileContent(filename: string, options?: GetFileContentOptions): Promise<string>;

    abstract load(): Promise<void>;  
    emitTemplate(source: string): void;  
    emitScript(source: string): void;  
    emitErrors(errors: any[]): void;
    pipe(name: string, source: string): Promise<void>;
  }

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
