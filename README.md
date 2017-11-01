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
- `filename` (*required* unless `filecontent` is passed) The filename to parse
- `filecontent` (*required* unless `filename` is passed) The string to parse
- `encoding` (*optional*) `default: utf8`
- `defaultMethodVisibility` (*optional*) `default: 'public'`. Can be set to `'public'`, `'protected'`, or `'private'`.

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

## Related projects
- [@vuedoc/md](https://github.com/vuedoc/md) - A Markdown Documentation Generator for Vue File Components

## License

Under the MIT license. See [LICENSE](https://github.com/vuedoc/parser/blob/master/LICENSE) file for more details.
