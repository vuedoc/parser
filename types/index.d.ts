import EventEmitter from 'node:events';

// eslint-disable-next-line import/extensions
import { PropType } from '@b613/utils/typings';
import { ParseResult } from '@babel/parser';
import { Value } from '../src/lib/entity/Value.js';

import * as Babel from '@babel/types';

export { Loader } from './lib/Loader.js';
export { Parser } from './lib/parser/Parser.js';

export declare namespace Vuedoc {
  namespace Parser {
    type Options = {
      /**
       * Source to parse
       */
      source: {
        template?: Source;
        script?: Script;
        errors: string[];
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
       * Additional composition tokens for advanced components.
       * This option is useful when you're using third library which expose
       * composition functions.
       */
      composition?: Partial<ParsingComposition>;

      /**
       * Set to `true` to enable JSX parsing
       * @default false
       */
      jsx?: boolean;

      /**
       * User parsing plugins
       */
      plugins?: Plugin[];
    };

    /**
     * @example Example 1:
     * Given the folowing SFC file:
     *
     * ```html
     * <script setup>
     *   const { hello, greeting } = useStorage('my-store', { hello: 'hi', greeting: 'Hello' });
     * </script>
     * ```
     *
     * The composition parser could be:
     *
     * ```js
     * {
     *   fname: 'useStorage',
     *   valueIndex: 1,
     *   ignoreVariableId: false,
     * }
     * ```
     * @example Example 2:
     * Given the folowing SFC file:
     *
     * ```html
     * <script setup>
     *   const state = useStorage('my-store', { hello: 'hi', greeting: 'Hello' });
     * </script>
     * ```
     *
     * The composition parser could be:
     *
     * ```js
     * {
     *   fname: 'useStorage',
     *   valueIndex: 1,
     *   ignoreVariableId: true,
     * }
     * ```
     */
    type Composition = {
      /**
       * The composition function name.
       * Example 'useAttrs`
       */
      fname: string;
      /**
       * Define which index of the argument list will be parsed as a value.
       */
      valueIndex?: number;
      /**
       * Whether or not the identifier of the variable should be ignored.
       * For example, given `const attrs = useAttrs()`, `attrs` will be
       * emited as a component data if `options.ignoreVariableId = true`.
       * @default false
       */
      ignoreVariableId?: boolean;
    };

    type ParsingComposition = {
      /**
       * Provided composition items will be parsed as component data
       */
      data: Composition[];
      /**
       * Provided composition items will be parsed as component props
       */
      props: Composition[];
      /**
       * Provided composition items will be parsed as component computed
       * properties
       */
      computed: Composition[];
      /**
       * Provided composition items will be parsed as component methods
       */
      methods: Composition[];
      /**
       * Provided composition items will be parsed as component events
       */
      events: Composition[];
    };

    type ResolvedOptions = Omit<Options, 'composition'> & {
      /**
       * Additional composition tokens for advanced components
       */
      composition: ParsingComposition;
    };

    interface Plugin {
      init?(options: ResolvedOptions): void;
      /**
       * Intercept parsing entry before emition
       * @param entry Parsed entry ready for emition
       */
      onEmit?(entry: Entry.Type): void;
    }

    type Type = string;
    type Feature = 'name' | 'description' | 'keywords' | 'slots' | 'props' | 'data' | 'computed' | 'events' | 'methods';
    type Visibility = 'public' | 'protected' | 'private';

    type Source<Attrs extends object = object> = {
      content: string;
      attrs: Attrs & {
        lang?: string;
        [additionalAttribute: string]: string | undefined;
      };
    };

    type Script = Source<{
      setup?: boolean;
    }>;

    type Scope<TypeValue = string, NodeValue = unknown, NoteType = NodeValue> = Record<
      string,
      ScopeEntry<TypeValue, NodeValue, NoteType>
    >;

    type ScopeEntry<TypeValue = string, NodeValue = unknown, NoteType = NodeValue> = {
      value: Value<TypeValue>;
      node?: {
        value: NodeValue;
        type: NoteType;
        comment: NoteType;
      };
    };

    namespace AST {
      type File = Babel.File;
      type Result = ParseResult<File>;
      type Program = Babel.Program;
      type Statement = Babel.Statement;

      interface VariableDeclaration extends Babel.VariableDeclaration {
        declarations: Array<Babel.VariableDeclarator & {
          id: LVal;
        }>;
      }

      type LVal = Babel.LVal & {
        name: string;
      };

      type Node = (Babel.Expression | Babel.Node) & {
        typeParameters?: Babel.TSTypeParameterInstantiation | null;
      };

      type x = Babel.CallExpression
        | Babel.NewExpression
        | Babel.OptionalCallExpression;
    }

    class Parser extends EventEmitter {
      static SUPPORTED_FEATURES: Feature[];
      constructor(options: Options);
      walk(): Parser;
    }
  }

