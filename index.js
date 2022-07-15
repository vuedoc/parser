import path from 'path';

import { Loader } from './lib/Loader.js';
import { Parser } from './lib/parser/Parser.js';
import { VueLoader } from './loaders/vue.js';
import { HtmlLoader } from './loaders/html.js';
import { JavaScriptLoader } from './loaders/javascript.js';
import { TypeScriptLoader } from './loaders/typescript.js';
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

  options.composition = {
    data: options.composition?.data || [],
    methods: options.composition?.methods || [],
    computed: options.composition?.computed || [],
    props: options.composition?.props || [],
  };

  options.source = {
    errors: [],
  };

  const loaderOptions = {
    ...options,
    definitions: [
      ...DEFAULT_LOADERS,
    ],
  };

  if (options.loaders instanceof Array) {
    loaderOptions.definitions.unshift(...options.loaders);
  }

  if (options.filename) {
    const ext = path.extname(options.filename);
    const loaderName = ext.substring(1);
    const LoaderClass = Loader.get(loaderName, loaderOptions);
    const source = await Loader.getFileContent(options.filename, {
      encoding: options.encoding,
    });

    const loader = new LoaderClass(loaderOptions);

    await loader.load({
      attrs: {
        lang: loaderName,
      },
      content: source,
    });
  } else {
    const loader = new VueLoader(loaderOptions);

    await loader.load({
      attrs: {
        lang: 'vue',
      },
      content: options.filecontent,
    });
  }
}

export async function parseComponent(options) {
  await parseOptions(options);

  return new Promise((resolve) => {
    const component = {
      inheritAttrs: true,
      errors: [...options.source.errors],
      warnings: [],
      keywords: [],
    };

    const parser = new Parser(options);

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
