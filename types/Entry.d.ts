import { Parser } from './Parser';

export namespace Entry {
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

  type Visibility = 'public' | 'protected' | 'private';

  interface AbstractEntry<T extends Kind> {
    kind: T;
    description?: string;
    category?: string;
    version?: string;
    visibility: Visibility;
    keywords: Keyword[];
  }

  interface ComputedEntry extends AbstractEntry<'computed'> {
    type: Parser.Type | Parser.Type[];
    name: string;
    dependencies: string[];
  }

  interface DataEntry extends AbstractEntry<'data'> {
    type: Parser.Type | Parser.Type[];
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
    optional?: boolean;
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
    type: Parser.Type | Parser.Type[];
    name: string;
    default?: string;
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