  namespace Entry {
    type Kind = 'computed'
      | 'data'
      | 'description'
      | 'event'
      | 'inheritAttrs'
      | 'keyword'
      | 'method'
      | 'model'
      | 'name'
      | 'prop'
      | 'slot';

    type Type = TypeKeywords
      | DescriptionEntry
      | InheritAttrsEntry
      | KeywordsEntry
      | NameEntry;

    type TypeKeywords = ComputedEntry
      | DataEntry
      | EventEntry
      | MethodEntry
      | ModelEntry
      | PropEntry
      | SlotEntry;

    type Keyword = {
      name: string;
      description?: string;
    };

    interface AbstractEntry<T extends Kind> {
      kind: T;
      description?: string;
      category?: string;
      version?: string;
      visibility: Visibility;
      keywords: Keyword[];
    }

    interface ComputedEntry extends AbstractEntry<'computed'> {
      type: Parser.Type;
      name: string;
      dependencies: string[];
    }

    interface DataEntry extends AbstractEntry<'data'> {
      type: Parser.Type;
      name: string;
      initialValue: string;
    }

    interface DescriptionEntry {
      kind: 'description';
      value: string;
    }

    interface EventEntry extends AbstractEntry<'event'> {
      name: string;
      arguments: Param[];
    }

    interface InheritAttrsEntry {
      kind: 'inheritAttrs';
      value: boolean;
    }

    interface KeywordsEntry {
      kind: 'keyword';
      value: Keyword[];
    }

    interface Param {
      name: string;
      type: Parser.Type | Parser.Type[];
      description?: string;
      defaultValue?: string;
      rest?: boolean;
    }

    interface MethodReturns {
      type: Parser.Type | Parser.Type[];
      description?: string;
    }

    interface MethodEntry extends AbstractEntry<'method'> {
      name: string;
      syntax: string[];
      params: Param[];
      returns: MethodReturns;
    }

    interface ModelEntry extends AbstractEntry<'model'> {
      name: string;
      prop: string;
      event: string;
    }

    interface NameEntry {
      kind: 'name';
      value: string;
    }

    type PropFunction = Pick<MethodEntry, 'name' | 'description' | 'syntax' | 'params' | 'returns' | 'keywords'>;

    interface PropEntry extends AbstractEntry<'prop'> {
      type: Parser.Type;
      name: string;
      default: string;
      required: boolean;
      describeModel: boolean;
      function?: PropFunction;
    }

    type SlotProp = {
      name: string;
      type: Parser.Type;
      description?: string;
    };

    interface SlotEntry extends AbstractEntry<'slot'> {
      name: string;
      description?: string;
      props: SlotProp[];
    }
  }

  namespace Index {
    type PartialFilenameOptions = Required<Pick<Parser.Options, 'filename'>>;
    type PartialFilecontentOptions = {
      /**
       * The file content to parse
       */
      filecontent: string;
    };

    type BasicOptions = Omit<Parser.Options, 'filename'> & {
      /**
       * The file encoding
       * @default 'utf8'
       */
      encoding?: string;
      /**
       * Use this option to define custom loaders
       */
      loaders?: Loader.Definition[];
    };

    type Options = (PartialFilenameOptions | PartialFilecontentOptions) & BasicOptions;

    type ParsingResult = {
      name?: string;
      description?: string;
      category?: string;
      version?: string;
      since?: string;
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
  }

  namespace Loader {
    abstract class Interface {
      static extend(name: LoaderName, loader: Interface): Definition;
      abstract load(data: ScriptData | TemplateData): Promise<void>;
      emitTemplate(data: TemplateData): void;
      emitScript(data: ScriptData): void;
      emitErrors(errors: string[]): void;
      pipe(name: string, data: ScriptData | TemplateData): Promise<void>;
    }

    type ScriptData = Parser.Script;
    type TemplateData = Parser.Source;

    /**
     * The loader name, which is either the extension of the file or the value of
     * the attribute `lang`
     */
    type LoaderName = string;

    type Definition = {
      name: LoaderName;
      loader: Interface;
    };
  }
}

export declare function parseOptions(options: Vuedoc.Index.Options): Promise<Vuedoc.Parser.ResolvedOptions>;
declare type ExtendedParsingResult = Vuedoc.Index.ParsingResult & {
    model?: Vuedoc.Entry.ModelEntry[];
};
export declare function synchronizeParsingResult(options: Vuedoc.Index.Options, component: ExtendedParsingResult): void;
export declare function parseComponent(options: Vuedoc.Index.Options): Promise<Vuedoc.Index.ParsingResult>;
