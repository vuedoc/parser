const { ComponentTestCase } = require('./lib/TestUtils')

/* global describe */

describe('ScriptParser', () => {
  ComponentTestCase({
    name: 'Accorn parsing error',
    options: {
      filecontent: `
        <script>
          var != mù*! invalid syntax
        </script>
      `
    },
    expected: {
      errors: [
        'Unexpected token (2:4)'
      ]
    }
  })

  ComponentTestCase({
    name: 'parseComment() with disbaled description',
    options: {
      features: [ 'keywords' ],
      filecontent: `
        <script>
          /**
           * Disabled description
           */
          export default {}
        </script>
      `
    },
    expected: {
      description: undefined,
      keywords: [],
      errors: []
    }
  })

  ComponentTestCase({
    name: 'parseComment() with disabled keywords',
    options: {
      features: [ 'description' ],
      filecontent: `
        <script>
          /**
           * Component description
           */
          export default {}
        </script>
      `
    },
    expected: {
      description: 'Component description',
      keywords: undefined,
      errors: []
    }
  })
})
