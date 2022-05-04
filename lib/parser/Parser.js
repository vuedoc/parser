import path from 'path';
import EventEmitter from 'events';

import { ScriptParser } from './ScriptParser';
import { MarkupTemplateParser } from './MarkupTemplateParser';

import { NameEntry } from '../entity/NameEntry';
import { Feature, Features, DEFAULT_IGNORED_VISIBILITIES } from '../Enum';

export class Parser extends EventEmitter {
  constructor (options) {
    super();

    this.options = options;
    this.features = options.features || Features;
    this.scope = {};

    this.ignoredVisibilities = options.ignoredVisibilities || DEFAULT_IGNORED_VISIBILITIES;
  }

  static validateOptions (options) {
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

  static getEventName (feature) {
    return feature.endsWith('s')
      ? feature.substring(0, feature.length - 1)
      : feature;
  }

  isIgnoredVisibility (item) {
    return this.ignoredVisibilities.includes(item);
  }

  walk () {
    Parser.validateOptions(this.options);

    let hasNameEntry = false;

    if (this.features.includes(Feature.name)) {
      this.on(Feature.name, () => {
        hasNameEntry = true;
      });
    }

    process.nextTick(() => {
      if (this.options.source.script) {
        const options = {
          jsx: this.options.jsx || false
        };
  
        new ScriptParser(this, this.options.source.script, options).parse();
      }
  
      if (this.options.source.template) {
        new MarkupTemplateParser(this, this.options.source.template).parse();
      }
  
      if (!hasNameEntry) {
        if (this.features.includes(Feature.name)) {
          this.parseComponentName();
        }
      }

      setTimeout(() => this.emit('end'), 0);
    });

    return this;
  }

  parseComponentName () {
    if (this.options.filename) {
      const entry = new NameEntry();

      entry.value = path.parse(this.options.filename).name;

      this.emit(entry.kind, entry);
    }
  }
}

Parser.SUPPORTED_FEATURES = Features;
