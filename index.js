import path from 'path';

import { Loader } from './lib/Loader.js';
import { Parser } from './lib/parser/Parser.js';
import { VueLoader } from './loader/vue.js';
import { HtmlLoader } from './loader/html.js';
import { JavaScriptLoader } from './loader/javascript.js';
import { TypeScriptLoader } from './loader/typescript.js';
import { Feature, DEFAULT_IGNORED_VISIBILITIES, DEFAULT_ENCODING } from './lib/Enum.js';
import { KeywordsUtils } from './lib/utils/KeywordsUtils.js';

export { Loader } from './lib/Loader.js';
export { Parser } from './lib/parser/Parser.js';

const DEFAULT_LOADERS = [
  Loader.extend('js', JavaScriptLoader),
  Loader.extend('ts', TypeScriptLoader),
  Loader.extend('html', HtmlLoader),
  Loader.extend('vue', VueLoader),
];

export async function parseOptions(options) {
  if (!options) {
    /* eslint-disable max-len */
    throw new Error('Missing options argument');
  }

  if (!options.filename && !options.filecontent) {
    /* eslint-disable max-len */
    throw new Error('One of options.filename or options.filecontent is required');
  }

  if (!options.encoding) {
    options.encoding = DEFAULT_ENCODING;
  }

  if (!options.ignoredVisibilities) {
    options.ignoredVisibilities = DEFAULT_IGNORED_VISIBILITIES;
  }

  if (!Array.isArray(options.loaders)) {
    options.loaders = [...DEFAULT_LOADERS];
  } else {
    options.loaders.push(...DEFAULT_LOADERS);
  }

  options.source = {
    template: '',
    script: '',
    errors: [],
  };

  if (options.filename) {
    const ext = path.extname(options.filename);
    const loaderName = ext.substring(1);
    const LoaderClass = Loader.get(loaderName, options);
    const source = await Loader.getFileContent(options.filename, {
      encoding: options.encoding,
    });

    return new LoaderClass(options).load(source);
  }

  return new VueLoader(options).load(options.filecontent);
}

export async function parse(options) {
  await parseOptions(options);

  return new Promise((resolve) => {
    const component = {
      inheritAttrs: true,
      errors: [],
      warnings: [],
      keywords: [],
    };

    const parser = new Parser(options);

    if (options.source.errors.length) {
      component.errors = options.source.errors;
    }

    parser.on('error', ({ message }) => {
      component.errors.push(message);
    });

    parser.on('warning', (message) => {
      component.warnings.push(message);
    });

    parser.on('keywords', ({ value }) => {
      component.keywords.push(...value);
      KeywordsUtils.parseCommonEntryTags(component);
    });

    parser.on('end', () => resolve(component));

    parser.on('inheritAttrs', ({ value }) => {
      component.inheritAttrs = value;
    });

    parser.features.forEach((feature) => {
      switch (feature) {
        case Feature.name:
        case Feature.description:
          parser.on(feature, ({ value }) => {
            component[feature] = value;
          });
          break;

        case Feature.model:
          parser.on(feature, (model) => {
            component[feature] = model;
          });
          break;

        default: {
          const eventName = Parser.getEventName(feature);

          component[feature] = [];

          parser.on(eventName, (entry) => {
            const index = component[feature].findIndex((item) => item.name === entry.name);

            if (index > -1) {
              component[feature].splice(index, 1, entry);
            } else {
              component[feature].push(entry);
            }
          });
        }
      }
    });

    parser.walk();
  });
}
