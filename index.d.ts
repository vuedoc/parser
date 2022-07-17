declare module '@vuedoc/parser' {
  export { Parser, Loader } from '@vuedoc/parser/parser/lib/Parser.js';
  import { Options as ParserOptions } from '@vuedoc/parser/parser/Parser.js';
  import { Definition } from '@vuedoc/parser/lib/Loader.js';
  import { Keyword } from '@vuedoc/parser/entity/Keyword';
  import { ComputedEntry } from '@vuedoc/parser/entity/ComputedEntry';
  import { DataEntry } from '@vuedoc/parser/entity/DataEntry';
  import { EventEntry } from '@vuedoc/parser/entity/EventEntry';
  import { MethodEntry } from '@vuedoc/parser/entity/MethodEntry';
  import { PropEntry } from '@vuedoc/parser/entity/PropEntry';
  import { SlotEntry } from '@vuedoc/parser/entity/SlotEntry';

  export async function parseComponent(options: Options): Promise<ComponentAST>;
  export async function parseOptions(options: Options): Promise<void>;
  export function synchronizeParsingResult(options: Options, component: ComponentAST): void;

  type FileOptions = {
    /**
     * The filename to parse
     */
    filename: string;
  };

  type ContentOptions = {
    /**
     * The file content to parse
     */
    filecontent: string;
  };

  export type Options = (FileOptions | ContentOptions) & Omit<ParserOptions, 'source' | 'filename'> & {
    /**
     * The file encoding
     * @default 'utf8'
     */
    encoding?: string;

    /**
     * Custom loaders
     */
    loaders?: Definition[];
  };

  type ComponentAST = {
    name: string;               // Component name
    description?: string;       // Component description
    category?: string;
    version?: string;
    since?: string;
    inheritAttrs: boolean;
    keywords: Keyword[];        // Attached component keywords
    slots: SlotEntry[];         // Component slots
    props: PropEntry[];         // Component props
    data: DataEntry[];          // Component data
    computed: ComputedEntry[];  // Computed properties
    events: EventEntry[];       // Events
    methods: MethodEntry[];     // Component methods
    errors: string[];           // Syntax and parsing errors
    warnings: string[];         // Syntax and parsing warnings
  };
}
