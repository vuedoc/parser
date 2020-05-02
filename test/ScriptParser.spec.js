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

  ComponentTestCase({
    name: 'Handle keyword @name prior than the component name',
    options: {
      filecontent: `
        <script>
          /**
           * @name my-checkbox
           */
          export default {
            name: MethodThatIsHandledAsUndefined()
          }
        </script>
      `
    },
    expected: {
      name: 'my-checkbox'
    }
  })

  ComponentTestCase({
    name: 'with undefined references',
    options: {
      filecontent: `
        <script>
          export default {
            name: MethodThatIsHandledAsUndefined(),
            props: {
              somePropCall: MethodThanReturnAString(),
              somePropRef: CallsSomeOtherMethod,
            },
            methods: {
              someMethodCall: MethodThatReturnAFunction(),
              someMethodRef: CallsSomeOtherMethod
            }
          }
        </script>
      `
    },
    expected: {
      name: '__undefined__',
      props: [
        {
          kind: 'prop',
          name: 'some-prop-call',
          type: '__undefined__',
          visibility: 'public',
          description: null,
          keywords: [],
          default: '__undefined__',
          nativeType: '__undefined__',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          name: 'some-prop-ref',
          type: 'CallsSomeOtherMethod',
          visibility: 'public',
          description: null,
          keywords: [],
          default: '__undefined__',
          nativeType: '__undefined__',
          required: false,
          describeModel: false
        }
      ],
      methods: [
        {
          kind: 'method',
          name: 'someMethodCall',
          visibility: 'public',
          description: null,
          keywords: [],
          params: [],
          return: {
            type: 'void',
            description: null
          }
        },
        {
          kind: 'method',
          name: 'someMethodRef',
          visibility: 'public',
          description: null,
          keywords: [],
          params: [],
          return: {
            type: 'void',
            description: null
          }
        }
      ]
    }
  })
})
