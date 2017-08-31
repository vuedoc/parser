# The vuedoc parser
Generate a JSON documentation for a Vue file component

[![Build Status](https://travis-ci.org/vuedoc/parser.svg?branch=master)](https://travis-ci.org/vuedoc/parser)
[![bitHound Dependencies](https://www.bithound.io/github/vuedoc/parser/badges/dependencies.svg)](https://www.bithound.io/github/vuedoc/parser/master/dependencies/npm)

## Install
```sh
npm install --save @vuedoc/parser
```

## Options
- `filename` (*required* unless `filecontent` is passed) The filename to parse
- `filecontent` (*required* unless `filename` is passed) The string to parse
- `encoding` (*optional*) `default: utf8`
- `ignoreName` (*optional*) `default: false` Set `true` to ignore the component name in the result
- `ignoreDescription` (*optional*) `default: false` Set `true` to ignore the component description in the result

## Usage
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
