import { dirname, isAbsolute, parse } from 'node:path';
import { Options, ScriptParser } from './ScriptParser.js';
import { MarkupTemplateParser } from './MarkupTemplateParser.js';
import { CompositionParser } from './CompositionParser.js';

import { NameEntry } from '../entity/NameEntry.js';
import { Composition } from '../lib/Composition.js';
import { Feature, Features, DEFAULT_IGNORED_VISIBILITIES, TypedocTag, JSDocTag, FeatureEvent } from '../lib/Enum.js';
import { Loader as LoaderNS } from '../../types/Loader.js';
import { clear, merge } from '@b613/utils/lib/object.js';
import { RegisterFactory, ScriptRegisterParser } from './ScriptRegisterParser.js';

import { FS, ParsingError } from '../lib/FS.js';
import { Loader } from '../lib/Loader.js';
import { VueLoader } from '../loaders/vue.js';
import { HtmlLoader } from '../loaders/html.js';
import { JavaScriptLoader } from '../loaders/javascript.js';
import { TypeScriptLoader } from '../loaders/typescript.js';

import { Entry } from '../../types/Entry.js';
import { File, FileSystem } from '../../types/FileSystem.js';
import { IndexPlugin } from '../../types/index.js';
import { Parser } from '../../types/Parser.js';

type AsyncOperation = () => Promise<void>;

const IGNORED_KEYWORDS = [
  TypedocTag.hidden,
  JSDocTag.ignore,
];

const DEFAULT_LOADERS: LoaderNS.Definition[] = [
  Loader.extend('js', JavaScriptLoader),
  Loader.extend('ts', TypeScriptLoader),
  Loader.extend('html', HtmlLoader),
  Loader.extend('vue', VueLoader),
];

function parseLoaders(options: Pick<Parser.Options, 'loaders'>) {
  if (options.loaders) {
    options.loaders = [...options.loaders]; // immutability
  } else {
    options.loaders = [];
  }

  for (const loader of DEFAULT_LOADERS) {
    if (!options.loaders.includes(loader)) {
      options.loaders.push(loader);
    }
  }
}

export class EntryEvent<T extends Entry.Type = Entry.Type>
  extends Event
  implements Parser.EntryEvent<T> {
  readonly entry: T;

  constructor(entry: T) {
    super(entry.kind, { cancelable: true });

    this.entry = entry;
  }
}

export class MessageEvent extends Event implements Parser.MessageEvent<Parser.MessageEventType> {
  readonly message: string;

  constructor(type: Parser.MessageEventType, message: string) {
    super(type, { cancelable: true });

    this.message = message;
  }
}

export class EndEvent extends Event implements Parser.EndEvent {
  constructor() {
    super('end', { cancelable: false });
  }
}

export class VuedocParser extends EventTarget implements Parser.Interface {
  readonly options: Parser.Options;
  readonly features: Parser.Feature[];
  scope: Parser.Scope;
  readonly ignoredVisibilities: Entry.Visibility[];
  readonly plugins: Parser.PluginDefinition<IndexPlugin>[];
  readonly composition: Composition;
  readonly fs: FileSystem;
  protected asyncOperations: Promise<void>[];
  protected scriptOptions: Options;
  createRegister: RegisterFactory;
  file: Parser.File;

  static SUPPORTED_FEATURES: readonly Parser.Feature[] = Features;

  constructor(options: Parser.Options) {
    super();

    this.options = { ...options };
    this.features = options.features || Features;
    this.scope = {};
    this.ignoredVisibilities = options.ignoredVisibilities || DEFAULT_IGNORED_VISIBILITIES;
    this.asyncOperations = [];
    this.plugins = [];
    this.composition = new Composition(options.composition);
    this.scriptOptions = {
      jsx: this.options.jsx || false,
      composition: this.options.composition || {},
      resolver: this.options.resolver,
      encoding: this.options.encoding || 'utf8',
      loaders: this.options.loaders,
    };

    this.createRegister = (source = this.file.script, file = this.file) => {
      return new ScriptRegisterParser(this, source, file, this.scriptOptions, this.createRegister);
    };

    parseLoaders(options);
    this.parsePlugins();
    this.parseOptions();

    this.fs = new FS({
      jsx: options.jsx || false,
      loaders: options.loaders,
      encoding: options.encoding || 'utf8',
      resolver: options.resolver,
    });
  }

