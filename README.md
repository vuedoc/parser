# The Vuedoc Parser

Generate a JSON documentation for a Vue file component.

[![npm](https://img.shields.io/npm/v/@vuedoc/parser.svg)](https://www.npmjs.com/package/@vuedoc/parser)
[![Build status](https://gitlab.com/vuedoc/parser/badges/master/pipeline.svg)](https://gitlab.com/vuedoc/parser/pipelines?ref=master)
[![Test coverage](https://gitlab.com/vuedoc/parser/badges/master/coverage.svg)](https://gitlab.com/vuedoc/parser/-/jobs)
[![Buy me a beer](https://img.shields.io/badge/Buy%20me-a%20beer-1f425f.svg)](https://www.buymeacoffee.com/demsking)

## Table of Contents

- [Install](#install)
- [Features](#features)
- [Options](#options)
- [Usage](#usage)
- [Syntax](#syntax)
  * [Add component name](#add-component-name)
  * [Add component description](#add-component-description)
  * [Annotate props](#annotate-props)
    + [Annotate a `v-model` prop](#annotate-a-v-model-prop)
    + [Annotate Vue Array String Props](#annotate-vue-array-string-props)
    + [Special tags for props](#special-tags-for-props)
    + [Prop Entry Interface](#prop-entry-interface)
  * [Annotate data](#annotate-data)
  * [Annotate computed properties](#annotate-computed-properties)
  * [Annotate methods](#annotate-methods)
  * [Annotate events](#annotate-events)
  * [Annotate slots](#annotate-slots)
  * [Ignore item from parsing](#ignore-item-from-parsing)
- [Keywords Extraction](#keywords-extraction)
- [Supported tags](#supported-tags)
- [Working with Mixins](#working-with-mixins)
- [Parsing control with `options.features`](#parsing-control-with-optionsfeatures)
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
- [Keywords support](#keywords-extraction)
- Extract component model
- Extract component props
- Extract component data
- Extract computed properties with dependencies
- Extract component events
- Extract component slots
- Extract component methods
- JSX support
- [Class Component](https://www.npmjs.com/package/vue-class-component) support
- [Vue Property Decorator](https://www.npmjs.com/package/vue-property-decorator) support
- [Prop Types](https://github.com/znck/prop-types) support
- [JSDoc](https://jsdoc.app/) support
  ([`@type`](http://usejsdoc.org/tags-type.html),
   [`@param`](http://usejsdoc.org/tags-param.html),
   [`@returns`](http://usejsdoc.org/tags-returns.html),
   [`@version`](http://usejsdoc.org/tags-version.html),
   [`@since`](http://usejsdoc.org/tags-since.html),
   [`@deprecated`](http://usejsdoc.org/tags-deprecated.html),
   [`@see`](http://usejsdoc.org/tags-deprecated.html),
   [`@kind`](http://usejsdoc.org/tags-kind.html),
   [`@author`](http://usejsdoc.org/tags-author.html) and
   [`@ignore`](http://usejsdoc.org/tags-ignore.html) tags)
- [TypeDoc tags](https://typedoc.org/guides/doccomments/#supported-tags)
  support (`@param <param name>`, `@return(s)`, `@hidden`, `@category`)

## Options

| Name                  | Description                                                                                                     |
|-----------------------|-----------------------------------------------------------------------------------------------------------------|
| `filename`            | The filename to parse. *Required* unless `filecontent` is passed                                                |
| `filecontent`         | The file content to parse. *Required* unless `filename` is passed                                               |
| `encoding`            | The file encoding. Default is `'utf8'`                                                                          |
| `features`            | The component features to parse and extract.                                                                    |
|                       | Default features: `['name', 'description', 'slots', 'model', 'props', 'data', 'computed', 'events', 'methods']` |
| `loaders`             | Use this option to define [custom loaders](#language-processing) for specific languages                         |
| `ignoredVisibilities` | List of ignored visibilities. Default: `['protected', 'private']`                                               |
| `jsx`                 | Set to `true` to enable JSX parsing. Default `false`                                                            |

## Usage

See [test/fixtures/checkbox.vue](https://gitlab.com/vuedoc/parser/blob/master/test/fixtures/checkbox.vue)
for an Vue Component decoration example.

```js
const Vuedoc = require('@vuedoc/parser')
const options = {
  filename: 'test/fixtures/checkbox.vue'
}

Vuedoc.parse(options)
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
    { "name": "contributor", "description": "Sébastien" }
  ],
  "props": [ ... ],
  "data": [ ... ],
  "computed": [ ... ],
  "slots": [ ... ],
  "events": [ ... ],
  "methods": [ ... ]
}
```

> Found the complete result here:
  [test/fixtures/checkbox-result.json](https://gitlab.com/vuedoc/parser/blob/master/test/fixtures/checkbox-result.json)

See the bellow [Parsing Output Interface](#parsing-output-interface) section.

## Syntax

### Add component name

By default, Vuedoc Parser uses the component's filename to generate the
component name.

To set a custom name, use the `name` field like:

```js
export default {
  name: 'my-checkbox'
}
```

You can also use the `@name` tag to set the component name:

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
  // ...
}
```

### Annotate props

To document props, annotate your code like:

```js
export default {
  props: {
    /**
     * Element ID
     */
    id: {
      type: String,
      required: true
    }
  }
}
```

Vuedoc Parser will automatically extract `required` and `default` values for
properties.

#### Annotate a `v-model` prop

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
  },
  props: {
    checked: Boolean
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
    checked: Boolean
  }
}
```

#### Annotate Vue Array String Props

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

#### Special tags for props

- `@type {typeName}`<br>
  Commented prop will use provided type name as type instead of type in source
  code. This option may be helpful in case the prop type is a complex object or
  a function
- `@default {value}`<br>
  Commented prop will use the provided value as default prop value. This option
  may be helpful in case the prop type is a complex object or function
- `@kind function`<br>
  Force parsing of a prop as a function

```js
export default {
  name: 'NumberInput',
  props: {
    /**
     * Custom default value
     * @type Complex.Object
     * @default { anything: 'custom default value' }
     */
    custom: {
      type: Object,
      default: () => {
        // complex code
        return anythingExpression()
      }
    },
    /**
     * The input validation function
     * @kind function
     * @param {any} value - User input value to validate
     * @returns {boolean} - `true` if validation succeeds; `false` otherwise.
     */
    validator: {
      type: Function,
      default: (value) => !Number.isNaN(value)
    },
  },
};
```

#### Prop Entry Interface

```ts
interface PropEntry {
  kind: 'prop';
  name: string;
  type: string | string[];
  default: string;
  required: boolean;
  description?: string;
  describeModel: boolean;
  keywords: Keyword[];
  category?: string;
  version?: string;
  since?: string;
  visibility: 'public' | 'protected' | 'private';
}

type Keyword = {
  name: string;
  description?: string;
};
```

### Annotate data

To document data, annotate your code like:

```js
export default {
  data () {
    return {
      /**
       * Indicates that the control is checked
       */
      isChecked: false
    }
  }
}
```

Vuedoc Parser will automatically detect type for each defined data field and
catch their initial value.

**Special tags for data**

- `@type {typeName}`<br>
  Commented data will use provided type name as type instead of type in source
  code. This option may be helpful in case the data type is a complex object or
  a function
- `@initialValue {value}`<br>
  Commented data will use the provided value as initial data value. This option
  may be helpful in case the data type is a complex object or function

```js
export default {
  data () {
    return {
      /**
       * A data with a complex expression
       * @type boolean
       * @initialValue false
       */
      isChecked: !(a || b || c)
    }
  }
}
```

**Data Entry Interface**

```ts
interface DataEntry {
  kind: 'data';
  name: string;
  type: string;
  initialValue: string;
  description?: string;
  keywords: Keyword[];
  category?: string;
  version?: string;
  since?: string;
  visibility: 'public' | 'protected' | 'private';
}

type Keyword = {
  name: string;
  description?: string;
};
```

### Annotate computed properties

To document computed properties, annotate your code like:

```js
export default {
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

Vuedoc Parser will automatically extract computed properties dependencies.

**Computed Property Entry Interface**

```ts
interface ComputedEntry {
  kind: 'computed';
  name: string;
  type: string;
  dependencies: string[];
  description?: string;
  keywords: Keyword[];
  category?: string;
  version?: string;
  since?: string;
  visibility: 'public' | 'protected' | 'private';
}

type Keyword = {
  name: string;
  description?: string;
};
```

### Annotate methods

To document methods, annotate your code like:

```js
export default {
  methods: {
    /**
     * Submit form
     */
    submit () {}
  }
}
```

Use the JSDoc [`@param`](http://usejsdoc.org/tags-param.html) and
[`@returns`](http://usejsdoc.org/tags-returns.html) tags to define parameters
and returning type:

```js
export default {
  methods: {
    /**
     * Submit form
     *
     * @param {object} data - Data to submit
     * @returns {boolean} true on success; otherwise, false
     */
    submit (data) {
      return true
    }
  }
}
```

**Special tags for methods**

- `@method <method name>`<br>
  You can use special tag `@method` for non primitive name:

  ```html
  <script>
    const METHODS = {
      CLOSE: 'closeModal'
    }

    export default {
      methods: {
        /**
          * Close modal
          * @method closeModal
          */
        [METHODS.CLOSE] () {}
      }
    }
  </script>
  ```
- `@syntax <custom method syntax>`<br>
  By default, Vuedoc Parser automatically generates method syntax with typing.
  For example, the previous example will generate:

  ```js
  {
    kind: 'method',
    name: 'closeModal',
    params: [],
    returns: { type: 'void', description: undefined },
    syntax: [
      'closeModal(): void'
    ],
    category: undefined,
    version: undefined,
    description: undefined,
    keywords: [],
    visibility: 'public'
  }
  ```

  You can overwrite syntax generation by using tag `@syntax`. You can also
  define multiple syntax examples:

  ```js
  export default {
    methods: {
      /**
       * @syntax target.addEventListener(type, listener [, options]);
       * @syntax target.addEventListener(type, listener [, useCapture]);
       * @syntax target.addEventListener(type, listener [, useCapture, wantsUntrusted  ]); // Gecko/Mozilla only
       */
      addEventListener(type, listener, options, useCapture) {}
    }
  }
  ```

**Method Entry Interface**

```ts
interface MethodEntry {
  kind: 'method';
  name: string;
  params: MethodParam[];
  returns: MethodReturn;
  syntax: string[];
  description?: string;
  keywords: Keyword[];
  category?: string;
  version?: string;
  since?: string;
  visibility: 'public' | 'protected' | 'private';
}

type Keyword = {
  name: string;
  description?: string;
};

type MethodParam = {
  name: string;
  type: NativeTypeEnum | string;
  description?: string;
  defaultValue?: string;
  rest: boolean;
};

type MethodReturn = {
  type: string;
  description?: string;
};
```

### Annotate events

Vuedoc Parser automatically extracts events from component template, hooks and
methods:

```html
<template>
  <div>
    <!-- Emit the `click` event on submit -->
    <button @click="$emit('click', $event)">Submit</button>
  </div>
</template>
<script>
  export default {
    created () {
      /**
      * Emit on Vue `created` hook
      */
      this.$emit('created', true)
    },
    methods: {
      submit () {
        /**
        * Emit the `input` event on submit
        */
        this.$emit('input', true)
      }
    }
  }
</script>
```

Use `@arg` tag to define arguments of an event:

```js
export default {
  methods: {
    submit (data) {
      /**
       * Emit the `loading` event on submit
       *
       * @arg {boolean} status - The loading status
       */
      this.$emit('loading', true)
    }
  }
}
```

> Note: `@arg` is an alias of `@argument`.

You can use special keyword `@event` for non primitive name:

```html
<script>
  const EVENTS = {
    CLOSE: 'close'
  }

  export default {
    methods: {
      closeModal() {
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

**Event Entry Interface**

```ts
interface EventEntry {
  kind: 'event';
  name: string;
  description?: string;
  arguments: EventArgument[];
  keywords: Keyword[];
  category?: string;
  version?: string;
  since?: string;
  visibility: 'public' | 'protected' | 'private';
}

type Keyword = {
  name: string;
  description?: string;
};

type EventArgument = {
  name: string;
  type: NativeTypeEnum | string;
  description?: string;
  rest: boolean;
};
```

### Annotate slots

Vuedoc Parser automatically extracts slots from template. You must use `@prop`
tag to define properties of a slot:

```html
<template>
  <div>
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

**Annotate slots defined in Render Functions**

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

**Slot Entry Interface**

```ts
interface SlotEntry {
  kind: 'slot';
  name: string;
  description?: string;
  props: SlotProp[];
  keywords: Keyword[];
  category?: string;
  version?: string;
  since?: string;
  visibility: 'public' | 'protected' | 'private';
}

type Keyword = {
  name: string;
  description?: string;
};

type SlotProp = {
  name: string;
  type: string;
  description?: string;
};
```

### Ignore item from parsing

Use the [JSDoc's tag `@ignore`](https://jsdoc.app/tags-ignore.html) to keeps the
subsequent code from being documented.

```js
export default {
  data: () => ({
    /**
     * This will be ignored on parsing
     * @ignore
     */
    isChecked: false
  })
}
```

You can also use the [TypeDoc's tag `@hidden`](https://typedoc.org/guides/doccomments/#hidden-and-ignore).

## Keywords Extraction

You can attach keywords to any comment and then extract them using the parser.

**Usage**

```js
/**
 * Component description
 *
 * @license MIT
 */
export default { /* ... */ }
```

> Note that the description must always appear before keywords definition.

Parsing result:

```json
{
  "name": "my-checkbox",
  "description": "Component description",
  "keywords": [
    {
      "name": "license",
      "description": "MIT"
    }
  ]
}
```

## Supported tags

| Keyword               | Scope           | Description                                                                               |
| --------------------- | --------------- | ----------------------------------------------------------------------------------------- |
| `@name`               | `component`     | Provide a custom name of the component                                                    |
| `@type`               | `props`, `data` | Provide a type expression identifying the type of value that a prop or a data may contain |
| `@default`            | `props`         | Provide a default value of a prop                                                         |
| `@model`              | `props`         | Mark a prop as `v-model`                                                                  |
| `@kind`               | `props`         | Used to document what kind of symbol is being documented                                  |
| `@initialValue`       | `data`          | Provide an initial value of a data                                                        |
| `@method`             | `methods`       | Force the name of a specific method                                                       |
| `@syntax`             | `methods`       | Provide the custom method syntax                                                          |
| `@param`              | `methods`       | Provide the name, type, and description of a function parameter                           |
| `@returns`, `@return` | `methods`       | Document the value that a function returns                                                |
| `@event`              | `events`        | Force the name of a specific event                                                        |
| `@arg`, `@argument`   | `events`        | Provide the name, type, and description of an event argument                              |
| `@slot`               | `slots`         | Document slot defined in render function                                                  |
| `@prop`               | `slots`         | Provide the name, type, and description of a slot prop                                    |
| `@mixin`              | `component`     | Force parsing of the exported item as a mixin component                                   |
| `@version`            | `all`           | Assign a version to an item                                                               |
| `@since`              | `all`           | Indicate that an item was added in a specific version                                     |
| `@author`             | `all`           | Identify authors of an item                                                               |
| `@deprecated`         | `all`           | Mark an item as being deprecated                                                          |
| `@see`                | `all`           | Allow to refer to a resource that may be related to the item being documented             |
| `@ignore`             | `*`             | Keep the subsequent code from being documented                                            |
| **TypeDoc**                                                                                                                         |
| `@category`           | `all`           | Attach a category to an item                                                              |
| `@hidden`             | `*`             | Keep the subsequent code from being documented                                            |
| **Visibilities**                                                                                                                    |
| `@public`             | `*`             | Mark a symbol as public                                                                   |
| `@protected`          | `*`             | Mark a symbol as private                                                                  |
| `@private`            | `*`             | Mark a symbol as protected                                                                |

> `*` stand for `props`, `data`, `methods`, `events`, `slots`

## Working with Mixins

Since Vuedoc Parser don't perform I/O operations, it completely ignores the
`mixins` property.

To parse a mixin, you need to parse its file as a standalone component and then
merge the parsing result with the result of the initial component:

```js
const Vuedoc = require('@vuedoc/parser')
const merge = require('deepmerge')

const parsers = [
  Vuedoc.parse({ filename: 'mixinFile.js' })
  Vuedoc.parse({ filename: 'componentUsingMixin.vue' })
]

Promise.all(parsers)
  .then(merge.all)
  .then((mergedParsingResult) => console.log(mergedParsingResult))
  .catch((err) => console.error(err))
```

**Using the keyword `@mixin`**

You can use the special keyword `@mixin` to force parsing named exported
component:

```js
import Vue from 'vue';

/**
 * @mixin
 */
export const InputMixin = Vue.extend({
  props: {
    id: String,
    value: [ Boolean, Number, String ]
  }
});
```

Bellow an example with a factory:

```js
import Vue from 'vue';

/**
 * @mixin
 */
export function InputMixin (route) {
  return Vue.extend({
    props: {
      id: String,
      value: [ Boolean, Number, String ]
    },
    methods: { route }
  });
}
```

## Parsing control with `options.features`

`options.features` lets you select which Vue Features you want to parse and
extract.

The default value is defined by `Vuedoc.Parser.SUPPORTED_FEATURES` array.

**Usage**

Only parse `name`, `props`, `computed properties`, `slots` and `events`:

```js
const Vuedoc = require('@vuedoc/parser')

const options = {
  filename: 'test/fixtures/checkbox.vue',
  features: [ 'name', 'props', 'computed', 'slots', 'events' ]
}

Vuedoc.parse(options)
  .then((component) => Object.keys(component))
  .then((keys) => console.log(keys))
  // => [ 'name', 'props', 'computed', 'slots', 'events' ]
```

Parse all features except `data`:

```js
const Vuedoc = require('@vuedoc/parser')

const options = {
  filename: 'test/fixtures/checkbox.vue',
  features: Vuedoc.Parser.SUPPORTED_FEATURES.filter((feature) => feature !== 'data')
}

Vuedoc.parse(options)
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
| TypeScript  | Yes               | [@vuedoc/parser/loader/typescript](loader/typescript.js)  |
| Vue         | Yes               | [@vuedoc/parser/loader/vue](loader/vue.js)                |

### TypeScript usage

Vuedoc Parser implements a full TypeScript support since `v3.0.0`.
You no longer need to load a specific loader or install additional packages.

### Create a custom loader

The example below uses the abstract `Vuedoc.Loader` class to create a
specialized class to handle a template with the
[CoffeeScript](https://www.npmjs.com/package/coffeescript) language.
It uses the built-in `PugLoader` to load Pug template:

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

    // Register the built-in Pug loader
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
