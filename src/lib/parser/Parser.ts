import path from 'path';
import EventEmitter from 'events';

import { Options, parseAst, ScriptParser } from './ScriptParser.js';
import { MarkupTemplateParser } from './MarkupTemplateParser.js';
import { CompositionParser } from './CompositionParser.js';

import { NameEntry } from '../entity/NameEntry.js';
import { Feature, Features, DEFAULT_IGNORED_VISIBILITIES, CompositionAPIValues, TypedocTag, JSDocTag } from '../Enum.js';
import { Vuedoc } from '../../../types/index.js';

type AsyncOperation = () => Promise<void>;

const IGNORED_KEYWORDS = [TypedocTag.hidden, JSDocTag.ignore];

export class Parser extends EventEmitter {
  options: Vuedoc.Parser.ResolvedOptions;
  features: Vuedoc.Parser.Feature[];
  scope: Vuedoc.Parser.Scope;
  ignoredVisibilities: Vuedoc.Parser.Visibility[];
  eventsEmmited: string[];
  composition: readonly ('computed' | 'ref' | '$ref' | 'unref' | 'reactive' | '$computed' | 'readonly' | 'shallowRef' | '$shallowRef' | 'shallowReactive' | 'shallowReadonly' | 'triggerRef' | 'toRaw' | 'markRaw' | 'toRef' | '$toRef')[];
  protected asyncOperations: Promise<void>[];
  static SUPPORTED_FEATURES: readonly Vuedoc.Parser.Feature[] = Features;

  constructor(options: Vuedoc.Parser.ResolvedOptions) {
    super();

    this.options = options;
    this.features = options.features || Features;
    this.scope = {};
    this.ignoredVisibilities = options.ignoredVisibilities || DEFAULT_IGNORED_VISIBILITIES;
    this.eventsEmmited = [];
    this.asyncOperations = [];
    // FIXME Check options.composition
    this.composition = options.composition
      ? CompositionAPIValues.concat(...Object.values(options.composition).flat() as any)
      : CompositionAPIValues;
  }

  static validateOptions(options) {
    if (!options.source) {
      throw new Error('options.source is required');
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

  emitEntry(entry: Vuedoc.Entry.Type) {
    // FIXME Fix Parser.options.hooks.beforeEntryEmit(entry);
    // if (this.options.hooks?.beforeEntryEmit && entry) {
    //   this.options.hooks.beforeEntryEmit(entry);
    // }

    if ('visibility' in entry && this.isIgnoredVisibility(entry.visibility)) {
      return;
    }

    if ('keywords' in entry && entry.keywords.length) {
      const contentsAnIgnoredKeyword = entry.keywords.some(({ name }) => IGNORED_KEYWORDS.includes(name));

      if (contentsAnIgnoredKeyword) {
        return;
      }
    }

    this.emit(entry.kind, entry);
  }

  protected isIgnoredVisibility(visibility: Vuedoc.Parser.Visibility) {
    return this.ignoredVisibilities.includes(visibility);
  }

  execAsync(fn: AsyncOperation) {
    this.asyncOperations.push(fn());
  }

  walk() {
    Parser.validateOptions(this.options);

    let hasNameEntry = false;

    if (this.features.includes(Feature.name)) {
      this.on(Feature.name, () => {
        hasNameEntry = true;
      });
    }

    if (this.options.source.script?.content) {
      const options: Options = {
        jsx: this.options.jsx || false,
        composition: this.options.composition,
      };

      try {
        const ast = parseAst(this.options.source.script.content, options);

        if (!this.options.source.script.attrs.setup) {
          this.options.source.script.attrs.setup = CompositionParser.isCompositionScript(ast);
        }

        const parser = this.options.source.script.attrs.setup
          ? new CompositionParser(this, ast, this.options.source.script, options)
          : new ScriptParser(this, ast, this.options.source.script, options);

        parser.parse();

        this.scope = parser.scope;
      } catch (err) {
        this.emit('error', err);
      }
    }

    if (this.options.source.template?.content) {
      new MarkupTemplateParser(this, this.options.source.template).parse();
    }

    if (!hasNameEntry) {
      if (this.features.includes(Feature.name)) {
        this.parseComponentName();
      }
    }

    setTimeout(async () => {
      await Promise.all(this.asyncOperations);
      this.emit('end');
    }, 0);
  }

  parseComponentName() {
    if (this.options.filename) {
      const name = path.parse(this.options.filename).name;
      const entry = new NameEntry(name);

      this.emitEntry(entry);
    }
  }
}
