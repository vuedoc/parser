import { Entry } from './Entry';
import { Loader } from './Loader';
import { Parser } from './Parser';

export * from './Loader';
export * from './Parser';
export * from '../src/lib/Enum.js';

declare type ExtendedParsingResult = ParsingResult & {
  model?: Entry.ModelEntry[];
};

export declare class Loader extends Loader.Interface {}
export declare class VuedocParser extends Parser.Interface {}

export declare function parseOptions(options: ParsingOptions): Promise<Parser.Options>;
export declare function synchronizeParsingResult(parser: ParserNS, component: ExtendedParsingResult): void;
export declare function parseComponent(options: ParsingOptions): Promise<ParsingResult>;

export type PluginInterface = Parser.ParsingPlugin<IndexPlugin>;

export type IndexPlugin = {
  handleParsingResult?(component: ParseResult): void;
};

export type ParsingOptions = Parser.Options & {
  /**
   * Use this option to define custom loaders
   */
  loaders?: Loader.Definition[];
  /**
   * User parsing plugins
   */
  plugins?: PluginInterface[];
};

export type ParsingResult = {
  name?: string;
  description?: string;
  category?: string;
  version?: string;
  since?: string;
  see?: string;
  inheritAttrs: boolean;
  keywords: Entry.Keyword[];
  slots?: Entry.SlotEntry[];
  props?: Entry.PropEntry[];
  data?: Entry.DataEntry[];
  computed?: Entry.ComputedEntry[];
  events?: Entry.EventEntry[];
  methods?: Entry.MethodEntry[];
  errors: string[];
  warnings: string[];
};
