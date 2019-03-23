# The Vuedoc Parser

Generate a JSON documentation for a Vue file component

[![npm](https://img.shields.io/npm/v/@vuedoc/parser.svg)](https://www.npmjs.com/package/@vuedoc/parser) [![Build status](https://gitlab.com/vuedoc/parser/badges/master/build.svg)](https://gitlab.com/vuedoc/parser/pipelines) [![Test coverage](https://gitlab.com/vuedoc/parser/badges/master/coverage.svg)](https://gitlab.com/vuedoc/parser/-/jobs)

## Table of Contents

- [Install](#install)
- [Features](#features)
- [Options](#options)
- [Usage](#usage)
- [Add component name](#add-component-name)
- [Add component description](#add-component-description)
- [Anotate props, data and computed properties](#anotate-props-data-and-computed-properties)
- [Anotate methods and events](#anotate-methods-and-events)
- [Keywords Extraction](#keywords-extraction)
- [Parsing control with options.features](#parsing-control-with-optionsfeatures)
- [Interfaces](#interfaces)
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
- Keywords Support: You can define your own keywords with the `@` symbol like `@author Sébastien`
- Extract component props
- Extract component data
- Extract computed properties with dependencies
- Extract component events
- Extract component slots
- Extract component methods
- JSDoc Support ([`@param`](http://usejsdoc.org/tags-param.html) and [`@return`](http://usejsdoc.org/tags-returns.html) tags)

## Options

| name                    | description                                                         |
|-------------------------|---------------------------------------------------------------------|
| filename                | The filename to parse. *Required* unless `filecontent` is passed    |
| filecontent             | The file content to parse. *Required* unless `filename` is passed   |
| encoding                | The file encoding. Default is `'utf8'`                              |
| features                | The component features to parse and extract.                        |
|                         | Default features: `['name', 'description', 'keywords', 'slots',`    |
|                         | `'props', 'data', 'computed', 'events', 'methods']`                 |
| defaultMethodVisibility | Can be set to `'public'` (*default*), `'protected'`, or `'private'` |
| ignoredVisibilities     | List of ignored visibilities.                                       |
|                         | Default ignored visibilities: `['protected', 'private']`            |

## Usage

See [test/fixtures/checkbox.vue](https://gitlab.com/vuedoc/parser/blob/master/test/fixtures/checkbox.vue) for an Vue Component decoration example.

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

## Add component name

By default, `vuedoc.parser` use the component's filename to generate the
component name.
To set a custom name, use the `name` field like:

```js
export default {
  name: 'my-checkbox'
}
```

## Add component description

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

## Anotate props, data and computed properties

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

`vuedoc.parser` will automatically extract `required` and `default` values for
properties and computed properties's dependencies. It will also detect type for
each defined data field.

To document a `v-model` prop, use the `@model` keyword:

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

You can also document array string props:

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

## Anotate methods and events

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

`vuedoc.parser` automatically extracts events from component hook:

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

Use the JSDoc [@param](http://usejsdoc.org/tags-param.html) and [@return](http://usejsdoc.org/tags-returns.html)
tags to define parameters and returning type:

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

`vuedoc.parser` is also able to extract events and slots from template:

```html
<template>
  <div>
    <!-- Emit the `input` event on submit -->
    <button @click="$emit('input', $event)">Submit</button>
    <!-- Default slot -->
    <slot></slot>
    <!-- Use this slot to set the checkbox label -->
    <slot name="label">Unamed checkbox</slot>
    <!--
      Slot with keywords and
      mutiline description

      @prop {User} user - The current user
      @prop {UserProfile} profile - The current user's profile
    -->
    <slot name="header" v-bind:user="user" v-bind:profile="profile"/>
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
 * @author Sébastien
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
      "description": "Sébastien"
    },
    {
      "name": "license",
      "description": "MIT"
    }
  ]
}
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
  // => [ 'name', 'description', 'keywords', 'props', 'computed', 'events', 'methods', 'slots' ]
```

## Interfaces

```js
type ParsingOutput = {
  name: string,               // Component name
  description: string,        // Component description
  keywords: Keyword[],        // Attached component keywords
  slots: SlotEntry[],         // Component slots
  props: PropEntry[],         // Component props
  data: DataEntry[],          // Component data
  computed: ComputedEntry[],  // Computed properties
  events: EventEntry[],       // Events
  methods: MethodEntry[],     // Component methods
  errors: string[]            // Syntax and parsing errors
}

enum VisibilityEnum = {
  public,
  protected,
  private
}

enum NativeTypeEnum = {
  string,
  number,
  bigint,
  boolean,
  object,
  null,
  undefined
}

type Keyword = {
  name: string,
  description: string
}

type SlotEntry = {
  readonly kind: string = 'slot',
  visibility: VisibilityEnum,
  description: string,
  keywords: Keyword[],
  name: string,
  props: SlotProp[]
}

type SlotProp = {
  name: string,
  type: string,
  description: string
}

type PropEntry = {
  readonly kind: string = 'slot',
  visibility: VisibilityEnum,
  description: string,
  keywords: Keyword[],
  name: string,                  // v-model when the @model keyword is attached
  type: Identifier,              // defined prop type. ex Array, Object, String, ...
  nativeType: NativeTypeEnum,
  default: any,                  // '__undefined__' value uncatchable value
  required: boolean = false,
  describeModel: boolean = false // true when the @model keyword is attached
}

type DataEntry = {
  readonly kind: string = 'data',
  visibility: VisibilityEnum,
  description: string,
  keywords: Keyword[],
  name: string,
  type: NativeTypeEnum,
  initial: any                   // '__undefined__' value uncatchable value
}

type ComputedEntry = {
  readonly kind: string = 'computed',
  visibility: VisibilityEnum,
  description: string,
  keywords: Keyword[],
  name: string,
  dependencies: string[]         // list of internal dependencies properties
}

type EventEntry = {
  readonly kind: string = 'event',
  visibility: VisibilityEnum,
  description: string,
  keywords: Keyword[],
  name: string,
  arguments: EventArgument[]
}

type EventArgument = {
  name: string,
  description: string,
  type: string
}

type MethodEntry = {
  readonly kind: string = 'method',
  visibility: VisibilityEnum,
  description: string,
  keywords: Keyword[],
  name: string,
  params: MethodParam[],
  return: MethodReturn
}

type MethodParam = {
  name: string,
  description: string,
  type: string,
  defaultValue: any
}

type MethodReturn = {
  type: string = 'void',
  description: string
}
```

## Related projects

- [@vuedoc/md](https://gitlab.com/vuedoc/md) - A Markdown Documentation Generator for Vue Components

## Contribute

Contributions to Vuedoc Parser are welcome. Here is how you can contribute:

1. [Submit bugs or a feature request](https://gitlab.com/vuedoc/parser/issues) and help us verify fixes as they are checked in
2. Write code for a bug fix or for your new awesome feature
3. Write test cases for your changes
4. [Submit merge requests](https://gitlab.com/vuedoc/parser/merge_requests) for bug fixes and features and discuss existing proposals

## Versioning

Given a version number `MAJOR.MINOR.PATCH`, increment the:

- `MAJOR` version when you make incompatible API changes,
- `MINOR` version when you add functionality in a backwards-compatible manner, and
- `PATCH` version when you make backwards-compatible bug fixes.

Additional labels for pre-release and build metadata are available as extensions to the `MAJOR.MINOR.PATCH` format.

See [SemVer.org](https://semver.org/) for more details.

## License

Under the MIT license. See [LICENSE](https://gitlab.com/vuedoc/parser/blob/master/LICENSE) file for more details.
