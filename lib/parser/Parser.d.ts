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

  export interface NameEntry {
    kind: 'name';
    value: string;
  }
  
  export interface DescriptionEntry {
    kind: 'description'
    value: string;
  }
  
  export interface InheritAttrsEntry {
    kind: 'inheritAttrs'
    value: boolean;
  }
  
  export interface KeywordsEntry {
    kind: 'keywords';
    value: Keyword[];
  }
  
  export interface ModelEntry {
    kind: 'model';
    prop: string;
    event: string;
    description?: string;
    keywords: Keyword[];
  }
  
  export type Keyword = {
    name: string;
    description?: string;
  };
}
