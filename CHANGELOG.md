## Vuedoc Parser 4.0.0-beta12

This release fixes the plugins section on the README documentation.

## Vuedoc Parser 4.0.0-beta11

This release fixes packaging by adding the missing `@vuedoc/parser/test-utils`
module.

## Vuedoc Parser 4.0.0-beta10

This release introduces Vuedoc Plugins and many other new features and
improvements:

**New features**

- Introduce Vuedoc Plugins
- Add support of Vue Mixins
- Load imports automatically when needed
- Add `options.resolver` used to resolve imports
- Extensible Parsing with `options.composition`
- Add `@vuedoc/parser/test-utils` for testing

**Improvements**

- Use `EventTarget` as base class for the main parser class. This help for a
  better events handling and useful for preventing event propagation.
- Improve parsing of variable declarations
- Improve parsing performance by reducing internal instances
- Improve documentation by adding more examples

**Dependencies Changes***

- Upgrade to `@babel/parser@7.18.13`

## Vuedoc Parser 4.0.0-beta9

This release fixes an ESM import bug and upgrades to @babel/parser@7.18.9.

## Vuedoc Parser 4.0.0-beta8

This release comes with breaking changes and important new features.

### Important Features

- Handle Vue 3 syntax
- Handle Vue Composition API

### Breaking Changes