  static validateOptions(options) {
    if (!options.filename && !('filecontent' in options)) {
      throw new Error('options.filename or options.filecontent is required');
    }

    if (options.features) {
      if (!Array.isArray(options.features)) {
        throw new TypeError('options.features must be an array');
      }

      options.features.forEach((feature) => {
        if (!Features.includes(feature)) {
          throw new Error(`Unknow '${feature}' feature. Supported features: ${JSON.stringify(Features)}`);
        }
      });
    }
  }

  parseOptions() {
    if (this.options.filename && isAbsolute(this.options.filename) && !this.options.resolver?.basedir) {
      if (!this.options.resolver) {
        this.options.resolver = {};
      }

      this.options.resolver.basedir = dirname(this.options.filename);
    }
  }

  parsePlugins() {
    if (this.options.plugins) {
      for (const plugin of this.options.plugins) {
        const def = plugin(this);

        if (def) {
          this.plugins.push(def);

          if (def.resolver) {
            merge(this.options.resolver, def.resolver);
          }

          if (def.composition) {
            this.composition.unshift(def.composition);
          }
        }
      }
    }
  }

  preloadPlugins() {
    for (const plugin of this.plugins) {
      if (plugin.preload instanceof Array) {
        for (const filename of plugin.preload) {
          const file = this.fs.loadFile(filename);

          if (file.script) {
            const register = this.createRegister(file.script, file);

            register.parseAst(file.script.ast.program);
            Object.assign(this.scope, register.exposedScope);
          }
        }
      }
    }
  }

  reset() {
    clear(this.scope);
    this.asyncOperations.splice(0);
  }

  emitEntry(entry: Entry.Type) {
    if ('visibility' in entry && this.isIgnoredVisibility(entry.visibility)) {
      return;
    }

    if ('keywords' in entry) {
      const contentsAnIgnoredKeyword = entry.keywords.some(({ name }) => IGNORED_KEYWORDS.includes(name));

      if (contentsAnIgnoredKeyword) {
        return;
      }
    }

    this.dispatchEvent(new EntryEvent(entry));
  }

  emitWarning(message: string) {
    this.dispatchEvent(new MessageEvent('warning', message));
  }

  emitError(message: string) {
    this.dispatchEvent(new MessageEvent('error', message));
  }

  emitEnd() {
    this.dispatchEvent(new EndEvent());
  }

  protected isIgnoredVisibility(visibility: Entry.Visibility) {
    return this.ignoredVisibilities.includes(visibility);
  }

  execAsync(fn: AsyncOperation) {
    this.asyncOperations.push(fn());
  }

  createScriptParser(source: Required<Parser.Script>, file: Readonly<File>) {
    if (!source.attrs.setup) {
      source.attrs.setup = CompositionParser.isCompositionScript(source.ast.program);
    }

    return source.attrs.setup
      ? new CompositionParser(this, source, file, this.scriptOptions, this.createRegister)
      : new ScriptParser(this, source, file, this.scriptOptions, this.createRegister);
  }

  walk() {
    VuedocParser.validateOptions(this.options);
    this.preloadPlugins();

    try {
      if ('filecontent' in this.options) {
        this.file = this.fs.loadContent('vue', this.options.filecontent);
      } else if (this.options.filename) {
        this.file = this.fs.loadFile(this.options.filename);
      }
    } catch (err) {
      if (err instanceof ParsingError) {
        this.emitWarning(err.message);
        this.emitEnd();
      } else {
        this.emitError(err.message);
        this.emitEnd();

        return;
      }
    }

    if (!this.file) {
      throw new Error('Unable to load main component file. Make sure to define options.filename or options.filecontent');
    }

    let hasNameEntry = false;

    if (this.features.includes(Feature.name)) {
      this.addEventListener(FeatureEvent.name, () => {
        hasNameEntry = true;
      }, { once: true });
    }

    if (this.file.script) {
      try {
        this.createScriptParser(this.file.script, this.file).parse();
      } catch (err) {
        this.emitError(err.message);
      }
    }

    if (this.file.template?.content) {
      new MarkupTemplateParser(this, this.file.template).parse();
    }

    setTimeout(async () => {
      await Promise.all(this.asyncOperations);

      if (!hasNameEntry && this.features.includes(Feature.name)) {
        this.parseComponentName();
      }

      this.emitEnd();
      this.reset();
    }, 0);
  }

  parseComponentName() {
    if (this.options.filename) {
      const name = parse(this.options.filename).name;
      const entry = new NameEntry(name);

      this.emitEntry(entry);
    }
  }
}
