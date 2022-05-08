declare module '@vuedoc/parser' {
  export { Parser } from '@vuedoc/parser/parser/lib/Parser.js';
  export { Loader } from './lib/Loader.js';

  import { Options as ParserOptions } from '@vuedoc/parser/parser/Parser.js';
  import { Definition } from '@vuedoc/parser/lib/Loader.js';
  import { Keyword } from './lib/entity/Keyword';
  import { ComputedEntry } from './lib/entity/ComputedEntry';
  import { DataEntry } from './lib/entity/DataEntry';
  import { EventEntry } from './lib/entity/EventEntry';
  import { MethodEntry } from './lib/entity/MethodEntry';
  import { ModelEntry } from './lib/entity/ModelEntry';
  import { PropEntry } from './lib/entity/PropEntry';
  import { SlotEntry } from './lib/entity/SlotEntry';

  async function parseComponent(options: Options): Promise<ComponentAST>;
  async function parseOptions(options: Options): Promise<void>;

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

  type Options = (FileOptions | ContentOptions) & Omit<ParserOptions, 'source' | 'filename'> & {
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
    model?: ModelEntry;         // Component model
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
