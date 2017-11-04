# The vuedoc parser
Generate a JSON documentation for a Vue file component

[![Build Status](https://travis-ci.org/vuedoc/parser.svg?branch=master)](https://travis-ci.org/vuedoc/parser) [![Coverage Status](https://coveralls.io/repos/github/vuedoc/parser/badge.svg?branch=master)](https://coveralls.io/github/vuedoc/parser?branch=master)

## Install
```sh
npm install --save @vuedoc/parser
```

## Features
- Extract the component name (from the name field of from the filename)
- Extract the component description
- Keywords Support: You can define your own keywords with the `@` symbol like `@author Sébastien`
- Extract component props
- Extract component data
- Extract computed properties with dependencies
- Extract component events
- Extract component slots
- Extract component methods

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
  "props": [
    {
      "entry": {
        "v-model": {
          "type": "Array",
          "required": true,
          "twoWay": true
        }
      },
      "comments": [
        "The checbox model"
      ]
    },
    {
      "entry": {
        "disabled": "Boolean"
      },
      "comments": [
        "Initial checbox state"
      ]
    },
    {
      "entry": {
        "checked": {
          "type": "Boolean",
          "default": true
        }
      },
      "comments": [
        "Initial checbox value"
      ]
    }
  ],
  "data": [
    {
      "visibility": "public",
      "description": null,
      "keywords": [],
      "value": null,
      "name": "initialValue"
    }
  ],
  "computed": [
    {
      "visibility": "public",
      "description": null,
      "keywords": [],
      "value": [Object],
      "name": "id",
      "dependencies": [
        "initialValue"
      ]
    }
  ],
  "slots": [
    {
      "name": "label",
      "comments": [
        "Use this slot to set the checkbox label"
      ]
    }
  ],
  "events": [
    {
      "name": "loaded",
      "comments": [
        "Emited when the component has been loaded"
      ]
    }
  ],
  "methods": [
    {
      "entry": {
        "check": {
          "type": "FunctionExpression"
        }
      },
      "comments": [
        "Check the checbox"
      ]
    }
  ]
}
```

## Keywords Extraction
You can attach keywords to a comment and then extract them using the parser.

**Usage**

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
     * Emit on Vue `created` hook
     *
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
  "events": [
    {
      "name": "created",
      "description": "Emit on Vue `created` hook",
      "visibility": "public",
      "keywords": [
        {
          "name": "param",
          "description": "boolean"
        }
      ]
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

## Related projects
- [@vuedoc/md](https://github.com/vuedoc/md) - A Markdown Documentation Generator for Vue File Components

## License

Under the MIT license. See [LICENSE](https://github.com/vuedoc/parser/blob/master/LICENSE) file for more details.
