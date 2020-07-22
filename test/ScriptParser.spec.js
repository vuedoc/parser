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
      name: undefined,
      props: [
        {
          kind: 'prop',
          name: 'some-prop-call',
          type: 'any',
          visibility: 'public',
          description: '',
          keywords: [],
          default: undefined,
          nativeType: 'any',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          name: 'some-prop-ref',
          type: 'CallsSomeOtherMethod',
          visibility: 'public',
          description: '',
          keywords: [],
          default: undefined,
          nativeType: 'any',
          required: false,
          describeModel: false
        }
      ],
      methods: [
        {
          kind: 'method',
          name: 'someMethodCall',
          visibility: 'public',
          description: '',
          keywords: [],
          params: [],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          name: 'someMethodRef',
          visibility: 'public',
          description: '',
          keywords: [],
          params: [],
          return: {
            type: 'void',
            description: ''
          }
        }
      ]
    }
  })

  ComponentTestCase({
    name: 'Mixin exported as default',
    options: {
      filecontent: `
        <script>
          import Vue     from 'vue'
          import {route} from '@pits/plugins/route'

          export const RouteMixin = Vue.extend({
              methods: {
                  route,
              }
          })

          export default RouteMixin
        </script>
      `
    },
    expected: {
      methods: [
        {
          kind: 'method',
          name: 'route',
          visibility: 'public',
          description: '',
          keywords: [],
          params: [],
          return: {
            type: 'void',
            description: ''
          }
        }
      ]
    }
  })
})
