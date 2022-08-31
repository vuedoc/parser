import { Parser } from './Parser.js';
import { Loader } from './Loader.js';
import { ImportResolver } from './ImportResolver.js';

export type Options = {
  jsx?: boolean;
  loaders: Loader.Definition[];
  encoding?: string;
  resolver?: ImportResolver;
};

export type File = {
  filename?: string;
  template?: Parser.Source<object>;
  script?: Required<Parser.Script>;
  errors: string[];
};

export declare class ParsingError extends Error {}

export declare class FileSystem {
  constructor(options: Options);
  loadFile(filename: string, resolver?: ImportResolver): File;
  loadContent(loaderName: string, filecontent: string): File;
}
