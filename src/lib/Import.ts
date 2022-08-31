import { File, FileSystem } from '../../types/FileSystem.js';
import { Parser } from '../../types/Parser.js';
import { RegisterFactory, ScriptRegisterParser } from '../parsers/ScriptRegisterParser.js';
import { dirname } from 'node:path';
import { Syntax } from './Enum.js';

import { ImportResolver } from '../../types/ImportResolver.js';
import { LoaderOptions } from './Loader.js';

import * as Babel from '@babel/types';

export type Options = {
  jsx?: boolean;
  encoding?: string;
  loaders: LoaderOptions;
  resolver?: ImportResolver;
};

interface ImportDeclaration extends Babel.ImportDeclaration {
  $loaded?: boolean;
  exposedScope?: Parser.Scope;
}

type Specifier = (Babel.ImportDefaultSpecifier | Babel.ImportNamespaceSpecifier | Babel.ImportSpecifier) & {
  scopeEntry?: Parser.ScopeEntry;
  ns?: Parser.NS;
}

export class Import {
  specifier: Specifier;
  importDeclaration: ImportDeclaration;
  protected register: ScriptRegisterParser;
  protected source: Readonly<Partial<File>>;
  private fs: FileSystem;
  private createRegister: RegisterFactory;
  resolver?: ImportResolver;

  constructor(
    fs: FileSystem,
    specifier: Babel.ImportDefaultSpecifier | Babel.ImportNamespaceSpecifier | Babel.ImportSpecifier,
    node: Babel.ImportDeclaration,
    source: Readonly<Partial<File>>,
    createRegister: RegisterFactory,
    resolver: ImportResolver = {}
  ) {
    this.fs = fs;
    this.specifier = specifier;
    this.source = source;
    this.resolver = resolver;
    this.createRegister = createRegister;
    this.importDeclaration = node;

    if (!this.importDeclaration.exposedScope) {
      this.importDeclaration.exposedScope = {};
    }
  }

  protected loadPackage() {
    if (this.importDeclaration.$loaded) {
      return;
    }

    const resolver: ImportResolver = this.source.filename
      ? { ...this.resolver, basedir: dirname(this.source.filename) }
      : this.resolver;

    try {
      const file = this.fs.loadFile(this.importDeclaration.source.value, resolver);

      if (file.script) {
        const register = this.createRegister(file.script, file);

        register.parseAst(file.script.ast.program);
        this.importDeclaration.exposedScope = { ...register.exposedScope };
      }
    } finally {
      this.importDeclaration.$loaded = true;
    }
  }

  protected loadSpecifierNode() {
    if (this.specifier.scopeEntry || this.specifier.ns) {
      return;
    }

    switch (this.specifier.type) {
      case Syntax.ImportDefaultSpecifier:
        this.specifier.scopeEntry = this.importDeclaration.exposedScope.default as Parser.ScopeEntry;
        break;

      case Syntax.ImportNamespaceSpecifier: {
        this.specifier.ns = {
          $ns: Symbol('ns'),
          scope: {
            ...this.importDeclaration.exposedScope as any,
          },
        };
        break;
      }

      default:
        if ('imported' in this.specifier) {
          const id = 'name' in this.specifier.imported
            ? this.specifier.imported.name
            : this.specifier.imported.value;

          if (id in this.importDeclaration.exposedScope) {
            this.specifier.scopeEntry = this.importDeclaration.exposedScope[id] as Parser.ScopeEntry;
          }
        }
        break;
    }
  }

  load() {
    this.loadPackage();
    this.loadSpecifierNode();
  }
}
