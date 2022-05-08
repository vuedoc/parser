declare module '@vuedoc/parser/parser/Parser.js' {
  import EventEmitter from 'node:events';

  type Options = {
    /**
     * Source to parse
     */
    source: {
      script?: string;
      template?: string;
    };

    /**
     * The filename to parse
     */
    filename?: string;

    /**
     * The component features to parse and extract
     * @default ['name', 'description', 'slots', 'model', 'props', 'data', 'computed', 'events', 'methods']
     */
    features?: Feature[];

    /**
     * List of ignored visibilities
     * @default ['protected', 'private']
     */
    ignoredVisibilities?: Visibility[];

    /**
     * Set to `true` to enable JSX parsing
     * @default false
     */
    jsx?: boolean;
  };

  type Feature = 'name' | 'description' | 'slots' | 'model' | 'props' | 'data' | 'computed' | 'events' | 'methods';
  type Visibility = 'public' | 'protected' | 'private';

  declare class Parser extends EventEmitter {
    static SUPPORTED_FEATURES: Feature[];
    constructor(options: Options);
    walk(): Parser;
  }

  interface NameEntry {
    kind: 'name';
    value: string;
  }
  
  interface DescriptionEntry {
    kind: 'description'
    value: string;
  }
  
  interface InheritAttrsEntry {
    kind: 'inheritAttrs'
    value: boolean;
  }
  
  interface KeywordsEntry {
    kind: 'keywords';
    value: Keyword[];
  }
  
  interface ModelEntry {
    kind: 'model';
    prop: string;
    event: string;
    description?: string;
    keywords: Keyword[];
  }
  
  type Keyword = {
    name: string;
    description?: string;
  };
}
