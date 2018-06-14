# The vuedoc parser
Generate a JSON documentation for a Vue file component

[![npm](https://img.shields.io/npm/v/@vuedoc/parser.svg)](https://www.npmjs.com/package/@vuedoc/parser) [![Build status](https://gitlab.com/vuedoc/parser/badges/master/build.svg)](https://gitlab.com/vuedoc/parser/pipelines) [![Test coverage](https://gitlab.com/vuedoc/parser/badges/master/coverage.svg)](https://gitlab.com/vuedoc/parser/-/jobs)

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
| name                    | description                                                       | default value |
|-------------------------|-------------------------------------------------------------------|---------------|
| filename                | The filename to parse. *Required* unless `filecontent` is passed  |               |
| filecontent             | The file content to parse. *Required* unless `filename` is passed |               |
| encoding                | The file encoding                                                 | `'utf8'`      |
| features                | The component features to parse and extract                       | `['name', 'description', 'keywords', 'slots', 'props', 'data', 'computed', 'events', 'methods']` |
| defaultMethodVisibility | Can be set to `'public'`, `'protected'`, or `'private'`           | `'public'`    |

## Usage
See [test/fixtures/checkbox.vue](https://github.com/vuedoc/parser/blob/master/test/fixtures/checkbox.vue) for an Vue Component decoration example.

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
  "header": [
    {
      "entry": {
        "name": "checkbox" // The component name
      },
      
      // The component description
      "comments": [
        "A simple checkbox component"
      ],
      
      // Attached keywords
      keywords: [
        { name: "author", "description": "Sébastien" }
      ]
    }
  ],
  "props": [ ... ],
  "data": [ ... ],
  "computed": [ ... ],
  "slots": [ ... ],
  "events": [ ... ],
  "methods": [ ... ]
}
```

See [test/fixtures/checkbox-result.json](https://github.com/vuedoc/parser/blob/master/test/fixtures/checkbox-result.json) for the complete result.

## Add component name

By default, `vuedoc.parser` use the component's filename to generate the component name.
To set a custom name, use the `name` field like:

```js
export default {
  name: 'my-checkbox'
}
```

## Add component description

To add a component description, just add a comment before the `export` keyword like:

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

`vuedoc.parser` will automatically extract `required` and `default` values for properties and computed properties's dependencies.

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
To change this for one entry, add `@protected` or `@private` keywork.

```js
export default {
  data: () => ({
    /**
     * Indicates that the control is checked
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
    submit () {
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

Use the JSDoc [@param](http://usejsdoc.org/tags-param.html) and [@return](http://usejsdoc.org/tags-returns.html) tags to define parameters and returning type:

```js
export default {
  methods: {
    /**
     * Submit form
     * @param {object} data - Data to submit
     * @return {boolean} true on success; otherwise, false
     */
    submit (data) {
      /**
       * Emit the `loading` event on submit
       * @param {boolean} status - The loading status
       */
      this.$emit('loading', true)

      return true
    }
  }
}
```

`vuedoc.parser` is also able to extract event event from template:

```html
<template>
  <!-- Emit the `input` event on submit -->
  <button @click="$emit('input', $event)">Submit</button>
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
`options.features` lets you select which Vue Features you want to parse and extract.
The default value is define by `Parser.SUPPORTED_FEATURES` array.

**Usage**

Only parse `name`, `props`, `computed properties` and `events`:

```js
const vuedoc = require('@vuedoc/parser')
const options = {
  filename: 'test/fixtures/checkbox.vue',
  features: [ 'name', 'props', 'computed', 'events' ]
}

vuedoc.parse(options)
  .then((component) => Object.keys(component))
  .then((keys) => console.log(keys)) // => { name, props, computed, events }
  .catch((err) => console.error(err))
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
  .then((keys) => console.log(keys)) // => { name, description, keywords, props, computed, events, methods }
  .catch((err) => console.error(err))
```

## Related projects
- [@vuedoc/md](https://gitlab.com/vuedoc/md) - A Markdown Documentation Generator for Vue File Components

## License

Under the MIT license. See [LICENSE](https://gitlab.com/vuedoc/parser/blob/master/LICENSE) file for more details.
