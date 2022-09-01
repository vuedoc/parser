# The Vuedoc Parser

Generate a JSON documentation for a Vue file component.

[![npm](https://img.shields.io/npm/v/@vuedoc/parser.svg)](https://www.npmjs.com/package/@vuedoc/parser)
[![Build status](https://gitlab.com/vuedoc/parser/badges/main/pipeline.svg)](https://gitlab.com/vuedoc/parser/pipelines?ref=main)
[![Test coverage](https://gitlab.com/vuedoc/parser/badges/main/coverage.svg)](https://gitlab.com/vuedoc/parser/-/jobs)
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
  * [Ignore items from parsing](#ignore-items-from-parsing)
- [Tags Extraction](#tags-extraction)
- [Supported Tags](#supported-tags)
- [Working with Mixins](#working-with-mixins)
- [Parsing control with `options.features`](#parsing-control-with-optionsfeatures)
- [Using Plugins](#using-plugins)
  * [Adding a Plugin](#adding-a-plugin)
  * [Official Plugins](#official-plugins)
  * [Building Plugins](#building-plugins)
- [Language Processing](#language-processing)
  * [Loader API](#loader-api)
  * [Built-in loaders](#built-in-loaders)
  * [Create a custom loader](#create-a-custom-loader)
- [Parsing Output Interface](#parsing-output-interface)
- [Generate Markdown Documentation](#generate-markdown-documentation)
- [Contribute](#contribute)
- [Versioning](#versioning)
- [License](#license)

## Install

This package is [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c)
: Node 16+ is needed to use it and it must be imported instead of required.

```sh
npm install --save @vuedoc/parser
```

## Features

- Extract the component name (from the `name` field or from the filename)
- Extract the component description
- [Keywords support](#keywords-extraction)
- Extract component `model`, `props`, `data`, `computed properties`,
  `events`, `slots` and `methods`
- Vue 3 support with Composition API
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

| Name                  | Description                                                                                                                                                                 |
| --------------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `filename`            | The filename to parse. *Required* unless `filecontent` is passed                                                                                                            |
| `filecontent`         | The file content to parse. *Required* unless `filename` is passed                                                                                                           |
| `encoding`            | The file encoding. Default is `'utf8'`                                                                                                                                      |
| `features`            | The component features to parse and extract.<br/>Default features: `['name', 'description', 'slots', 'props', 'data', 'computed', 'events', 'methods']`                     |
| `loaders`             | Use this option to define [custom loaders](https://gitlab.com/vuedoc/parser/blob/main/README.md#language-processing) for specific languages                                 |
| `ignoredVisibilities` | List of ignored visibilities. Default: `['protected', 'private']`                                                                                                           |
| `composition`         | Additional composition tokens for advanced components.<br/>Default value: `{ data: [], methods: [], computed: [], props: [] }`                                              |
| `resolver`            | A resolver object used to resolve imports statements. See definition file [types/ImportResolver.d.ts](https://gitlab.com/vuedoc/parser/blob/main/types/ImportResolver.d.ts) |
| `plugins`             | An array of plugins to activate. See [Using Plugins](#using-plugins) section                                                                                                |
| `jsx`                 | Set to `true` to enable JSX parsing. Default `false`                                                                                                                        |

Found [TypeScript definition here](https://gitlab.com/vuedoc/parser/blob/main/types/index.d.ts).

## Usage

Given the folowing SFC file [test/examples/circle-drawer/circle-drawer-composition.vue](https://gitlab.com/vuedoc/parser/blob/main/test/examples/circle-drawer/circle-drawer-composition.vue), the parsing usage would be:

```js
import { parseComponent } from '@vuedoc/parser';

const options = {
  filename: 'test/examples/circle-drawer/circle-drawer-composition.vue',
};

parseComponent(options)
  .then((component) => console.log(component))
  .catch((err) => console.error(err));
```

This will print this JSON output:

```js
{
  "name": "CircleDrawer",
  "description": "Circle Drawer’s goal is, among other things, to test how good the common\nchallenge of implementing an undo/redo functionality for a GUI application\ncan be solved.",
  "see": "https://eugenkiss.github.io/7guis/tasks/#circle",
  "inheritAttrs": true,
  "errors": [],
  "warnings": [],
  "keywords": [
    {
      "name": "usage",
      "description": "Click on the canvas to draw a circle. Click on a circle to select it.\nRight-click on the canvas to adjust the radius of the selected circle."
    }
  ],
  "props": [ /* ... */ ],
  "data": [ /* ... */ ],
  "computed": [ /* ... */ ],
  "slots": [ /* ... */ ],
  "events": [ /* ... */ ],
  "methods": [ /* ... */ ]
}
```

> Found the complete result here: [test/examples/circle-drawer/parsing-result.json](https://gitlab.com/vuedoc/parser/blob/main/test/examples/circle-drawer/parsing-result.json)

> Found more examples here: [test/examples](https://gitlab.com/vuedoc/parser/blob/main/test/examples)

## Syntax

### Add component name

By default, Vuedoc Parser uses the component's filename to generate the
component name.

To set a custom name, use the [`name` option](https://vuejs.org/api/options-misc.html#name):

```html
<!-- CheckboxInput.vue -->
<script>
  export default {
    name: 'my-checkbox',
  };
</script>
```

You can also use the `@name` tag:

```html
<!-- CheckboxInput.vue -->
<script>
  /**
   * @name my-checkbox
   */
  export default {
    // ...
  };
</script>
```

**Composition usage**

When using `<script setup>`, you need to define a comment block as a first
node of your script.

```html
<!-- CheckboxInput.vue -->
<script setup>
  /**
   * @name my-checkbox
   */

  import { ref } from 'vue';

  const checked = ref(false);
</script>
```

### Add component description

To add a component description, just add a comment before the `export default`
statement like:

```html
<!-- CheckboxInput.vue -->
<script>
  /**
   * My awesome custom checkbox component
   */
  export default {
    // ...
  };
</script>
```

When using `<script setup>`, you need to define a comment block as a first
node of your script.

```html
<!-- CheckboxInput.vue -->
<script setup>
  /**
   * My awesome custom checkbox component
   * @name my-checkbox
   */

  import { ref } from 'vue';

  const checked = ref(false);
</script>
```

### Annotate props

To document props, annotate your code like:

**Legacy usage**

```html
<!-- CustomInput.vue -->
<script>
  export default {
    props: {
      /**
       * Element ID
       */
      id: {
        type: String,
        required: true,
      },
      /**
       * Element initial value
       */
      value: {
        type: String,
        default: '',
      },
    },
  };
</script>
```

Vuedoc Parser will automatically extract `type`, `required` and `default` values for
properties.

**Composition usage**

```html
<!-- CustomInput.vue -->
<script setup>
  const props = defineProps({
    /**
     * Element ID
     */
    id: {
      type: String,
      required: true,
    },
    /**
     * Element initial value
     */
    value: {
      type: String,
      default: '',
    },
  });
</script>
```

Vuedoc Parser will automatically extract `type`, `required` and `default` values for
properties.

**Composition usage with TypeScript**

```html
<!-- CustomInput.vue -->
<script lang="ts" setup>
  type Props = {
    /**
     * Element ID
     */
    id: string;
    /**
     * Element initial value
     */
    value?: string;
  };

  const props = withDefaults(defineProps<Props>(), {
    value: '',
  });
</script>
```

Vuedoc Parser will automatically extract `type`, `required` and `default` values from
the type definition.

#### Annotate a `v-model` prop

**Legacy usage**

```html
<!-- CustomInput.vue -->
<script>
  export default {
    props: [
      /**
      * The input model value
      */
      'modelValue',
    ],
    emits: ['update:modelValue'],
  };
</script>
```

**Composition usage**

To document a `v-model` prop using Composition API, use
[defineProps()](https://vuejs.org/guide/components/events.html#usage-with-v-model)
macro.

```html
<!-- CustomInput.vue -->
<script setup>
  const props = defineProps([
    /**
    * The input model value
    */
    'modelValue',
  ]);

  const emit = defineEmits(['update:modelValue']);
</script>
```

**Vue 2 usage**

To document a `v-model` prop legacy Vue, use the Vue's
[model field](https://v2.vuejs.org/v2/api/#model).

```html
<!-- CustomInput.vue -->
<script>
  export default {
    /**
    * Use `v-model` to define a reactive value of the checkbox
    */
    model: {
      prop: 'checked',
      event: 'change',
    },
    props: {
      checked: Boolean,
    },
  };
</script>
```

#### Annotate Vue Array String Props

To document Vue array string props, just attach a Vuedoc comment to each prop:

**Legacy usage**

```html
<!-- CustomInput.vue -->
<script>
  export default {
    props: [
      /**
       * ELement ID
       */
      'id',

      /**
       * The element model value
       */
      'value',
    ],
  };
</script>
```

**Composition usage**

```html
<script setup>
  const props = defineProps([
    /**
     * ELement ID
     */
    'id',

    /**
     * The element model value
     */
    'value',
  ]);
</script>
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

```html
<!-- NumberInput.vue -->
<script>
  export default {
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
          return anythingExpression();
        },
      },
      /**
       * The input validation function
       * @kind function
       * @param {any} value - User input value to validate
       * @returns {boolean} - `true` if validation succeeds; `false` otherwise.
       */
      validator: {
        type: Function,
        default: (value) => !Number.isNaN(value),
      },
    },
  };
</script>
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

**Legacy usage**

```html
<!-- CheckboxInput.vue -->
<script>
  export default {
    data() {
      return {
        /**
         * Indicates that the control is checked
         */
        checked: false,
      };
    },
  };
</script>
```

**Composition usage**

```html
<!-- CheckboxInput.vue -->
<script>
  import { ref } from 'vue';

  export default {
    setup() {
      return {
        /**
         * Indicates that the control is checked
         */
        checked: ref(false),
      };
    },
  };
</script>
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

```html
<!-- CheckboxInput.vue -->
<script>
  export default {
    data() {
      return {
        /**
         * A data with a complex expression
         * @type boolean
         * @initialValue false
         */
        checked: ExternalHelper.getDefaultValue(),
      };
    },
  };
</script>
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

**Legacy usage**

```html
<!-- CheckboxInput.vue -->
<script>
  export default {
    props: {
      checked: Boolean,
    },
    computed: {
      /**
       * Indicates that the control is selected
       */
      selected () {
        return this.checked;
      },
    },
  };
</script>
```

Vuedoc Parser will automatically extract computed properties dependencies.

**Composition usage**

```html
<!-- CheckboxInput.vue -->
<script>
  import { computed } from 'vue';

  export default {
    props: {
      checked: Boolean,
    },
    setup(props) {
      return {
        /**
         * Indicates that the control is selected
         */
        selected: computed(() => props.checked),
      };
    },
  };
</script>
```

**Usage with `<script setup>`**

```html
<!-- CheckboxInput.vue -->
<script setup>
  import { computed } from 'vue';

  const props = defineProps({
    checked: Boolean,
  });

  /**
   * Indicates that the control is selected
   */
  const selected = computed(() => props.checked);
</script>
```

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

To document methods, simply use JSDoc tags
[`@param`](http://usejsdoc.org/tags-param.html) and
[`@returns`](http://usejsdoc.org/tags-returns.html):

**Legacy usage**

```html
<!-- CheckboxInput.vue -->
<script>
  export default {
    methods: {
      /**
       * Submit form
       *
       * @param {object} data - Data to submit
       * @returns {boolean} true on success; otherwise, false
       */
      submit(data) {
        return true;
      },
    },
  };
</script>
```

**Composition usage**

```html
<!-- CheckboxInput.vue -->
<script setup>
  /**
   * Submit form
   *
   * @param {object} data - Data to submit
   * @returns {boolean} true on success; otherwise, false
   */
  function submit(data) {
    return true;
  }
</script>
```

**Special tags for methods**

- `@method <method name>`<br>
  You can use special tag `@method` for non primitive name:
  
  ```html
  <script>
    const METHODS = {
      CLOSE: 'closeModal',
    };
  
    export default {
      methods: {
        /**
          * Close modal
          * @method closeModal
          */
        [METHODS.CLOSE] () {},
      },
    };
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
  
  ```html
  <script>
    export default {
      methods: {
        /**
         * @syntax target.addEventListener(type, listener [, options]);
        * @syntax target.addEventListener(type, listener [, useCapture]);
        * @syntax target.addEventListener(type, listener [, useCapture, wantsUntrusted  ]); // Gecko/Mozilla only
        */
        addEventListener(type, listener, options, useCapture) {},
      },
    };
  </script>
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

**Legacy usage**

To document events using the legacy syntax, use the
[emits](https://vuejs.org/api/options-state.html#emits)
field and tags `@arg` or `@argument` to define arguments:

Array syntax:

```html
<script>
  export default {
    emits: [
      /**
       * Emit the `loading` event on submit
       *
       * @arg {boolean} status - The loading status
       */
      'loading',
      /**
       * Emit the `input` event on submit
       */
      'input',
    ],
  };
</script>
```

Object syntax with validation:

```html
<script>
  export default {
    emits: {
      /**
       * Emit the `loading` event on submit
       *
       * @arg {boolean} status - The loading status
       */
      loading: null, // no validation

      /**
       * Emit the `input` event on submit
       */
      input: (payload) => {
        if (payload.email && payload.password) {
          return true
        } else {
          console.warn(`Invalid submit event payload!`)
          return false
        }
      },
    },
  };
</script>
```

**Composition usage**

Array syntax:

```html
<script setup>
  const emit = defineEmits([
    /**
     * Emit the `loading` event on submit
     *
     * @arg {boolean} status - The loading status
     */
    'loading',
    /**
     * Emit the `input` event on submit
     */
    'input',
  ]);
</script>
```

Object syntax with validation:

```html
<script setup>
  const emit = defineEmits({
    /**
     * Emit the `loading` event on submit
     *
     * @arg {boolean} status - The loading status
     */
    loading: null, // no validation

    /**
     * Emit the `input` event on submit
     */
    input: (payload) => {
      if (payload.email && payload.password) {
        return true
      } else {
        console.warn(`Invalid submit event payload!`)
        return false
      }
    },
  });
</script>
```

**Composition usage with TypeScript**

```html
<script setup>
  const emit = defineEmits<{
    /**
     * Emit the `loading` event on submit
     *
     * @arg {boolean} status - The loading status
     */
    (e: 'loading', value: boolean): void

    /**
     * Emit the `input` event on submit
     */
    (e: 'input', value: boolean): void
  }>()
</script>
```

**Vue 2 usage**

Vuedoc Parser automatically extracts events from component template, hooks and
methods when using Vue 2:

```html
<script>
  export default {
    created() {
      /**
       * Emit the `loading` event on submit
       * @arg {boolean} status - The loading status
       */
      this.$emit('loading', true);
    },
    methods: {
      submit() {
        /**
        * Emit the `input` event on submit
        */
        this.$emit('input', true);
      },
    },
  };
</script>

<template>
  <div>
    <!-- Emit the `click` event on submit -->
    <button @click="$emit('click', $event)">Submit</button>
  </div>
</template>
```

You can use special keyword `@event` for non primitive name:

```html
<script>
  const EVENTS = {
    CLOSE: 'close',
  };

  export default {
    methods: {
      closeModal() {
        /**
          * Emit the `close` event on click
          * @event close
          */
        this.$emit(EVENTS.CLOSE, true);
      },
    },
  };
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

To annotate slots defined in Render Functions, just attach the tag `@slot`
to the component definition:

```html
<script>
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
        h('p', slots().default),
      ]);
    },
  };
</script>
```

You can also use the tag `@slot` to define dynamic slots on template:

```html
<template>
  <div>
    <template v-for="name in ['title', 'default']">
      <!--
        @slot title - A title slot
        @slot default - A default slot
      -->
      <slot :name="name"></slot>
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

### Ignore items from parsing

Use the [JSDoc's tag `@ignore`](https://jsdoc.app/tags-ignore.html) to keeps the
subsequent code from being documented.

```html
<!-- CheckboxInput.vue -->
<script>
  export default {
    data: () => ({
      /**
       * This will be ignored on parsing
       * @ignore
       */
      checked: false,
    }),
  };
</script>
```

You can also use the [TypeDoc's tag `@hidden`](https://typedoc.org/guides/doccomments/#hidden-and-ignore).

## Tags Extraction

You can attach keywords (or tags) to any comment and then extract them using
the parser.

**Usage**

```html
<script>
  /**
   * Component description
   *
   * @license MIT
   */
  export default { /* ... */ };
</script>
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

## Supported Tags

| Tag                   | Scope                       | Description                                                                                |
| --------------------- | --------------------------- | ------------------------------------------------------------------------------------------ |
| `@name`               | `component`                 | Provide a custom name of the component                                                     |
| `@type`               | `props`, `data`, `computed` | Provide a type expression identifying the type of value that a prop or a data may contain  |
| `@default`            | `props`                     | Provide a default value of a prop                                                          |
| `@kind`               | `props`                     | Used to document what kind of symbol is being documented                                   |
| `@initialValue`       | `data`                      | Provide an initial value of a data                                                         |
| `@method`             | `methods`                   | Force the name of a specific method                                                        |
| `@syntax`             | `methods`                   | Provide the custom method syntax                                                           |
| `@param`              | `methods`                   | Provide the name, type, and description of a function parameter                            |
| `@returns`, `@return` | `methods`                   | Document the value that a function returns                                                 |
| `@event`              | `events`                    | Force the name of a specific event                                                         |
| `@arg`, `@argument`   | `events`                    | Provide the name, type, and description of an event argument                               |
| `@slot`               | `slots`                     | Document slot defined in render function                                                   |
| `@prop`               | `slots`                     | Provide the name, type, and description of a slot prop                                     |
| `@mixin` *deprecated* | `component`                 | Force parsing of the exported item as a mixin component. This is deprecated since `v4.0.0` |
| `@version`            | `all`                       | Assign a version to an item                                                                |
| `@since`              | `all`                       | Indicate that an item was added in a specific version                                      |
| `@author`             | `all`                       | Identify authors of an item                                                                |
| `@deprecated`         | `all`                       | Mark an item as being deprecated                                                           |
| `@see`                | `all`                       | Allow to refer to a resource that may be related to the item being documented              |
| `@ignore`             | `*`                         | Keep the subsequent code from being documented                                             |
| **TypeDoc**           |                             |                                                                                            |
| `@category`           | `all`                       | Attach a category to an item                                                               |
| `@hidden`             | `*`                         | Keep the subsequent code from being documented                                             |
| **Visibilities**      |                             |                                                                                            |
| `@public`             | `*`                         | Mark a symbol as public                                                                    |
| `@protected`          | `*`                         | Mark a symbol as private                                                                   |
| `@private`            | `*`                         | Mark a symbol as protected                                                                 |

> `*` stand for `props`, `data`, `methods`, `events`, `slots`

## Working with Mixins

Starting `v4.0.0`, Vuedoc Parser implements a mechanism to automatically
load needed import declarations to parse and extract metadata.

With this new capability, Vuedoc Parser is now able to handle Vue mixins
automatically.

## Parsing control with `options.features`

`options.features` lets you select which Vue Features you want to parse and
extract.

The default value is defined by `VuedocParser.SUPPORTED_FEATURES` array.

**Usage**

Only parse `name`, `props`, `computed properties`, `slots` and `events`:

```js
import { parseComponent } from '@vuedoc/parser';

const options = {
  filename: 'test/examples/circle-drawer/circle-drawer-composition.vue',
  features: [ 'name', 'props', 'computed', 'slots', 'events' ],
};

parseComponent(options)
  .then((component) => Object.keys(component))
  .then((keys) => console.log(keys));
  // => [ 'name', 'props', 'computed', 'slots', 'events' ]
```

Parse all features except `data`:

```js
import { parseComponent, VuedocParser } from '@vuedoc/parser';

const options = {
  filename: 'test/examples/circle-drawer/circle-drawer-composition.vue',
  features: VuedocParser.SUPPORTED_FEATURES.filter((feature) => feature !== 'data'),
};

parseComponent(options)
  .then((component) => Object.keys(component))
  .then((keys) => console.log(keys));
  // => [ 'name', 'description', 'keywords', 'model',
  //      'props', 'computed', 'events', 'methods', 'slots' ]
```

## Using Plugins

Vuedoc can be extended using plugins.

### Adding a Plugin

To use a plugin, it needs to be added to the `devDependencies` of the project
and included in the plugins array `options.plugins`. For example, to provide
support of Vue Router, the official [`@vuedoc/plugin-vue-router`](https://gitlab.com/vuedoc/plugin-vue-router)
can be used:

```sh
$ npm add -D @vuedoc/plugin-vue-router
```

```js
// main.js
import { parseComponent } from '@vuedoc/parser';
import { VueRouterPlugin } from '@vuedoc/plugin-vue-router';

const component = await parseComponent({
  plugins: [
    VueRouterPlugin,
  ],
  // ...
});
```

### Official Plugins

| Name              | Description                      | Documentation                                                              |
| ----------------- | -------------------------------- | -------------------------------------------------------------------------- |
| Vue Router Plugin | The Vue Router plugin for Vuedoc | [`@vuedoc/plugin-vue-router`](https://gitlab.com/vuedoc/plugin-vue-router) |
| Vuex Plugin       | The Vuex plugin for Vuedoc       | [`@vuedoc/plugin-vuex`](https://gitlab.com/vuedoc/plugin-vuex)             |

### Building Plugins

**Plugins Overview**

A Vuedoc plugin is an object with one or more of the properties, parsing hooks
described below, and which follows our conventions.
A plugin should be distributed as a package which exports a function 
that can be called with plugin specific options and returns such an 
object.

Plugins allow you to customise Vuedoc's behaviour by, for example, 
handling and parse parsing result object before sending the final result, or
adding support of a third-party modules in your `node_modules` folder.

**Conventions**

- Plugins should have a clear name with `vuedoc-plugin-` prefix.
- Include `vuedoc-plugin` keyword in `package.json`.
- Plugins should be tested.
- Document your plugin in English.

**Interface**

```ts
type Plugin = (parser: Parser) => PluginDefinition;

interface PluginDefinition {
  /**
   * Custom import resolver
   */
  resolver?: ImportResolver;

  /**
   * List of resource files to preload before parsing
   */
  preload?: string[];

  /**
   * Additional composition tokens for advanced components
   */
  composition?: Partial<ParsingComposition>;

  /**
   * Handle parsing result
   */
  handleParsingResult?(component: ParseResult): void;
}

interface Parser extends EventTarget {
  /**
   * Resolved options
   */
  readonly options: ResolvedOptions;

  addEventListener(
    type: EventType,
    callback: EventListener<EntryEvent<EventType>>,
    options?: boolean | AddEventListenerOptions
  ): void;

  addEventListener<T extends MessageEventType>(
    type: EventType,
    callback: EventListener<MessageEvent<EventType>>,
    options?: boolean | AddEventListenerOptions
  ): void;

  addEventListener(
    type: 'end',
    callback: EventListener<EndEvent>,
    options?: boolean | AddEventListenerOptions
  ): void;
}

type EventType = 'computed' | 'data' | 'description' | 'event' | 'inheritAttrs' | 'keyword' | 'method' | 'model' | 'name' | 'prop';
```

Please see [PluginInterface from types/index.d.ts from detailled types](https://gitlab.com/vuedoc/parser/blob/main/types/index.d.ts).

## Language Processing

### Loader API

Please see [TypeScript definition file for the Loader class](https://gitlab.com/vuedoc/parser/blob/main/types/Loader.d.ts).

### Built-in loaders

| Language   | Load by default? | Module                                                                                                    |
| ---------- | ---------------- | --------------------------------------------------------------------------------------------------------- |
| HTML       | Yes              | [@vuedoc/parser/loaders/html](https://gitlab.com/vuedoc/parser/blob/main/src/loaders/html.ts)             |
| JavaScript | Yes              | [@vuedoc/parser/loaders/javascript](https://gitlab.com/vuedoc/parser/blob/main/src/loaders/javascript.ts) |
| Pug        | No               | [@vuedoc/parser/loaders/pug](https://gitlab.com/vuedoc/parser/blob/main/src/loaders/pug.ts)               |
| TypeScript | Yes              | [@vuedoc/parser/loaders/typescript](https://gitlab.com/vuedoc/parser/blob/main/src/loaders/typescript.ts) |
| Vue        | Yes              | [@vuedoc/parser/loaders/vue](https://gitlab.com/vuedoc/parser/blob/main/src/loaders/vue.ts)               |

### Create a custom loader

The example below uses the abstract `Vuedoc.Loader` class to create a
specialized class to handle a template with the
[CoffeeScript](https://www.npmjs.com/package/coffeescript) language.
It uses the built-in `PugLoader` to load Pug template:

```js
import { parseComponent, Loader } from '@vuedoc/parser';
import { PugLoader } from '@vuedoc/parser/loaders/pug';
import { compile } from 'coffeescript';

class CoffeeScriptLoader extends Loader {
  load (source) {
    const outputText = compile(source);

    this.emitScript(outputText);
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
    Loader.extend('coffee', CoffeeScriptLoader),

    // Register the built-in Pug loader
    Loader.extend('pug', PugLoader),
  ],
};

parseComponent(options).then((component) => {
  console.log(component);
});
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

Please see [TypeScript definition file](https://gitlab.com/vuedoc/parser/blob/main/types/index.d.ts).

## Generate Markdown Documentation

To generate a markdown documentation, please use the [@vuedoc/md](https://gitlab.com/vuedoc/md) package.

## Contribute

Please follow [CONTRIBUTING.md](https://gitlab.com/vuedoc/parser/blob/main/CONTRIBUTING.md).

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
See [LICENSE](https://gitlab.com/vuedoc/parser/blob/main/LICENSE) file for
more details.
