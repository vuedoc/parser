import resolve from 'resolve/sync.js';
import _traverse from '@babel/traverse';

import { readFileSync } from 'node:fs';
import { FileSystem, Options, File } from '../../types/FileSystem.js';
import { extname, join } from 'node:path';
import { parse, ParserPlugin } from '@babel/parser';
import { merge } from '@b613/utils/lib/object.js';

import { ImportResolver } from '../../types/ImportResolver.js';
import { Loader, LoaderOptions } from './Loader.js';

import * as Babel from '@babel/types';

type FSOptions = Options & {
  plugins?: ParserPlugin[];
};

// https://github.com/babel/babel/issues/13855#issuecomment-945123514
const traverse: typeof import('@babel/traverse').default = typeof _traverse === 'function' ? _traverse : (_traverse as any).default;
const defaultResolver: ImportResolver = {
  basedir: process.cwd(),
  extensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
};

const BABEL_DEFAULT_PLUGINS: ParserPlugin[] = [
  'asyncGenerators',
  'bigInt',
  'classPrivateMethods',
  'classPrivateProperties',
  'classProperties',
  'decorators-legacy',
  'doExpressions',
  'dynamicImport',
  'exportDefaultFrom',
  'exportNamespaceFrom',
  // 'flow',
  'flowComments',
  'functionBind',
  'functionSent',
  'importMeta',
  'logicalAssignment',
  'nullishCoalescingOperator',
  'numericSeparator',
  'objectRestSpread',
  'optionalCatchBinding',
  'optionalChaining',
  'partialApplication',
  ['pipelineOperator', { proposal: 'smart' }],
  'placeholders',
  'privateIn',
  'throwExpressions',
  'topLevelAwait',
];

function parseAst(content: string, plugins: ParserPlugin[] = []) {
  return parse(content, {
    allowImportExportEverywhere: true,
    allowAwaitOutsideFunction: true,
    allowReturnOutsideFunction: true,
    allowSuperOutsideMethod: true,
    allowUndeclaredExports: true,
    createParenthesizedExpressions: false,
    errorRecovery: false,
    plugins: [...BABEL_DEFAULT_PLUGINS, ...plugins],
    sourceType: 'module',
    strictMode: false,
    ranges: true,
    tokens: false,
  });
}

function parseAlias(path: string, aliasMap: Record<string, string>) {
  for (const prefix in aliasMap) {
    if (path.startsWith(prefix)) {
      const alias = aliasMap[prefix];

      return join(alias, path.slice(prefix.length));
    }
  }

  return path;
}

function findComment({ trailingComments = [], leadingComments = trailingComments, ...node }: Babel.Node) {
  const leadingComment = leadingComments?.reverse()[0];

  if (leadingComment) {
    return leadingComment.start && node.end && leadingComment.start > node.end ? null : leadingComment.value;
  }

  return null;
}

function loadFileContent(loaderName: string, filecontent: string, { plugins = [], ...options }: FSOptions) {
  const loaderOptions: LoaderOptions = {
    definitions: options.loaders,
    source: {
      errors: [],
    },
  };

  const LoaderClass: any = Loader.get(loaderName, loaderOptions);
  const loader: Loader = new LoaderClass(loaderOptions);

  loader.load({
    attrs: {
      lang: loaderName,
    },
    content: filecontent,
  });

  const file = loader.source as File;

  if (file.errors.length) {
    throw new ParsingError(loader.source.errors[0]);
  }

  if (file.script?.content) {
    if (plugins.length === 0) {
      plugins = parsePlugins(file.script.attrs.lang, options);
    }

    file.script.ast = parseAst(file.script.content, plugins);

    traverse(file.script.ast, {
      enter(path) {
        if (path.node) {
          if (!path.node.extra) {
            path.node.extra = {};
          }

          path.node.extra.file = file;
          path.node.extra.comment = findComment(path.node);
        }
      },
    });
  } else {
    delete file.script;
  }

  return file;
}

function parsePlugins(lang: string, options: Pick<FSOptions, 'jsx'> & { path?: string } = {}): ParserPlugin[] {
  const plugins: ParserPlugin[] = [];

  switch (lang) {
    case 'ts':
      if (options.path?.endsWith('.d.ts')) {
        plugins.push(['typescript', { dts: true }]);
      } else {
        plugins.push('typescript');
      }
      break;

    case 'tsx':
      plugins.push('typescript');
      plugins.push('jsx');
      break;

    case 'jsx':
      plugins.push('jsx');
      break;

    default:
      plugins.push('typescript');

      if (options.jsx) {
        plugins.push('jsx');
      }
      break;
  }

  return plugins;
}

export class ParsingError extends Error {}

export class FS implements FileSystem {
  private options: Options;
  private index: Record<string, File> = {};

  constructor(options: Options) {
    this.options = options;
  }

  loadFile(filename: string, resolver = this.options.resolver || defaultResolver) {
    const source = resolver.alias ? parseAlias(filename, resolver.alias) : filename;

    if (source in this.index) {
      return this.index[source];
    }

    let path: string;

    try {
      path = resolve(source, merge({ ...defaultResolver }, resolver));
    } catch {
      throw new Error(`Cannot find module '${filename}'. Make sure to define options.resolver`);
    }

    if (path in this.index) {
      return this.index[path];
    }

    const lang = extname(path).substring(1);
    const plugins = parsePlugins(lang, { path, jsx: this.options.jsx });
    const filecontent = readFileSync(path, this.options.encoding as 'utf8' || 'utf8');
    const file = loadFileContent(lang, filecontent, { ...this.options, plugins });

    file.filename = path;
    this.index[source] = file;
    this.index[path] = file;

    return file;
  }

  loadContent(loaderName: string, filecontent: string) {
    return loadFileContent(loaderName, filecontent, this.options) as File;
  }
}
