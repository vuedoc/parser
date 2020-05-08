# The Vuedoc Parser

Generate a JSON documentation for a Vue file component

[![npm](https://img.shields.io/npm/v/@vuedoc/parser.svg)](https://www.npmjs.com/package/@vuedoc/parser) [![Build status](https://gitlab.com/vuedoc/parser/badges/master/pipeline.svg)](https://gitlab.com/vuedoc/parser/pipelines) [![Test coverage](https://gitlab.com/vuedoc/parser/badges/master/coverage.svg)](https://gitlab.com/vuedoc/parser/-/jobs)

## Table of Contents

- [Install](#install)
- [Features](#features)
- [Options](#options)
- [Usage](#usage)
- [Syntax](#syntax)
  * [Add component name](#add-component-name)
  * [Add component description](#add-component-description)
  * [Annotate model, props, data and computed properties](#annotate-model-props-data-and-computed-properties)
  * [Annotate methods, events and slots](#annotate-methods-events-and-slots)
  * [Annotate slots defined in Render Functions](#annotate-slots-defined-in-render-functions)
- [Keywords Extraction](#keywords-extraction)
- [Working with Mixins](#working-with-mixins)
- [Parsing control with options.features](#parsing-control-with-optionsfeatures)
- [Language Processing](#language-processing)
  * [Loader API](#loader-api)
  * [Build-in loaders](#build-in-loaders)
  * [TypeScript usage](#typescript-usage)
  * [Create a custom loader](#create-a-custom-loader)
- [Parsing Output Interface](#parsing-output-interface)
- [Related projects](#related-projects)
- [Contribute](#contribute)
- [Versioning](#versioning)
- [License](#license)

## Install

```sh
npm install --save @vuedoc/parser
```

## Features

- Extract the component name (from the name field or from the filename)
- Extract the component description
- Keywords Support: You can define your own keywords with the `@` symbol like
  `@author Jon Snow`
- Extract component model
- Extract component props
- Extract component data
- Extract computed properties with dependencies
- Extract component events
- Extract component slots
- Extract component methods
- Class Component Support
- Vue Property Decorator Support
- JSDoc Support ([`@param`](http://usejsdoc.org/tags-param.html) and
  [`@return`](http://usejsdoc.org/tags-returns.html) tags)

## Options

| name                    | description                                                         |
|-------------------------|---------------------------------------------------------------------|
| filename                | The filename to parse. *Required* unless `filecontent` is passed    |
| filecontent             | The file content to parse. *Required* unless `filename` is passed   |
| encoding                | The file encoding. Default is `'utf8'`                              |
| features                | The component features to parse and extract.                        |
|                         | Default features: `['name', 'description', 'keywords', 'slots', 'model', 'props', 'data', 'computed', 'events', 'methods']` |
| loaders                 | Use this option to define [custom loaders](#custom-language-processing) for specific languages |
| defaultMethodVisibility | Can be set to `'public'` (*default*), `'protected'`, or `'private'` |
| ignoredVisibilities     | List of ignored visibilities.                                       |
|                         | Default ignored visibilities: `['protected', 'private']`            |

## Usage

See [test/fixtures/checkbox.vue](https://gitlab.com/vuedoc/parser/blob/master/test/fixtures/checkbox.vue)
for an Vue Component decoration example.

```js
const vuedoc = require('@vuedoc/parser')
const options = {
  filename: 'test/fixtures/checkbox.vue'
}

vuedoc.parse(options)
  .then((component) => console.log(component))
  .catch((err) => console.error(err))
```

This will print this JSON output:

```js
{
  "name": "checkbox" // The component name
  "description": "A simple checkbox component" // The component description
  // Attached component keywords
  "keywords": [
    { "name": "author", "description": "Sébastien" }
  ],
  "props": [ ... ],
  "data": [ ... ],
  "computed": [ ... ],
  "slots": [ ... ],
  "events": [ ... ],
  "methods": [ ... ]
}
```

See [test/fixtures/checkbox-result.json](https://gitlab.com/vuedoc/parser/blob/master/test/fixtures/checkbox-result.json) for the complete result.

## Syntax

### Add component name

By default, Vuedoc Parser use the component's filename to generate the
component name.

To set a custom name, use the `name` field like:

```js
export default {
  name: 'my-checkbox'
}
```

You can also use the `@name` keyword to set the component name:

```js
/**
 * @name my-checkbox
 */
export default {
  // ...
}
```

### Add component description

To add a component description, just add a comment before the `export default`
statement like:

```js
/**
 * Component description
 */
export default {
  ...
}
```

### Annotate model, props, data and computed properties

To document props, data or computed properties, use comments like:

```js
export default {
  props: {
    /**
     * Component ID
     */
    id: {
      type: String,
      required: true
    }
  },
  data () {
    return {
      /**
       * Indicates that the control is checked
       */
      isChecked: false
    }
  },
  computed: {
    /**
     * Indicates that the control is selected
     */
    selected () {
      return this.isChecked
    }
  }
}
```

Vuedoc Parser will automatically extract `required` and `default` values for
properties and computed properties dependencies. It will also detect type for
each defined data field.

You can set a custom default value of an prop by using the keyword `@default`.

```js
export default {
  props: {
    /**
     * Custom default value
     * @default { anything: 'custom default value' }
     */
    custom: {
      type: String,
      default: () => {
        // complex code
        return anythingExpression()
      }
    }
  }
}
```

To document a `v-model` prop, a proper way is to use the Vue's
[model field](https://vuejs.org/v2/api/#model) if you use Vue +2.2.0.

```js
export default {
  /**
   * Use `v-model` to define a reactive value of the checkbox
   */
  model: {
    prop: 'checked',
    event: 'change'
  }
}
```

You can also use the `@model` keyword on a prop if you use an old Vue version:

```js
export default {
  props: {
    /**
     * The checkbox model
     * @model
     */
    model: {
      type: Array,
      required: true
    }
  }
}
```

To document Vue array string props, just attach a Vuedoc comment to each prop:

```js
export default {
  props: [
    /**
     * Checkbox ID
     */
    'id',

    /**
     * The checkbox model
     */
    'value'
  ]
}
```

By default, all extracted things have the `public` visibility.
To change this for one entry, add `@protected` or `@private` keyword.

```js
export default {
  data: () => ({
    /**
     * This will be ignored on parsing
     * @private
     */
    isChecked: false
  })
}
```

### Annotate methods, events and slots

To document methods or events, just add comments before:

```js
export default {
  methods: {
    /**
     * Submit form
     */
    check () {
      /**
       * Emit the `input` event on submit
       */
      this.$emit('input', true)
    }
  }
}
```

Vuedoc Parser automatically extracts events from component hooks:

```js
export default {
  created () {
    /**
     * Emit on Vue `created` hook
     */
    this.$emit('created', true)
  }
}
```

Use the JSDoc [@param](http://usejsdoc.org/tags-param.html) and
[@return](http://usejsdoc.org/tags-returns.html) tags to define parameters and
returning type:

```js
export default {
  methods: {
    /**
     * Submit form
     *
     * @param {object} data - Data to submit
     * @return {boolean} true on success; otherwise, false
     */
    submit (data) {
      /**
       * Emit the `loading` event on submit
       *
       * @arg {boolean} status - The loading status
       */
      this.$emit('loading', true)

      return true
    }
  }
}
```

> Note: `@arg` is an alias of `@param`

The parser is also able to extract events and slots from template:

```html
<template>
  <div>
    <!-- Emit the `input` event on submit -->
    <button @click="$emit('input', $event)">Submit</button>
    <!-- Default slot -->
    <slot></slot>
    <!-- Use this slot to set the checkbox label -->
    <slot name="label">Unnamed checkbox</slot>
    <!--
      Slot with keywords and
      multiline description

      @prop {User} user - The current user
      @prop {UserProfile} profile - The current user's profile
    -->
    <slot name="header" v-bind:user="user" v-bind:profile="profile"/>
  </div>
</template>
```

**Usage with non primitive name**

You can use special keywords `@method` and `@event` for non primitive name:

```html
<script>
  const METHODS = {
    CLOSE: 'closeModal'
  }

  const EVENTS = {
    CLOSE: 'close'
  }

  export default {
    methods: {
      /**
        * Close modal
        * @method closeModal
        */
      [METHODS.CLOSE] () {
        /**
          * Emit the `close` event on click
          * @event close
          */
        this.$emit(EVENTS.CLOSE, true)
      }
    }
  }
</script>
```

### Annotate slots defined in Render Functions

To annotate slots defined in Render Functions, just attach the keyword `@slot`
to the component definition:

```js
/**
 * A functional component with slots defined in render function
 * @slot title - A title slot
 * @slot default - A default slot
 */
export default {
  functional: true,
  render(h, { slots }) {
    return h('div', [
      h('h1', slots().title),
      h('p', slots().default)
    ])
  }
}
```

You can also use the keyword `@slot` to define dynamic slots on template:

```html
<template>
  <div>
    <template v-for="name in ['title', 'default']">
      <!--
        @slot title - A title slot
        @slot default - A default slot
      -->
      <slot :name="name" :slot="name"></slot>
    </template>
  </div>
</template>
```

## Keywords Extraction

You can attach keywords to any comment and then extract them using the parser.

**Usage**

```js
/**
 * Component description
 *
 * @author Arya Stark
 * @license MIT
 */
export default { ... }
```

> Note that the description must alway appear before keywords definition

Parsing result:

```json
{
  "name": "my-checkbox",
  "description": "Component description",
  "keywords": [
    {
      "name": "author",
      "description": "Arya Stark"
    },
    {
      "name": "license",
      "description": "MIT"
    }
  ]
}
```

## Working with Mixins

Since Vuedoc Parser don't perform I/O operations, it cannot completely ignore
the `mixins` property.

To parse, you need to parse the mixin file as a standalone component and then
merge the parsing result with the result of the initial component:

```js
const vuedoc = require('@vuedoc/parser')
const merge = require('deepmerge')

const parsers = [
  vuedoc.parse({ filename: 'mixinFile.js' })
  vuedoc.parse({ filename: 'componentUsingMixin.vue' })
]

Promise.all(parsers)
  .then(merge.all)
  .then((mergedParsingResult) => console.log(mergedParsingResult))
  .catch((err) => console.error(err))
```

## Parsing control with options.features

`options.features` lets you select which Vue Features you want to parse and
extract.

The default value is define by `Parser.SUPPORTED_FEATURES` array.

**Usage**

Only parse `name`, `props`, `computed properties`, `slots` and `events`:

```js
const vuedoc = require('@vuedoc/parser')

const options = {
  filename: 'test/fixtures/checkbox.vue',
  features: [ 'name', 'props', 'computed', 'slots', 'events' ]
}

vuedoc.parse(options)
  .then((component) => Object.keys(component))
  .then((keys) => console.log(keys))
  // => [ 'name', 'props', 'computed', 'slots', 'events' ]
```

Parse all features except `data`:

```js
const vuedoc = require('@vuedoc/parser')
const Parser = require('@vuedoc/parser/lib/parser')

const options = {
  filename: 'test/fixtures/checkbox.vue',
  features: Parser.SUPPORTED_FEATURES.filter((feature) => feature !== 'data')
}

vuedoc.parse(options)
  .then((component) => Object.keys(component))
  .then((keys) => console.log(keys))
  // => [ 'name', 'description', 'keywords', 'model',
  //      'props', 'computed', 'events', 'methods', 'slots' ]
```

## Language Processing

### Loader API

```js
abstract class Loader {
  public static extend(loaderName: string, loaderClass: Loader);
  public abstract load(source: string): Promise<void>;
  public emitTemplate(source: string): Promise<void>;
  public emitScript(source: string): Promise<void>;
  public emitErrors(errors: Array<string>): Promise<void>;
  public pipe(loaderName: string, source: string): Promise<void>;
}
```

### Build-in loaders

| Language    | Load by default?  | Package                                                   |
|-------------|-------------------|-----------------------------------------------------------|
| HTML        | Yes               | [@vuedoc/parser/loader/html](loader/html.js)              |
| JavaScript  | Yes               | [@vuedoc/parser/loader/javascript](loader/javascript.js)  |
| Pug         | No                | [@vuedoc/parser/loader/pug](loader/pug.js)                |
| TypeScript  | No                | [@vuedoc/parser/loader/typescript](loader/typescript.js)  |
| Vue         | Yes               | [@vuedoc/parser/loader/vue](loader/vue.js)                |

### TypeScript usage

The Vuedoc Parser package contains a loader for TypeScript. To use it, you need
to:

  - install `typescript` and `@types/node` dependencies according the
    [official documentation](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API)
  - import and load the loader `@vuedoc/parser/loader/typescript`

```js
const Vuedoc = require('@vuedoc/parser')
const TypeScriptLoader = require('@vuedoc/parser/loader/typescript')

const options = {
  filename: 'DatePicker.ts',
  loaders: [
    /**
     * Register TypeScriptLoader
     * Note that the name of the loader is either the extension
     * of the file or the value of the attribute `lang`
     */
    Vuedoc.Loader.extend('ts', TypeScriptLoader)
  ]
}

Vuedoc.parse(options).then((component) => {
  console.log(component)
})
```

### Create a custom loader

The example below uses the abstract `Vuedoc.Loader` class to create a
specialized class to handle a template with the [CoffeeScript](https://www.npmjs.com/package/coffeescript)
language. It uses the Pug language for templating:

```js
const Vuedoc = require('@vuedoc/parser')
const PugLoader = require('@vuedoc/parser/loader/pug')
const CoffeeScript = require('coffeescript')

class CoffeeScriptLoader extends Vuedoc.Loader {
  load (source) {
    const outputText = CoffeeScript.compile(source);

    // don't forget the return here
    return this.emitScript(outputText);
  }
}

const options = {
  filecontent: `
    <template lang="pug">
      div.page
        h1 Vuedoc Parser with Pug
        // Use this slot to define a subtitle
        slot(name='subtitle')
    </template>

    <script lang="coffee">
      ###
      # Description of MyInput component
      ###
      export default
        name: 'MyInput'
    </script>
  `,
  loaders: [
    /**
     * Register CoffeeScriptLoader
     * Note that the name of the loader is either the extension
     * of the file or the value of the attribute `lang`
     */
    Vuedoc.Loader.extend('coffee', CoffeeScriptLoader),

    // Register the Pug loader
    Vuedoc.Loader.extend('pug', PugLoader)
  ]
}

Vuedoc.parse(options).then((component) => {
  console.log(component)
})
```

**Output**

```js
{
  name: 'MyInput',
  description: 'Description of MyInput component',
  slots: [
    {
      kind: 'slot',
      visibility: 'public',
      description: 'Use this slot to define a subtitle',
      keywords: [],
      name: 'subtitle',
      props: []
    }
  ],
  // ...
}
```

## Parsing Output Interface

```ts
type ParsingOutput = {
  name: string;               // Component name
  description: string;        // Component description
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
};

enum NativeTypeEnum {
  string,
  number,
  bigint,
  boolean,
  object,                     // for an array or an object
  null,                       // for an explicit `null` value
  undefined,                  // for an explicit `undefined` value
  CallExpression              // for a value like `new Date()`
};

type Keyword = {
  name: string;
  description: string;
}

interface Entry {
  kind: 'computed' | 'data' | 'event' | 'method' | 'model' | 'prop' | 'slot';
  visibility: 'public' | 'protected' | 'private';
  description: string;
  keywords: Keyword[];
}

interface ModelEntry extends Entry {
  kind: 'model';
  prop: string;
  event: string;
}

interface SlotEntry extends Entry {
  kind: 'slot';
  name: string;
  props: SlotProp[];
}

type SlotProp = {
  name: string;
  type: string;
  description: string;
};

interface ModelEntry extends Entry {
  kind: 'model';
  prop: string;
  event: string;
}

interface PropEntry extends Entry {
  kind: 'prop';
  name: string;                   // v-model when the @model keyword is attached
  type: string | string[];        // ex. Array, Object, String, [String, Number]
  nativeType: NativeTypeEnum;
  default: any;                   // '__undefined__' value for uncatchable value
  required: boolean = false;
  describeModel: boolean = false; // true when the @model keyword is attached
}

interface DataEntry extends Entry {
  kind: 'data';
  name: string;
  type: NativeTypeEnum;
  initial: any;                   // '__undefined__' value for uncatchable value
}

interface ComputedEntry extends Entry {
  kind: 'computed';
  name: string;
  dependencies: string[];         // list of dependencies of the computed property
}

interface EventEntry extends Entry {
  kind: 'event';
  name: string;
  arguments: EventArgument[];
}

type EventArgument = {
  name: string;
  description: string;
  type: string;
};

interface MethodEntry extends Entry {
  kind: 'method';
  name: string;
  params: MethodParam[];
  return: MethodReturn;
}

type MethodParam = {
  name: string;
  description: string;
  type: string;
  defaultValue: any;
}

type MethodReturn = {
  type: string = 'void';
  description: string;
};
```

## Related projects

- [@vuedoc/md](https://gitlab.com/vuedoc/md) - A Markdown Documentation
  Generator for Vue Components

## Contribute

Contributions to Vuedoc Parser are welcome. Here is how you can contribute:

1. [Submit bugs or a feature request](https://gitlab.com/vuedoc/md/issues) and
   help us verify fixes as they are checked in
2. Create your working branch from the `dev` branch:
   `git checkout dev -b feature/my-awesome-feature`
3. Write code for a bug fix or for your new awesome feature
4. Write test cases for your changes
5. [Submit merge requests](https://gitlab.com/vuedoc/md/merge_requests) for bug
   fixes and features and discuss existing proposals

## Versioning

Given a version number `MAJOR.MINOR.PATCH`, increment the:

- `MAJOR` version when you make incompatible API changes,
- `MINOR` version when you add functionality in a backwards-compatible manner,
  and
- `PATCH` version when you make backwards-compatible bug fixes.

Additional labels for pre-release and build metadata are available as extensions
to the `MAJOR.MINOR.PATCH` format.

See [SemVer.org](https://semver.org/) for more details.

## License

Under the MIT license.
See [LICENSE](https://gitlab.com/vuedoc/parser/blob/master/LICENSE) file for
more details.
