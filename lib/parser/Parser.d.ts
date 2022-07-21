declare module '@vuedoc/parser/parser/Parser.js' {
  import EventEmitter from 'node:events';


  export type Options = {
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
     * @default ['name', 'description', 'slots', 'props', 'data', 'computed', 'events', 'methods']
     */
    features?: Feature[];

    /**
     * List of ignored visibilities
     * @default ['protected', 'private']
     */
    ignoredVisibilities?: Visibility[];

    /**
     * Additional composition tokens for advanced components
     */
    composition?: {
      data?: string[];
      props?: string[];
      computed?: string[];
      methods?: string[];
    };

    /**
     * Set to `true` to enable JSX parsing
     * @default false
     */
    jsx?: boolean;
  };

  export type Feature = 'name' | 'description' | 'slots' | 'props' | 'data' | 'computed' | 'events' | 'methods';
  export type Visibility = 'public' | 'protected' | 'private';

  export declare class Parser extends EventEmitter {
    static SUPPORTED_FEATURES: Feature[];
    constructor(options: Options);
    walk(): Parser;
  }

  export type ParsingEntry = ComputedEntry
    | DataEntry
    | DescriptionEntry
    | EventEntry
    | InheritAttrsEntry
    | KeywordsEntry
    | MethodEntry
    | ModelEntry
    | NameEntry
    | PropEntry
    | SlotEntry;
  
  export type Keyword = {
    name: string;
    description?: string;
  };

  export interface AbstractEntry<Kind extends string> {
    kind: Kind;
    description?: string;
    category?: string;
    version?: string;
    visibility: Visibility;
    keywords: Keyword[];
  }

  export interface ComputedEntry extends AbstractEntry<'computed'> {
    type: string;
    name: string;
    dependencies: string[];
  }

  export interface DataEntry extends AbstractEntry<'data'> {
    type: string;
    name: string;
    initialValue: string;
  }
  
  export interface DescriptionEntry extends AbstractEntry<'description'> {
    value: string;
  }

  export interface EventEntry extends AbstractEntry<'event'> {
    name: string;
    arguments: Array<{
      name: string;
      type: string;
      description: string;
      rest: boolean;
    }>;
  }
  
  export interface InheritAttrsEntry extends AbstractEntry<'inheritAttrs'> {
    value: boolean;
  }
  
  export interface KeywordsEntry extends AbstractEntry<'keywords'> {
    value: Keyword[];
  }

  export interface MethodEntry extends AbstractEntry<'method'> {
    name: string;
    syntax: string[];
    params: Array<{
      name: string;
      type: string;
      description: string;
      defaultValue: string;
      rest: boolean;
    }>;
    returns: {
      type: string;
      description?: string;
    };
  }
  
  export interface ModelEntry extends AbstractEntry<'model'> {
    prop: string;
    event: string;
  }

  export interface NameEntry extends AbstractEntry<'name'> {
    value: string;
  }

  export interface PropEntry extends AbstractEntry<'prop'> {
    type: string;
    name: string;
    default: string;
    required: boolean;
    describeModel: boolean;
  }

  export interface SlotEntry extends AbstractEntry<'slot'> {
    name: string;
    description?: string;
    props: Array<{
      name: string;
      type: string;
      description?: string;
    }>;
  }
}
