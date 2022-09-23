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

declare module '@vuedoc/parser/entity/value' {
  import { Parser } from './Parser';

  export declare class Value<T> extends Parser.Value<T> {}
  export declare const generateUndefineValue: Generator<Parser.Value<undefined>, Parser.Value<undefined>, unknown>;
  export declare const generateNullGenerator: Generator<Parser.Value<null>, Parser.Value<null>, unknown>;
  export declare const generateAnyGenerator: Generator<Parser.Value<never>, Parser.Value<never>, unknown>;
  export declare const generateObjectGenerator: Generator<Parser.Value<object>, Parser.Value<object>, unknown>;
  export declare const generateArrayGenerator: Generator<Parser.Value<any[]>, Parser.Value<any[]>, unknown>;
}
