import { VuedocParser } from './parsers/VuedocParser.js';
import { Parser } from '../types/Parser.js';
import { Entry } from '../types/Entry.js';
import { Feature, DEFAULT_IGNORED_VISIBILITIES, DEFAULT_ENCODING, FeatureEvent } from './lib/Enum.js';
import { KeywordsUtils } from './utils/KeywordsUtils.js';
import { PropEntry } from './entity/PropEntry.js';
import { ParsingOptions, ParsingResult } from '../types/index.js';

export * from './lib/Enum.js';
export { Loader } from './lib/Loader.js';
export { VuedocParser } from './parsers/VuedocParser.js';

type ExtendedParsingResult = ParsingResult & {
  model?: Entry.ModelEntry[];
};

export async function parseOptions(options: ParsingOptions) {
  if (!options) {
    throw new Error('Missing options argument');
  }

  const _options = { ...options };

  if (!_options.encoding) {
    _options.encoding = DEFAULT_ENCODING;
  }

  if ('filename' in _options && !_options.filename) {
    throw new Error('options.filename cannot be empty');
  }

  if (!_options.ignoredVisibilities) {
    _options.ignoredVisibilities = DEFAULT_IGNORED_VISIBILITIES;
  }

  _options.composition = {
    data: _options.composition?.data || [],
    methods: _options.composition?.methods || [],
    computed: _options.composition?.computed || [],
    props: _options.composition?.props || [],
  };

  if (!_options.resolver) {
    _options.resolver = {};
  }

  return _options as Parser.Options;
}

export function synchronizeParsingResult(parser: VuedocParser, component: ExtendedParsingResult) {
  const defaultModelProp = parser.file.script?.attrs.setup ? 'model-value' : 'value';
  const additionalProps: Entry.PropEntry[] = [];

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
      } else if (parser.file.script?.attrs.setup && Feature.events in component) {
        const hasUpdateEvent = component.events?.some((event) => event.name === `update:${prop.name}`);

        if (hasUpdateEvent) {
          prop.name = `v-model:${prop.name}`;
          prop.describeModel = true;
        }
      }
    }
  }
}

export async function parseComponent(options: ParsingOptions): Promise<ParsingResult> {
  const resolvedOptions = await parseOptions(options);

  return new Promise((resolve) => {
    const component: ExtendedParsingResult = {
      name: undefined,
      description: undefined,
      category: undefined,
      since: undefined,
      version: undefined,
      see: undefined,
      inheritAttrs: true,
      errors: [],
      warnings: [],
      keywords: [],
      model: [],
      props: undefined,
      data: undefined,
      computed: undefined,
      methods: undefined,
      events: undefined,
      slots: undefined,
    };

    const parser: Parser.Private = new VuedocParser(resolvedOptions);

    parser.addEventListener('error', (event) => {
      component.errors.push(event.message);
    });

    parser.addEventListener('warning', (event) => {
      component.warnings.push(event.message);
    });

    parser.addEventListener<Entry.KeywordsEntry>('keyword', ({ entry }) => {
      component.keywords.push(...entry.value);
      KeywordsUtils.parseCommonEntryTags(component);
    });

    parser.addEventListener<Entry.InheritAttrsEntry>('inheritAttrs', ({ entry }) => {
      component.inheritAttrs = entry.value;
    });

    parser.addEventListener<Entry.ModelEntry>('model', handleEventEntry(component.model));

    parser.addEventListener('end', () => {
      if ('file' in parser) {
        synchronizeParsingResult(parser as any, component);
      }

      for (const plugin of (parser as VuedocParser).plugins) {
        if ('handleParsingResult' in plugin) {
          plugin.handleParsingResult(component);
        }
      }

      resolve(component);
    });

    for (const feature of parser.features) {
      const eventName: any = FeatureEvent[feature];

      switch (feature) {
        case Feature.name:
        case Feature.description:
          parser.addEventListener<Entry.NameEntry | Entry.DescriptionEntry>(eventName, ({ entry }) => {
            component[feature as any] = entry.value;
          });
          break;

        case Feature.keywords:
          // already handled
          break;

        default: {
          const items: Entry.TypeKeywords[] = [];

          component[feature as string] = items;

          parser.addEventListener<Entry.TypeKeywords>(eventName, handleEventEntry(items));
          break;
        }
      }
    }

    parser.walk();
  });
}

function handleEventEntry(items: Entry.TypeKeywords[]) {
  return ({ entry }: Parser.EntryEvent<Entry.TypeKeywords>) => {
    const index = items.findIndex((item) => item.name === entry.name);

    if (index > -1) {
      items.splice(index, 1, entry);
    } else {
      items.push(entry);
    }
  };
}
