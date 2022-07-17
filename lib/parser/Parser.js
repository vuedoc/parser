import path from 'path';
import EventEmitter from 'events';

import { parseAst, ScriptParser } from './ScriptParser.js';
import { MarkupTemplateParser } from './MarkupTemplateParser.js';
import { CompositionParser } from './CompositionParser.js';

import { NameEntry } from '../entity/NameEntry.js';
import { Feature, Features, DEFAULT_IGNORED_VISIBILITIES } from '../Enum.js';

export class Parser extends EventEmitter {
  constructor(options) {
    super();

    this.options = options;
    this.features = options.features || Features;
    this.scope = {};
    this.hasNameEntry = false;
    this.ignoredVisibilities = options.ignoredVisibilities || DEFAULT_IGNORED_VISIBILITIES;
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

  static getEventName(feature) {
    return feature.endsWith('s')
      ? feature.substring(0, feature.length - 1)
      : feature;
  }

  isIgnoredVisibility(item) {
    return this.ignoredVisibilities.includes(item);
  }

  walk() {
    Parser.validateOptions(this.options);

    if (this.features.includes(Feature.name)) {
      this.on(Feature.name, () => {
        this.hasNameEntry = true;
      });
    }

    process.nextTick(() => {
      if (this.options.source.script?.content) {
        const options = {
          jsx: this.options.jsx || false,
          composition: this.options.composition,
        };

        try {
          const ast = parseAst(this.options.source.script.content, options);

          if (!this.options.source.script.attrs.setup) {
            this.options.source.script.attrs.setup = CompositionParser.isCompositionScript(ast);
          }

          if (this.options.source.script.attrs.setup) {
            new CompositionParser(this, ast, this.options.source.script, options).parse();
          } else {
            new ScriptParser(this, ast, this.options.source.script, options).parse();
          }
        } catch (err) {
          this.emit('error', err);
        }
      }

      if (this.options.source.template?.content) {
        new MarkupTemplateParser(this, this.options.source.template).parse();
      }

      if (!this.hasNameEntry) {
        if (this.features.includes(Feature.name)) {
          this.parseComponentName();
        }
      }

      setTimeout(() => this.emit('end'), 0);
    });

    return this;
  }

  parseComponentName() {
    if (this.options.filename) {
      const name = path.parse(this.options.filename).name;
      const entry = new NameEntry(name);

      this.emit(entry.kind, entry);
    }
  }
}

Parser.SUPPORTED_FEATURES = Features;
