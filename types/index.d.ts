export * from './main';

declare module '@vuedoc/types' {
  import * as Babel from '@babel/types';
  import { Parser } from './Parser';
  import { File as FileSystemFile } from './FileSystem';

  export * from '@babel/types';

  export type Node = Babel.Node & {
    extra: {
      file: FileSystemFile;
      comment: string | null;
      $tsValue?: Parser.AST.TSValue;
      $declarator?: Babel.VariableDeclarator;
      $composition?: Parser.CompositionDeclaration;
    };
  };
}
