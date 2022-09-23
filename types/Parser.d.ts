import { PropType } from '@b613/utils/typings';
import { ParseResult } from '@babel/parser';
import { ImportResolver } from './ImportResolver';
import { File as FileSystemFile } from './FileSystem';
import { Loader } from './Loader';
import { Entry } from './Entry';

import * as Babel from '@babel/types';

export namespace Parser {
  type FilenameOptions = {
    /**
     * The filename to parse
     */
    filename: string;
  };

  type FilecontentOptions = Partial<FilenameOptions> & {
    /**
     * The SFC file content to parse
     */
    filecontent: string;
  };

  type Options = (FilenameOptions | FilecontentOptions) & {
    /**
     * The file encoding
     * @default 'utf8'
     */
    encoding?: string;

    /**
     * The component features to parse and extract
     * @default ['name', 'description', 'slots', 'props', 'data', 'computed', 'events', 'methods']
     */
    features?: Feature[];

    /**
     * List of ignored visibilities
     * @default ['protected', 'private']
     */
    ignoredVisibilities?: Entry.Visibility[];

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
     * Custom import resolver
     */
    resolver?: ImportResolver;

    /**
     * User loaders definitions
     */
    loaders?: Loader.Definition[];

    /**
     * User parsing plugins
     */
    plugins?: ParsingPlugin[];
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
  type CompositionDeclaration = {
    /**
     * The composition function name.
     * Example 'useAttrs`
     */
    fname: string;
    /**
     * Define which index of the argument list will be parsed as a value.
     * @example
     * For the given codes:
     * - `const name = ref('Chaka')` => we have `valueIndex = 0`
     *                      \_0_/
     * - `const flag = useStorage('my-flag', false)` => we have `valueIndex = 1`
     *                             \__0__/   \_1_/
     */
    valueIndex?: number;
    /**
     * Define which index of the type parameter list will be parsed as a type.
     * @example
     * For the given codes:
     * - `const name = ref<CustomString>('Chaka')` => we have `valueIndex = 0`
     *                     \___ 0 ____/
     */
    typeParameterIndex?: number;
    /**
     * Wheter or not the value from `.valueIndex` can be undefined.
     * This is the case for `const { name } = defineProps<{ name: string }>()`
     */
    valueCanBeUndefined?: boolean;
    /**
     * Use this to define the identifier suffix for the composition value.
     * @example
     * For the given code:
     * - `const name = ref('Chaka')` => we have `identifierSuffixes = ['value']`.
     *   This will help Vuedoc to handle `name.value` as a direct node for the
     *   value `Chaka`.
     */
    identifierSuffixes?: string[];
    /**
     * Use this to force the type returned by the composition function.
     * By default Vuedoc Parser will try to automatically extract the returning
     * type
     */
    returningType?: string;
    /**
     * Use this to force the value returned by the composition function
     * By default Vuedoc Parser will try to automatically extract the returning
     * value
     */
    returningValue?: string;
    /**
     * Whether or not the identifier of the variable should be ignored.
     * For example, given `const attrs = useAttrs()`, `attrs` will be
     * emited as a component data if `options.ignoreVariableId = true`.
     * @default false
     */
    ignoreVariableIdentifier?: boolean;
    /**
     * Use this function to parse the CallExpression node and return the entry
     * value
     */
    parseEntryValue?(node: Babel.CallExpression, context: Context): Value<any> | undefined;
    /**
     * Use this function to parse the CallExpression node and return nodes
     * to parse as entries
     */
    parseEntryNode?(node: Babel.CallExpression, context: Context): void;
  };

  type CompositionFeature = Exclude<Feature, 'name' | 'description' | 'keywords' | 'slots'>;
  type CompiledComposition = CompositionDeclaration & {
    feature: CompositionFeature;
  };

  type ParsingComposition = Record<CompositionFeature, CompositionDeclaration[]>;

  type ParsingPlugin<T> = (parser: Interface) => PluginDefinition<T> | undefined;
  type PluginDefinition<T> = T & Pick<Options, 'composition' | 'resolver'> & {
    /**
     * List of resource files to preload before parsing
     */
    preload?: string[];
  };

  type EmitEntryFeatureOptions = {
    feature: Feature;
    name: string;
    ref: Value<any>;
    node: Babel.Node;
    nodeType?: Babel.Node;
    nodeComment?: Babel.Node;
  };
  interface Context {
    readonly scope: Scope;
    emitEntryFeature(meta: EmitEntryFeatureOptions): void;
    isNamespace(ref: NS | ScopeEntry): boolean;
    createNamespace(): NS;
    parseElements(elements: (Babel.Expression | Babel.SpreadElement)[]): Babel.Expression[];
    parseElements(elements: (Babel.ObjectMethod | Babel.ObjectProperty | Babel.SpreadElement)[]): Array<Babel.ObjectMethod | Babel.ObjectProperty>;
    getValue<T = any>(node: Babel.Node | null): Value<T>;
    getTypingValue<T = any>(node: Babel.Node): Value<T> | null;
    getIdentifier(node: Babel.Identifier): ScopeEntry | NS | null;
    getReturnType(node: Babel.Node, defaultType?: Type): Type | Type[];
    getScopeValue(key: string): ScopeEntry<any, any, any> | null;
    setValue(key: string, ref: Value<any>, node: Babel.Node): void;
    setScopeEntry(ref: ScopeEntry): void;
  }

  type File = {
    template?: Source;
    script?: Required<Script>;
    errors: string[];
  };

  type Type = string;
  type Feature = 'name' | 'description' | 'keywords' | 'slots' | 'props' | 'data' | 'computed' | 'events' | 'methods';
  declare const SUPPORTED_FEATURES: Feature[];

  type Source<Attrs extends object = object> = {
    content: string;
    attrs: Attrs & {
      lang?: string;
      [additionalAttribute: string]: string | undefined;
    };
  };

  type Script = Source<{ setup?: boolean }> & {
    ast?: AST.Result;
  };

  type Scope<TypeValue = string, NodeValue = Babel.Node, NoteType = NodeValue> = Record<
    string,
    ScopeEntry<TypeValue, NodeValue, NoteType> | NS
  >;

  interface NS {
    $ns: symbol;
    readonly scope: Record<string, ScopeEntry>;
  }

  declare class Value<TValue = any> {
    type: Parser.Type | Parser.Type[];
    value: TValue;
    raw: string;
    rawObject?: Record<string, any>;
    rawNode?: Record<string, Babel.Node> | Babel.Node[];
    member: boolean;
    expression?: boolean;
    function?: boolean;
    $kind?: string;
    readonly kind: string;

    constructor(type?: Parser.Type | Parser.Type[], value?: any, raw?: string);
    static isNativeType(type): boolean;
    static parseNativeType(type): string;
  }

  type ScopeEntry<TypeValue = string, NodeValue = Babel.Node, NoteType = NodeValue> = {
    value: Value<TypeValue>;
    key: string;
    source?: string;
    function?: boolean;
    computed?: boolean;
    tsValue?: AST.TSValue;
    composition?: CompiledComposition;
    node: {
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

    interface VariableDeclarator extends Babel.VariableDeclarator {
      id: LVal;
    }

    interface VariableDeclaration extends Babel.VariableDeclaration {
      declarations: VariableDeclarator[];
    }

    type LVal = Babel.LVal & {
      name: string;
    };

    type Node = (Babel.Expression | Babel.Node) & {
      extra: {
        file: FileSystemFile;
        $tsValue?: TSValue;
        $declarator?: VariableDeclarator;
        $composition?: CompositionDeclaration;
      };
      typeParameters?: Babel.TSTypeParameterInstantiation | null;
      typeAnnotation?: Babel.TSTypeAnnotation | Babel.TSType;
    };

    type TSValue = {
      node: Babel.Node | Record<string, Babel.Node> | Babel.Node[];
      type: string | string[] | Record<string, string>;
      kind?: string;
      computed?: boolean;
      compositionType?: string;
    };
  }

  class EntryEvent<T extends Entry.Type = Entry.Type> extends Event {
    /**
     * Parsed entry ready for emission
     */
    readonly entry: T;

    constructor(entry: T);
  }

  type MessageEventType = 'warning' | 'error';

  class MessageEvent<T extends MessageEventType> extends Event {
    readonly message: string;

    constructor(type: T, message: string);
  }

  class EndEvent extends Event {
    constructor();
  }

  interface EventListener<T extends EntryEvent | MessageEvent> {
    (evt: T): void;
  }

  class Private extends EventTarget {
    static SUPPORTED_FEATURES: Feature[];
    /**
     * Enabled features
     */
    readonly features: Feature[];
    /**
     * Resolved options
     */
    readonly options: Options;

    constructor(options: Options);

    addEventListener<T extends Entry.Type, K extends Entry.Kind = PropType<T, 'kind'>>(
      type: K,
      callback: EventListener<EntryEvent<T>>,
      options?: boolean | AddEventListenerOptions
    ): void;

    addEventListener<T extends MessageEventType>(
      type: T,
      callback: EventListener<MessageEvent<T>>,
      options?: boolean | AddEventListenerOptions
    ): void;

    addEventListener(
      type: 'end',
      callback: EventListener<EndEvent>,
      options?: boolean | AddEventListenerOptions
    ): void;

    /**
     * Start the parsing process
     */
    walk(): void;
  }

  class Interface extends Private {
    readonly composition: Composition;
    readonly scope: Vuedoc.Parser.Scope;
    readonly fs: FS;

    emitEntry(entry: Vuedoc.Entry.Type): void;
    emitWarning(message: string): void;
    emitError(message: string): void;
    execAsync(fn: AsyncOperation): void;
  }
}
