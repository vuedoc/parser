import path from 'path';

import { Loader } from './lib/Loader';
import { Parser } from './lib/parser/Parser';
export { Loader } from './lib/Loader';
export { Parser } from './lib/parser/Parser';
import { VueLoader } from './loader/vue';
import { HtmlLoader } from './loader/html';
import { JavaScriptLoader } from './loader/javascript';
import { TypeScriptLoader } from './loader/typescript';
import { Feature, DEFAULT_IGNORED_VISIBILITIES, DEFAULT_ENCODING } from './lib/Enum';
import { KeywordsUtils } from './lib/utils/KeywordsUtils';

const DEFAULT_LOADERS = [
  Loader.extend('js', JavaScriptLoader),
  Loader.extend('ts', TypeScriptLoader),
  Loader.extend('html', HtmlLoader),
  Loader.extend('vue', VueLoader)
];

export function parseOptions(options) {
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
    options.loaders = [ ...DEFAULT_LOADERS ];
  } else {
    options.loaders.push(...DEFAULT_LOADERS);
  }

  options.source = {
    template: '',
    script: '',
    errors: []
  };

  try {
    if (options.filename) {
      const ext = path.extname(options.filename);
      const loaderName = ext.substring(1);
      const LoaderClass = Loader.get(loaderName, options);
      const source = Loader.getFileContent(options.filename, {
        encoding: options.encoding
      });

      return new LoaderClass(options).load(source);
    }

    return new VueLoader(options).load(options.filecontent);
  } catch (e) {
    return Promise.reject(e);
  }
}

export const parse = (options) => parseOptions(options).then(() => new Promise((resolve) => {
  const component = {
    inheritAttrs: true,
    errors: [],
    warnings: [],
    keywords: []
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
}));
