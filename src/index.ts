import path from 'node:path';

import { readFile } from 'node:fs/promises';
import { Loader, Options } from './lib/Loader.js';
import { Parser } from './lib/parser/Parser.js';
import { VueLoader } from './loaders/vue.js';
import { HtmlLoader } from './loaders/html.js';
import { JavaScriptLoader } from './loaders/javascript.js';
import { TypeScriptLoader } from './loaders/typescript.js';
import { Feature, DEFAULT_IGNORED_VISIBILITIES, DEFAULT_ENCODING, FeatureEvent } from './lib/Enum.js';
import { KeywordsUtils } from './lib/utils/KeywordsUtils.js';
import { PropEntry } from './lib/entity/PropEntry.js';
import { Vuedoc } from '../types/index.js';

export { Loader } from './lib/Loader.js';
export { Parser } from './lib/parser/Parser.js';

const DEFAULT_LOADERS: Vuedoc.Loader.Definition[] = [
  Loader.extend('js', JavaScriptLoader),
  Loader.extend('ts', TypeScriptLoader),
  Loader.extend('html', HtmlLoader),
  Loader.extend('vue', VueLoader),
];

export async function parseOptions(options: Vuedoc.Index.Options) {
  if (!options) {
    throw new Error('Missing options argument');
  }

  if (!options.encoding) {
    options.encoding = DEFAULT_ENCODING;
  }

  let filecontent: string | null = null;

  if ('filename' in options) {
    if (options.filename) {
      filecontent = await readFile(options.filename, options.encoding as 'utf8');
    } else {
      throw new Error('options.filename cannot be empty');
    }
  }

  if ('filecontent' in options) {
    filecontent = options.filecontent;
  }

  if (filecontent === null) {
    throw new Error('Missing options.filename of options.filecontent');
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

  const loaderOptions: Options = {
    source: options.source,
    definitions: [
      ...DEFAULT_LOADERS,
    ],
  };

  if (options.loaders instanceof Array) {
    loaderOptions.definitions.unshift(...options.loaders);
  }

  if ('filename' in options) {
    const ext = path.extname(options.filename);
    const loaderName = ext.substring(1);
    const LoaderClass: any = Loader.get(loaderName, loaderOptions);
    const loader = new LoaderClass(loaderOptions);

    await loader.load({
      attrs: {
        lang: loaderName,
      },
      content: filecontent,
    });
  } else {
    const loader = new VueLoader(loaderOptions);

    await loader.load({
      attrs: {
        lang: 'vue',
      },
      content: filecontent,
    });
  }

  return options as Vuedoc.Parser.ResolvedOptions;
}

type ExtendedParsingResult = Vuedoc.Index.ParsingResult & {
  model?: Vuedoc.Entry.ModelEntry[];
};

export function synchronizeParsingResult(options: Vuedoc.Index.Options, component: ExtendedParsingResult) {
  const defaultModelProp = options.source.script?.attrs.setup ? 'model-value' : 'value';
  const additionalProps: Vuedoc.Entry.PropEntry[] = [];

  if (!component.props) {
    component.props = [];
  }

  component.model?.forEach((model) => {
    const props = component.props?.filter((prop) => prop.name === model.prop);

    if (props?.length) {
      for (const prop of props) {
        prop.describeModel = true;
      }
    } else {
      const prop = new PropEntry({
        name: model.prop,
        describeModel: true,
      });

      prop.description = model.description;
      prop.keywords = model.keywords;

      additionalProps.push(prop);
    }
  });

  component.props.push(...additionalProps);
  delete component.model;

  if (Feature.props in component) {
    for (const prop of component.props) {
      if (prop.name === defaultModelProp) {
        prop.describeModel = true;
      }

      if (prop.describeModel) {
        prop.name = 'v-model';
      } else if (options.source.script?.attrs.setup && Feature.events in component) {
        const hasUpdateEvent = component.events?.some((event) => event.name === `update:${prop.name}`);

        if (hasUpdateEvent) {
          prop.name = `v-model:${prop.name}`;
          prop.describeModel = true;
        }
      }
    }
  }
}

export async function parseComponent(options: Vuedoc.Index.Options): Promise<Vuedoc.Index.ParsingResult> {
  const resolvedOptions = await parseOptions(options);

  return new Promise((resolve) => {
    const component: ExtendedParsingResult = {
      inheritAttrs: true,
      errors: [...options.source.errors],
      warnings: [],
      keywords: [],
      model: [],
    };

    const parser = new Parser(resolvedOptions);

    parser.on('error', ({ message }) => {
      component.errors.push(message);
    });

    parser.on('warning', (message) => {
      component.warnings.push(message);
    });

    parser.on(FeatureEvent.keywords, ({ value }) => {
      component.keywords.push(...value);
      KeywordsUtils.parseCommonEntryTags(component);
    });

    parser.on('inheritAttrs', ({ value }) => {
      component.inheritAttrs = value;
    });

    parser.on('model', handleEventEntry(component.model));

    parser.on('end', () => {
      synchronizeParsingResult(options, component);

      // FIXME Handle options.hooks
      // if (options.hooks?.handleParsingResult) {
      //   options.hooks.handleParsingResult(component);
      // }

      resolve(component);
    });

    for (const feature of parser.features) {
      switch (feature) {
        case Feature.name:
        case Feature.description:
          parser.on(feature, ({ value }) => {
            component[feature] = value;
          });
          break;

        case Feature.keywords:
          // already handled
          break;

        default: {
          const eventName = FeatureEvent[feature];
          const items: Vuedoc.Entry.TypeKeywords[] = [];

          component[feature as string] = items;

          parser.on(eventName, handleEventEntry(items));
          break;
        }
      }
    }

    parser.walk();
  });
}

function handleEventEntry(items: Vuedoc.Entry.TypeKeywords[]) {
  return (entry: Vuedoc.Entry.TypeKeywords) => {
    const index = items.findIndex((item) => item.name === entry.name);

    if (index > -1) {
      items.splice(index, 1, entry);
    } else {
      items.push(entry);
    }
  };
}
