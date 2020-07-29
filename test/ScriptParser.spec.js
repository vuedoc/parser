const { ComponentTestCase } = require('./lib/TestUtils')

/* global describe */

describe('ScriptParser', () => {
  // ComponentTestCase({
  //   name: 'Accorn parsing error',
  //   options: {
  //     filecontent: `
  //       <script>
  //         var != mù*! invalid syntax
  //       </script>
  //     `
  //   },
  //   expected: {
  //     errors: [
  //       'Unexpected token (2:4)'
  //     ]
  //   }
  // })

  // ComponentTestCase({
  //   name: 'parseComment() with disbaled description',
  //   options: {
  //     features: [ 'keywords' ],
  //     filecontent: `
  //       <script>
  //         /**
  //          * Disabled description
  //          */
  //         export default {}
  //       </script>
  //     `
  //   },
  //   expected: {
  //     description: undefined,
  //     keywords: [],
  //     errors: []
  //   }
  // })

  // ComponentTestCase({
  //   name: 'parseComment() with disabled keywords',
  //   options: {
  //     features: [ 'description' ],
  //     filecontent: `
  //       <script>
  //         /**
  //          * Component description
  //          */
  //         export default {}
  //       </script>
  //     `
  //   },
  //   expected: {
  //     description: 'Component description',
  //     keywords: undefined,
  //     errors: []
  //   }
  // })

  // ComponentTestCase({
  //   name: 'Handle keyword @name prior than the component name',
  //   options: {
  //     filecontent: `
  //       <script>
  //         /**
  //          * @name my-checkbox
  //          */
  //         export default {
  //           name: MethodThatIsHandledAsUndefined()
  //         }
  //       </script>
  //     `
  //   },
  //   expected: {
  //     name: 'my-checkbox'
  //   }
  // })

  // ComponentTestCase({
  //   name: 'with undefined references',
  //   options: {
  //     filecontent: `
  //       <script>
  //         export default {
  //           name: MethodThatIsHandledAsUndefined(),
  //           props: {
  //             somePropCall: MethodThanReturnAString(),
  //             somePropRef: CallsSomeOtherMethod,
  //           },
  //           methods: {
  //             someMethodCall: MethodThatReturnAFunction(),
  //             someMethodRef: CallsSomeOtherMethod
  //           }
  //         }
  //       </script>
  //     `
  //   },
  //   expected: {
  //     name: undefined,
  //     props: [
  //       {
  //         kind: 'prop',
  //         name: 'some-prop-call',
  //         type: 'any',
  //         visibility: 'public',
  //         description: '',
  //         keywords: [],
  //         default: undefined,
  //         nativeType: 'any',
  //         required: false,
  //         describeModel: false
  //       },
  //       {
  //         kind: 'prop',
  //         name: 'some-prop-ref',
  //         type: 'CallsSomeOtherMethod',
  //         visibility: 'public',
  //         description: '',
  //         keywords: [],
  //         default: undefined,
  //         nativeType: 'any',
  //         required: false,
  //         describeModel: false
  //       }
  //     ],
  //     methods: [
  //       {
  //         kind: 'method',
  //         name: 'someMethodCall',
  //         visibility: 'public',
  //         description: '',
  //         keywords: [],
  //         params: [],
  //         return: {
  //           type: 'void',
  //           description: ''
  //         }
  //       },
  //       {
  //         kind: 'method',
  //         name: 'someMethodRef',
  //         visibility: 'public',
  //         description: '',
  //         keywords: [],
  //         params: [],
  //         return: {
  //           type: 'void',
  //           description: ''
  //         }
  //       }
  //     ]
  //   }
  // })

  // ComponentTestCase({
  //   name: 'Mixin exported as default',
  //   options: {
  //     filecontent: `
  //       <script>
  //         import Vue     from 'vue'
  //         import {route} from '@pits/plugins/route'

  //         export const RouteMixin = Vue.extend({
  //             methods: {
  //                 route,
  //             }
  //         })

  //         export default RouteMixin
  //       </script>
  //     `
  //   },
  //   expected: {
  //     methods: [
  //       {
  //         kind: 'method',
  //         name: 'route',
  //         visibility: 'public',
  //         description: '',
  //         keywords: [],
  //         params: [],
  //         return: {
  //           type: 'void',
  //           description: ''
  //         }
  //       }
  //     ]
  //   }
  // })

  // ComponentTestCase({
  //   name: '@mixin: Mixin exported with custom name',
  //   options: {
  //     filecontent: `
  //       <script>
  //         import Vue     from 'vue'
  //         import {route} from '@pits/plugins/route'

  //         /**
  //          * @mixin
  //          */
  //         export const RouteMixin = Vue.extend({
  //           methods: {
  //             route,
  //           }
  //         })
  //       </script>
  //     `
  //   },
  //   expected: {
  //     keywords: [],
  //     methods: [
  //       {
  //         kind: 'method',
  //         name: 'route',
  //         visibility: 'public',
  //         description: '',
  //         keywords: [],
  //         params: [],
  //         return: {
  //           type: 'void',
  //           description: ''
  //         }
  //       }
  //     ]
  //   }
  // })

  // ComponentTestCase({
  //   name: '@mixin: Mixin exported as object',
  //   options: {
  //     filecontent: `
  //       <script>
  //         import {route} from '@pits/plugins/route'

  //         /**
  //          * @mixin
  //          */
  //         export const RouteMixin = {
  //           methods: {
  //             route,
  //           }
  //         }
  //       </script>
  //     `
  //   },
  //   expected: {
  //     keywords: [],
  //     methods: [
  //       {
  //         kind: 'method',
  //         name: 'route',
  //         visibility: 'public',
  //         description: '',
  //         keywords: [],
  //         params: [],
  //         return: {
  //           type: 'void',
  //           description: ''
  //         }
  //       }
  //     ]
  //   }
  // })

  ComponentTestCase({
    name: '@mixin: Mixin exported as factory function',
    options: {
      filecontent: `
        <script>
          import Vue     from 'vue'
          import {route} from '@pits/plugins/route'

          const RouteMixin = Vue.extend({
            methods: {
              route,
            }
          })

          /**
           * @mixin
           */
          export default () => RouteMixin
        </script>
      `
    },
    expected: {
      keywords: [],
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

  // ComponentTestCase({
  //   name: '@mixin: Mixin exported as default factory function with arguments and Vue.extend',
  //   options: {
  //     filecontent: `
  //       <script>
  //         /**
  //          * @mixin
  //          */
  //         export default function TestMixinFactory(boundValue) {
  //           return Vue.extend({
  //             methods: {
  //               myFunction() {
  //                 return boundValue
  //               },
  //             },
  //           })
  //         }
  //       </script>
  //     `
  //   },
  //   expected: {
  //     keywords: [],
  //     methods: [
  //       {
  //         kind: 'method',
  //         name: 'myFunction',
  //         visibility: 'public',
  //         description: '',
  //         keywords: [],
  //         params: [],
  //         return: {
  //           type: 'void',
  //           description: ''
  //         }
  //       }
  //     ]
  //   }
  // })

  // ComponentTestCase({
  //   name: '@mixin: Mixin exported as default factory function with arguments and TypeScript',
  //   options: {
  //     ignoredVisibilities: [],
  //     filecontent: `
  //       <script>
  //         /**
  //          * @mixin
  //          */
  //         export default function TestMixinFactory(boundValue: Record<string, any>) {
  //           return Vue.extend({
  //             methods: {
  //               /**
  //                * Testing
  //                *
  //                * @param {Record<string, any>} test <-- Parser stops with error
  //                * @return {Record<string, any>} <-- Gets parsed as description
  //                * @protected
  //                */
  //               myFunction(test: Record<string, any>): Record<string, any> {
  //                 return boundValue
  //               },
  //             },
  //           })
  //         }
  //       </script>
  //     `
  //   },
  //   expected: {
  //     keywords: [],
  //     methods: [
  //       {
  //         kind: 'method',
  //         name: 'myFunction',
  //         visibility: 'protected',
  //         description: 'Testing',
  //         keywords: [],
  //         params: [
  //           {
  //             name: 'test',
  //             type: 'Record<string, any>',
  //             description: '<-- Parser stops with error'
  //           }
  //         ],
  //         return: {
  //           type: 'Record<string, any>',
  //           description: '<-- Gets parsed as description'
  //         }
  //       }
  //     ]
  //   }
  // })

  // ComponentTestCase({
  //   name: '@mixin: Mixin exported as factory function with arguments and Vue.extend (es6',
  //   options: {
  //     filecontent: `
  //       <script>
  //         /**
  //          * @mixin
  //          */
  //         export default (boundValue) => {
  //           return Vue.extend({
  //             methods: {
  //               myFunction() {
  //                 return boundValue
  //               },
  //             },
  //           })
  //         }
  //       </script>
  //     `
  //   },
  //   expected: {
  //     keywords: [],
  //     methods: [
  //       {
  //         kind: 'method',
  //         name: 'myFunction',
  //         visibility: 'public',
  //         description: '',
  //         keywords: [],
  //         params: [],
  //         return: {
  //           type: 'void',
  //           description: ''
  //         }
  //       }
  //     ]
  //   }
  // })

  // ComponentTestCase({
  //   name: '@mixin: Mixin exported as factory function with arguments and Vue.extend',
  //   options: {
  //     filecontent: `
  //       <script>
  //         /**
  //          * @mixin
  //          */
  //         export function TestMixinFactory(boundValue) {
  //           return Vue.extend({
  //             methods: {
  //               myFunction() {
  //                 return boundValue
  //               },
  //             },
  //           })
  //         }
  //       </script>
  //     `
  //   },
  //   expected: {
  //     keywords: [],
  //     methods: [
  //       {
  //         kind: 'method',
  //         name: 'myFunction',
  //         visibility: 'public',
  //         description: '',
  //         keywords: [],
  //         params: [],
  //         return: {
  //           type: 'void',
  //           description: ''
  //         }
  //       }
  //     ]
  //   }
  // })

  // ComponentTestCase({
  //   name: '@mixin: Mixin exported as factory function with arguments and referenced Vue.extend',
  //   options: {
  //     filecontent: `
  //       <script>
  //         /**
  //          * @mixin
  //          */
  //         export function TestMixinFactory(boundValue) {
  //           const Component = Vue.extend({
  //             methods: {
  //               myFunction() {
  //                 return boundValue
  //               },
  //             },
  //           })

  //           return Component
  //         }
  //       </script>
  //     `
  //   },
  //   expected: {
  //     keywords: [],
  //     methods: [
  //       {
  //         kind: 'method',
  //         name: 'myFunction',
  //         visibility: 'public',
  //         description: '',
  //         keywords: [],
  //         params: [],
  //         return: {
  //           type: 'void',
  //           description: ''
  //         }
  //       }
  //     ]
  //   }
  // })

  // ComponentTestCase({
  //   name: '@mixin: Mixin exported as factory function with arguments and ObjectExpression',
  //   options: {
  //     filecontent: `
  //       <script>
  //         /**
  //          * @mixin
  //          */
  //         export function TestMixinFactory(boundValue) {
  //           return {
  //             methods: {
  //               myFunction() {
  //                 return boundValue
  //               },
  //             },
  //           }
  //         }
  //       </script>
  //     `
  //   },
  //   expected: {
  //     keywords: [],
  //     methods: [
  //       {
  //         kind: 'method',
  //         name: 'myFunction',
  //         visibility: 'public',
  //         description: '',
  //         keywords: [],
  //         params: [],
  //         return: {
  //           type: 'void',
  //           description: ''
  //         }
  //       }
  //     ]
  //   }
  // })

  // ComponentTestCase({
  //   name: '@mixin: Mixin exported as factory function with arguments and referenced ObjectExpression',
  //   options: {
  //     filecontent: `
  //       <script>
  //         /**
  //          * @mixin
  //          */
  //         export function TestMixinFactory(boundValue) {
  //           const Component = {
  //             methods: {
  //               myFunction() {
  //                 return boundValue
  //               },
  //             },
  //           }

  //           return Component
  //         }
  //       </script>
  //     `
  //   },
  //   expected: {
  //     keywords: [],
  //     methods: [
  //       {
  //         kind: 'method',
  //         name: 'myFunction',
  //         visibility: 'public',
  //         description: '',
  //         keywords: [],
  //         params: [],
  //         return: {
  //           type: 'void',
  //           description: ''
  //         }
  //       }
  //     ]
  //   }
  // })
})