- **Pure ESM package**

  Vuedoc Parser 4.0.0 is now [ESM only](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c).
  This means that Node 16+ is needed to use it and it must be imported instead of
  required.

  Please see [this](https://gist.github.com/sindresorhus/a39789f98801d908bbc7ff3ecc99d99c) for migration guide.

- **Rename `exports.parse()` to `exports.parseComponent()`**

  `exports.parse()` has been renamed to `exports.parseComponent()`.
  
  Please see [usage on documentation](https://gitlab.com/vuedoc/parser/-/tree/main#usage).

- **Add TypeScript definitions**

  This release now includes [TypeScript definition](https://gitlab.com/vuedoc/parser/blob/main/index.d.ts).

- **Standardize extracted types**

  All extracted types has been standardized to be TypeScript-like. This means:
  * Type `String` is now parsed as `string`
  * Type `Number` is now parsed as `number`
  * Type `Boolean` is now parsed as `boolean`
  * Type `Array` is now parsed as `array`
  * Type `Object` is now parsed as `object`
  * Type `Function` is now parsed as `function`
  * Type `Symbol` is now parsed as `symbol`

- **Remove deprecated `@model` tag**
  
  Tag deprecated `@model` was removed. You now need to use the Vue standard way
  to define `v-model`.
  Please see [official documentation about annotating a `v-model` prop](https://gitlab.com/vuedoc/parser/-/tree/main#annotate-a-v-model-prop)

## Vuedoc Parser v3.4.0

This release fixes some parsing issues and upgrades `@babel/parser` to
`7.15.6`.

**Changes**

- Fix invalid scoped variable reference issue (#104, fed8cbc)
- Use `unknown` as the default implicit type (fed8cbc)
- Upgrade to `@babel/parser@7.15.6`

## Vuedoc Parser v3.3.2

This release fixes a parsing of spread syntax on computed properties (#103,
9b3d1e57).

## Vuedoc Parser v3.3.1

This release fixes a parsing data regression and upgrades `@babel/parser` to
`7.15.5`.

**Changes**

- Fix regression parsing of data value (#101, #102, 5bc42df)
- Upgrade to @babel/parser@7.15.5 (1408b1e)

## Vuedoc Parser v3.3.0

This release adds a partial support of Vue Property Decorator 9.1.2 by
parsing `@ModelSync`, `@ref` and `@VModel`.

## Vuedoc Parser v3.2.1

This release fixes typo of type `unknow` to `unknown` (#97, 6d83e495)

## Vuedoc Parser v3.2.0

This release adds some improvements.

**Changes**

- Handle TypeScript and JavaScript access visibility (#93, bb714299)
- Automatic type detection for computed properties (#94, 04611b4d)

## Vuedoc Parser v3.1.1

This release fixes some bugs and upgrades to `@babel/parser@7.12.11`.

**Changes**

- Now use `@babel/parser@7.12.11`
- Fix multi-line type value (#92)
- Improve parsing of data as `TSAsExpression` (1ab77fd)

## Vuedoc Parser v3.1.0

This release fixes some bugs and introduces a new event `warning` to emit JSDoc
syntax issue.

**Changes**

- Now use `@babel/parser@7.12.7`
- Emit warning for invalid JSDoc syntax (#91)
- Parse watch property to handle events (#90)
- Improve parsing of dynamic slot (#89)

## Vuedoc Parser v3.0.0

This is the official release of Vuedoc Parser 3.0.0.
The only change with the previous beta 4 is the upgrade to
`@babel/parser@7.11.5`.

Please see [release notes of previous betas](https://gitlab.com/vuedoc/parser/-/blob/v3.0.0/CHANGELOG.md)
for all changes on Vuedoc Parser 3.0.0.

## Vuedoc Parser v3.0.0-beta4

This release adds an initial JSX support.
It also fixes an issue related to TSX (#87).

## Vuedoc Parser v3.0.0-beta3

This release improves parsing of TypeScript Labeled Tuple Elements.
It also upgrades dependencies to `@babel/parser@7.11.4` and
`vue-template-compiler@2.6.12`.

## Vuedoc Parser v3.0.0-beta2

This release improves parsing of props and data by handling `TSAsExpression`.

## Vuedoc Parser v3.0.0-beta1

This release comes with breaking changes and important new features.

**Native TypeScript support**

Since the Vuedoc Parser 3.0.0, the parser now supports TypeScript natively.
It's no longer necessary to use a specific Vuedoc Loader to parse a component
written with TypeScript.

**Changes**
- Allow multiline in `@param` and `@returns`
- Add support of `@category`, `@kind`, `@see`, `@deprecated`, `@author`,
  `@since` and `@version`
- Improve parsing of async method and generator
- Remove options `defaultMethodVisibility` and `stringify`
- Add support of `@syntax`
- Implement JSDoc's `@type` specification
- Add support of TypeDoc tags
- Add a JSON Schema file for parser options (`@vuedoc/parser/schema/options.js`)
- Fix parsing of MemberExpression in for events (#83)
- Improve parsing of default prop value
- Add support of @znck/prop-types (#69)
- Fix finding of sibling node for Markup Node (#81)
- Natively support keyword `@type` for prop
- Fix parsing of UnaryExpression (#80)
- Move to `@babel/parser` (#77, #78)
- Improve parsing of complex generic type (#77)
- Improve parsing of factoring mixins

**New tags support**

| Keyword       | Scope       | Description                                                                               |
| ------------- | ----------- | ----------------------------------------------------------------------------------------- |
| `@kind`       | `props`     | Used to document what kind of symbol is being documented                                  |
| `@syntax`     | `methods`   | Provide the custom method syntax                                                          |
| `@mixin`      | `component` | Force parsing of the exported item as a mixin component                                   |
| `@version`    | `all`       | Assign a version to an item                                                               |
| `@since`      | `all`       | Indicate that an item was added in a specific version                                     |
| `@author`     | `all`       | Identify authors of an item                                                               |
| `@deprecated` | `all`       | Mark an item as being deprecated                                                          |
| `@see`        | `all`       | Allow to refer to a resource that may be related to the item being documented             |
| `@ignore`     | `*`         | Keep the subsequent code from being documented                                            |
| **TypeDoc**                                                                                                             |
| `@category`   | `all`       | Attach a category to an item                                                              |
| `@hidden`     | `*`         | Keep the subsequent code from being documented                                            |

> `*` stand for `props`, `data`, `methods`, `events`, `slots`

**Parsing Output changes**

```diff
type ParsingOutput = {
  name: string;               // Component name
  description?: string;       // Component description
+  category?: string;
+  version?: string;
+  since?: string;
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

interface PropEntry {
  kind: 'prop';
  name: string;
  type: string | string[];
-  nativeType: NativeTypeEnum;
  default: string;
  required: boolean;
  description?: string;
  describeModel: boolean;
  keywords: Keyword[];
+  category?: string;
+  version?: string;
+  since?: string;
  visibility: 'public' | 'protected' | 'private';
}

interface DataEntry {
  kind: 'data';
  name: string;
-  type: NativeTypeEnum;
+  type: string;
  initialValue: string;
  description?: string;
  keywords: Keyword[];
+  category?: string;
+  version?: string;
+  since?: string;
  visibility: 'public' | 'protected' | 'private';
}

interface ComputedEntry {
  kind: 'computed';
  name: string;
  dependencies: string[];
  description?: string;
  keywords: Keyword[];
+  category?: string;
+  version?: string;
+  since?: string;
  visibility: 'public' | 'protected' | 'private';
}

interface MethodEntry {
  kind: 'method';
  name: string;
  params: MethodParam[];
-  return: MethodReturn;
+  returns: MethodReturn;
+  syntax: string[];
  description?: string;
  keywords: Keyword[];
+  category?: string;
+  version?: string;
+  since?: string;
  visibility: 'public' | 'protected' | 'private';
}

type MethodParam = {
  name: string;
  type: NativeTypeEnum | string;
  description?: string;
  defaultValue?: string;
+  rest: boolean;
};

interface EventEntry {
  kind: 'event';
  name: string;
  description?: string;
  arguments: EventArgument[];
  keywords: Keyword[];
+  category?: string;
+  version?: string;
+  since?: string;
  visibility: 'public' | 'protected' | 'private';
}

type EventArgument = {
  name: string;
  type: NativeTypeEnum | string;
  description?: string;
+  rest: boolean;
};

interface SlotEntry {
  kind: 'slot';
  name: string;
  description?: string;
  props: SlotProp[];
  keywords: Keyword[];
+  category?: string;
+  version?: string;
+  since?: string;
  visibility: 'public' | 'protected' | 'private';
}
```

## Vuedoc Parser v2.4.0

This release improves parsing of mixins and fix some parsing issues.

**Changes**

- Expose `lib/parser/Parser.js` to `Vuedoc.Parser` (e73d7c9)
- Improve documentation
- Fix parsing of generic type `T<x>` e.g. `Promise<numeric>` (6f8e04b)
- Improve parsing of mixins (eae87ff)
- Introduce keyword `@mixin`. See [README.md](https://gitlab.com/vuedoc/parser/-/blob/v2.4.0/README.md#working-with-mixins)

## Vuedoc Parser v2.3.0

This release introduces a new option `stringify` and upgrades to `acorn@7.3.1` and `acorn-stage3@3.0.0`.

**Note for `stringify` option**

By default Vuedoc Parser parses literal values defined in the source code. This means:

```javascript
const binVar = 0b111110111 // will be parsed as binVar = 503
const numVar = 1_000_000_000 // will be parsed as numVar = 1000000000
```

To preserve literal values, set the `stringify` option to `true`.

```javascript
const binVar = 0b111110111 // will be parsed as binVar = 0b111110111
const numVar = 1_000_000_000 // will be parsed as numVar = 100_000_0000
```

## Vuedoc Parser v2.2.1

This release updates the [Parsing Output Interface](https://gitlab.com/vuedoc/parser/-/tree/v2.2.1#parsing-output-interface)
documentation

## Vuedoc Parser v2.2.0

This release improves the parsing of default and initial value (#74)

## Vuedoc Parser v2.1.1

This release fixes the invalid output interface issue (#73)

## Vuedoc Parser v2.1.0

This release adds many improvements of the parsing and fixes reported bugs on
the v2.0.0

**Changes**

- Using `@model` keyword no longer overwrite the prop name to `v-model`. Use
  `prop.describeModel` to identify the `v-model`'s prop.

**Improvements**

- Improve parsing of v-model prop (#72)
- Add support of numeric separators and logical assignments (#71)
- Improve documentation of Parsing Output Interface (#68)
- Rename default type `Any` to `any` (#67)

**Bug fixes**

- Fix parsing of prop with multiple types (#70)
- Fix JSDoc: Parsing issue with `@returns` and type (#66)

## Vuedoc Parser v2.0.0

This major release v2.0.0 upgrades de NodeJS engine to v8, adds a fully support of ECMAScript, Class Component, TypeScript.

> **Important note:** The documentation have been completely rewrited.
  Please read the [README.md](https://gitlab.com/vuedoc/parser/-/blob/765b93e6fa0799de4bae31e044bbe3d18318ffac/README.md)
  file cerfully

**Breaking changes**

- Drop NodeJS 6. Now use NodeJS 8 engine (702fdfc1)
- New [Parsing Output Interface](https://gitlab.com/vuedoc/parser/-/blob/765b93e6fa0799de4bae31e044bbe3d18318ffac/README.md#interfaces)

**Features**

- Add support of scoped slots (ed4ddb69)
- ECMAScript Features Parsing (02f69660)
- Support of stage 3 proposals (574cf7f0)
- BigInt support (9c9358d0)
- Introduce [Vuedoc Parser Loader](https://gitlab.com/vuedoc/parser/-/blob/765b93e6fa0799de4bae31e044bbe3d18318ffac/README.md#language-processing)
  to process custom languages
- Add support of Class Components (66d16469)
- Add support of the model field (f2bbf203)
- Add support of the inheritAttrs field (b89f24a5, 87576ced)
- Add support of Inline Template (a5b81fd8)
- Add support of Vue Instance (#48)
- Add support of JSDoc
- Add support of Vue Property Decorator
  (20e2668f897f517f3cace3eb2d71d0fd57f21386)
- Add loader for TypeScript (9f4678cced2275e8c045f826ab58d9ba77d3d720)
- Add loader for Pug (c582bb1b99a9ac8fb6a185caf3810abc5ac95632)
- New keyword `@default` to set a custom prop's default value (#50)
- New keyword `@slot` to annotate slots when using render functions (#53)
- New keyword `@method` to set a custom method name
  (ee94dbe596e56d8ec75b79dbdc5436800c28d436)
- New keyword `@name` to set the component name
  (d5b89408a65cca9a3bc7c49b46690dfa4a6d9a05)

**Changes from v2.0.0-beta.5**

- Fix Null Pointer Exception on AbstractParser.getValue()
  (4ff22f3154a87405c1371add6d3c9fa97e46710e)
- Add support of dynamic property key (805ca2ade604a1deede8906f7131120fe37074e0)
- Use node.computed to handle dynamic property key
  (ac65a251ba37264ef6c30e3ce7ef1ae362d71551)
- Add support of `@Prop` and `@Model` (461af08ccea1e00f0e3664496b07b802111d315b)
- Add support of `@PropSync` (90a4e5f7a2b325e96cc0c7efd8ae0e1f5659c80b)
- Add support of `@Watch` (704d1f89fb6e5ce506779970127f565f0aa5a0f8)
- Add support of `@Emit` (770ca104d94c143b783ce1b0f6717c8c406740ad)
- Fix TypeScript Loader example (35cce563e11cbd9f5182dd773ae3cc67b0b0d7cc)
- Add support of Vue Property Decorator
  (20e2668f897f517f3cace3eb2d71d0fd57f21386)
- Fix security vulnerabilities (6bc127767c83358477504b882869e138a986768d)
- Upgrade to `acorn@7.1.1` (235f06c994c398a9ae19e9d10f9c36d56f4c6e06)
- JSDoc: support param without description
  (ed4c9b257a6cb6fe718a7ffb4f5d5bf39132b446)
- Add support of `@method` keyword (ee94dbe596e56d8ec75b79dbdc5436800c28d436)
- Fix handling of event arguments (3453604c1de9ff8c1d0b4c7c79290bdc28c10694)
- Handle CallExpression references (abdcbc2100c5590e7f070142ea3897c81e72588a)
- Support of new keyword `@name` (d5b89408a65cca9a3bc7c49b46690dfa4a6d9a05)
- Fix parsing of arrow function with no body brackets to another function
  (ae49e8e3bc686bc630663fbea83ba8225c8bce3c)
- Add a loader for TypeScript (9f4678cced2275e8c045f826ab58d9ba77d3d720)
- Add loader for Pug (c582bb1b99a9ac8fb6a185caf3810abc5ac95632)
- Fix interface syntax (154552d148bb3bbfa77f9c22b65d0ee228dccbfd)

## Vuedoc Parser v2.0.0-beta.5

This release:
- adds support of Vue Instance,
- introduces new keywords (@slot and @default),
- fixes a bug.

**Bug fixes**

- Fix parsing of prop as array type declaration (#52)

**Documentation**

- Explain how to work with Mixins (#51)

**New features**

- Add support of Vue Instance (#48)
- New keyword `@default` to set a custom prop's default value (#50)
- New keyword `@slot` to annotate slots when using render functions (#53)

**Annotate a Vue Instance**

```js
/**
 * A Vue App Component
 * @version 1.2
 */
export default new Vue({
  name: 'App',
  props: ['todo'],
  data: {
    url: context.url,
    /**
     * data contextUrl description
     */
    contextUrl: context.url,
    /**
     * data contextNumber description
     */
    contextNumber: 12
  },
  template: `<slot>The visited URL is: {{ url }}</slot>`
})
```

**Annotate slots defined in Render Functions**

To annotate slots defined in Render Functions, attach the keyword `@slot` to the
component definition:

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

**Annotate dynamic slots defined in template**

You can also use the keyword `@slot` to define dynamic slots in template:

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

**Working with Mixins**

Since Vuedoc Parser does not perform I/O operations, it completely ignores
the `mixins` property.

To parse mixins, you need to parse the mixin file as a standalone component and
then merge the parsing result with the result of the initial component:

```js
const _ = require('lodash')
const vuedoc = require('@vuedoc/parser')

const parsers = [
  vuedoc.parse({ filename: 'mixinFile.js' })
  vuedoc.parse({ filename: 'componentUsingMixin.vue' })
]

Promise.all(parsers)
  .then(([ mixinResult, componentResult ]) => _.merge(mixinResult, componentResult))
  .catch((err) => console.error(err))
```

## Vuedoc Parser v2.0.0-beta.4

This release adds many features and bug fixes.

**New features**
- Add support of Class Components (66d16469)
- Add support of the model field (f2bbf203)
- Add support of the inheritAttrs field (b89f24a5, 87576ced)
- Add support of Inline Template (a5b81fd8)

**Bug fixes**
- Parse prop type as native type by default (8748c498)
- Fix duplicate computed properties dependencies (17db2cab)
- Fix parsing of events on callee functions (f9ee7141)
- Fix parsing of nested slots (8d6c0066)

**Documentation**
- Improve interfaces section by using interface & extends (461dc87a)
- Update TypeScript loader example (e5bf1ab9)

  To get a better Class Component parsing, make sure you set
  `compilerOptions.target` to `ts.ModuleKind.ESNext`:

  ```js
  const ts = require('typescript')
  const vuedoc, { Loader } = require('@vuedoc/parser')

  class TypeScriptLoader extends Loader {
    load (source) {
      const options = {
        compilerOptions: {
          target: ts.ModuleKind.ESNext,
          module: ts.ModuleKind.ESNext
        }
      }

      const { outputText } = ts.transpileModule(source, options)

      // don't forget the return here
      return this.emitScript(outputText)
    }
  }
  ```

## Vuedoc Parser v2.0.0-beta.3

This release adds the ability to use specific language for template of script
with Vuedoc Parser. This is possible with a new API: the Loader API.

Now you can use a component with TypeScript:

```html
<script lang="ts">
  import Vue, { VueConstructor } from 'vue'
  import { Prop } from 'vue/types/options'

  /**
   * Custom component
   */
  export default Vue.extend({
    props: {
      /**
       * @model
       */
      value: {
        type: Object as Prop<Array<string>>,
        required: true
      }
    },
    computed: {
      currentYear (): number {
        return new Date().getFullYear()
      }
    }
  })
</script>
```

### Create loader

**Public Loader API**

```js
abstract class Loader {
  public static extend(loaderName: string, loaderClass: Loader);
  public abstract load(source: string): Promise<void>;
  public pipe(loaderName: string, source: string): Promise<void>;
  public emitTemplate(source: string): Promise<void>;
  public emitScript(source: string): Promise<void>;
  public emitErrors(errors: Array<string>): Promise<void>;
}
```

**TypeScript Sample**

To use Vuedoc Parser with TypeScript, install `typescript` and `@types/node`
dependencies according the [official documentation](https://github.com/Microsoft/TypeScript/wiki/Using-the-Compiler-API)

```js
const ts = require('typescript')
const vuedoc, { Loader } = require('@vuedoc/parser')

class TypeScriptLoader extends Loader {
  load (source) {
    const { outputText } = ts.transpileModule(source, {
      compilerOptions: { module: ts.ModuleKind.CommonJS }
    })

    return this.emitScript(outputText)
  }
}

const options = {
  filename: 'DatePicker.ts',
  loaders: [
    /**
     * Register TypeScriptLoader
     * Note that the name of the loader is either
     * the extension of the file or the value of the attribute `lang`
     */
    Loader.extend('ts', TypeScriptLoader)
  ]
}

vuedoc.parse(options).then((component) => {
  // console.log(component)
})
```

## Vuedoc Parser v2.0.0-beta-1

This first beta of the major v2.0.0 upgrades de NodeJS engine to v8 and adds a
fully ECMAScript support with breaking changes, enhancements and bug fixes.

### Changes

**Breaking changes**
- Drop NodeJS 6. Now use NodeJS 8 engine (702fdfc1)

**New features**
- Add support of scoped slots (ed4ddb69)

**Enhancement**
- Preserve white spaces on comments parsing (65190e72)
- Add a Vue Syntax Validation step (79ec36f7)

**Parsing improvement**
- Use [acorn](https://www.npmjs.com/package/acorn) for parsing (f356c669,
  MR !40)
- ECMAScript Features Parsing (02f69660)
- Support of stage 3 proposals (574cf7f0)
- BigInt support (9c9358d0)

**Bug fixes**
- Fix comment parsing when containing @ char #30 (d87f7c07)
- Fix bad format when using code block in comment #29 (65190e72)
- Fix parsing of `import()` with lazy syntax #32

### New parsing interfaces

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

## Vuedoc Parser v1.4.0

This release adds a feature to preserve white spaces on comments parsing

## Vuedoc Parser v1.3.2

This release adds a fix about parsing of undefined default value #27

## Vuedoc Parser v1.3.1

There are no changes, this release is just to update NPM metadata after a moved from GitHub.

## Vuedoc Parser v1.1.0

The `vuedoc/parser` is now able to parse a JS file component. This enhancement
closes the #21

```js
const parser = require('@vuedoc/parser')

const options = {
  filename: 'components/checkbox.js'
}

parser.parse(options).then((component) => {
  console.log(component)
})
```

## Vuedoc Parser v1.0.2

- Add support of Spread Operator #7
- Fix unCamelcase parsing of entry with numbers #15
- Fix filtering of ignoredVisibilities #18

## Vuedoc Parser v1.0.1

This release just improves the documentation with more samples

## Vuedoc Parser v1.0.0

This major release add a new feature and uses the NodeJS v6.11.2 as default
engine.

### New option: `options.features`

The new `options.features` lets you select which Vue Features you want to parse
and extract.
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
  .then((component) => console.log(component)) // => { name, props, computed, events }
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
  .then((component) => console.log(component)) // => { name, description, keywords, props, computed, events, methods }
  .catch((err) => console.error(err))
```

### Bug fix
There was a bug when the given component file didn't have a script entry. In
this case, the parser was not able to emit the `end` event. This is now fixed.

### NodeJS v6.11.2
Now `@vuedoc/parser` requires the `v6.11.2` (or higher) of NodeJS.

## Vuedoc Parser v0.6.2

This release add the support of
[Computed Getters](https://vuejs.org/v2/guide/computed.html#Computed-Setter)

## Vuedoc Parser v0.6.0

* Add support of `component.data` parsing
* Add support of computed properties #6
* Add a features section and update the documentation

## Vuedoc Parser v0.5.0

This new release introduces **Keywords Extraction Feature**. This enable to attach keywords to a comment and then extract them using the parser.

Decoration:
```js
/**
 * Component description
 *
 * @author Sébastien
 * @license MIT
 */
export default {
  name: 'my-checkbox',
  created () {
    /**
     * @param boolean
     */
    this.$emit('created', true)
  }
}
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
  ],
  "props": [],
  "methods": [],
  "events": [
    {
      "name": "created",
      "description": "",
      "visibility": "public",
      "keywords": [
        {
          "name": "param",
          "description": "boolean"
        }
      ]
    }
  ],
  "slots": []
}
```
This release also fixes some issues:
* Fix missing component name parsing with only template parsing
* Fix missing defaultMethodVisibility option on getComment call
* Fix issue on unCamelcase with a string containing `-`
* Enable parsing of component with just <template/> as entry
