import { describe } from 'vitest';
import { ComponentTestCase } from '../../src/test/utils.ts';
import { join } from 'path';

describe('ScriptParser', () => {
  ComponentTestCase({
    name: 'dynamic import() function',
    description: 'should successfully parse code with the reserved import keyword',
    options: {
      filecontent: `
        <script>
          export default {
            components: {
              Lazy: import('./components/Lazy.vue')
            }
          }
        </script>
      `,
    },
    expected: {
      name: undefined,
      description: undefined,
      inheritAttrs: true,
      keywords: [],
      errors: [],
      slots: [],
      props: [],
      data: [],
      computed: [],
      events: [],
      methods: [],
    },
  });

  ComponentTestCase({
    name: 'Syntax',
    description: 'exports["default"]',
    options: {
      filecontent: `
        <script>
          exports.__esModule = true;
          var vue_1 = require("vue");
          var Site_1 = require("@/designer/models/Site");

          /**
           * description
           */
          exports["default"] = vue_1["default"].extend({
              props: {
                  links: {
                      type: Object,
                      required: true
                  },
                  site: {
                      type: Site_1.Site,
                      required: true
                  }
              },
              data: function () { return ({
                  currentYear: new Date().getFullYear()
              }); },
              computed: {
                  pages: function () {
                      var _this = this;
                      return this.links.map(function (pageId) {
                          return _this.site.getPage(pageId);
                      });
                  }
              }
          });
        </script>
      `,
    },
    expected: {
      name: undefined,
      description: 'description',
      inheritAttrs: true,
      events: [],
      errors: [],
      keywords: [],
      methods: [],
      computed: [{
        kind: 'computed',
        name: 'pages',
        type: 'unknown',
        dependencies: ['links', 'site'],
        category: undefined,
        version: undefined,
        description: undefined,
        keywords: [],
        visibility: 'public',
      }],
      data: [{
        kind: 'data',
        name: 'currentYear',
        type: 'unknown',
        category: undefined,
        version: undefined,
        description: undefined,
        initialValue: 'new Date().getFullYear()',
        keywords: [],
        visibility: 'public',
      }],
      props: [{
        kind: 'prop',
        name: 'links',
        type: 'object',
        required: true,
        default: undefined,
        describeModel: false,
        category: undefined,
        version: undefined,
        description: undefined,
        keywords: [],
        visibility: 'public',
      }, {
        kind: 'prop',
        name: 'site',
        type: 'Site_1.Site',
        required: true,
        default: undefined,
        describeModel: false,
        category: undefined,
        version: undefined,
        description: undefined,
        keywords: [],
        visibility: 'public',
      }],
      slots: [],
    },
  });

  ComponentTestCase({
    name: 'Syntax',
    description: 'module.exports',
    options: {
      filecontent: `
        <script>
          exports.__esModule = true;
          var vue_1 = require("vue");
          var Site_1 = require("@/designer/models/Site");

          /**
           * description
           */
          module.exports = vue_1["default"].extend({
              props: {
                  links: {
                      type: Object,
                      required: true
                  },
                  site: {
                      type: Site_1.Site,
                      required: true
                  }
              },
              data: function () { return ({
                  currentYear: new Date().getFullYear()
              }); },
              computed: {
                  pages: function () {
                      var _this = this;
                      return this.links.map(function (pageId) {
                          return _this.site.getPage(pageId);
                      });
                  }
              }
          });
        </script>
      `,
    },
    expected: {
      name: undefined,
      description: 'description',
      inheritAttrs: true,
      events: [],
      errors: [],
      keywords: [],
      methods: [],
      computed: [{
        kind: 'computed',
        name: 'pages',
        type: 'unknown',
        dependencies: ['links', 'site'],
        category: undefined,
        version: undefined,
        description: undefined,
        keywords: [],
        visibility: 'public',
      }],
      data: [{
        kind: 'data',
        name: 'currentYear',
        type: 'unknown',
        category: undefined,
        version: undefined,
        description: undefined,
        initialValue: 'new Date().getFullYear()',
        keywords: [],
        visibility: 'public',
      }],
      props: [
        {
          kind: 'prop',
          name: 'links',
          type: 'object',
          required: true,
          default: undefined,
          describeModel: false,
          category: undefined,
          version: undefined,
          description: undefined,
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'prop',
          name: 'site',
          type: 'Site_1.Site',
          required: true,
          default: undefined,
          describeModel: false,
          category: undefined,
          version: undefined,
          description: undefined,
          keywords: [],
          visibility: 'public',
        },
      ],
      slots: [],
    },
  });

  ComponentTestCase({
    name: 'Parsing error',
    // only: true,
    options: {
      filecontent: `
        <script>
          var !*/= mù*! invalid syntax
        </script>
      `,
    },
    expected: {
      errors: [
        'Unexpected token (2:14)',
      ],
    },
  });

  ComponentTestCase({
    name: 'parseComment() with disbaled description',
    options: {
      features: ['name'],
      filecontent: `
        <script>
          /**
           * Disabled description
           * @name InputText
           */
          export default {}
        </script>
      `,
    },
    expected: {
      name: 'InputText',
      description: undefined,
      keywords: [],
      errors: [],
    },
  });

  ComponentTestCase({
    name: 'parseComment() with disabled name',
    options: {
      features: ['description'],
      filecontent: `
        <script>
          /**
           * Component description
           * @name InputText
           */
          export default {}
        </script>
      `,
    },
    expected: {
      name: undefined,
      description: 'Component description',
      keywords: [],
      errors: [],
    },
  });

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
      `,
    },
    expected: {
      name: 'my-checkbox',
    },
  });

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
      `,
    },
    expected: {
      name: '',
      props: [
        {
          kind: 'prop',
          name: 'some-prop-call',
          type: 'unknown',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          default: undefined,
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          name: 'some-prop-ref',
          type: 'CallsSomeOtherMethod',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          default: undefined,
          required: false,
          describeModel: false,
        },
      ],
      methods: [
        {
          kind: 'method',
          syntax: [
            'someMethodCall(): unknown',
          ],
          name: 'someMethodCall',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
            description: undefined,
          },
        },
        {
          kind: 'method',
          syntax: [
            'someMethodRef(): unknown',
          ],
          name: 'someMethodRef',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: 'empty options.resolver.alias',
    // only: true,
    options: {
      resolver: {
        alias: {},
      },
      filecontent: `
        <script>
          import Vue from 'vue'
          import componentName from './myMixin';   
          import { myMixin as myMixin2 } from '@/myMixin';
          
          // define a component that uses this mixin
          export default Vue.extend({
            name: componentName,
            mixins: [myMixin2],
            props: {
              somePropCall: MethodThanReturnAString(),
            },
          })
        </script>
      `,
    },
    expected: {
      name: '',
      errors: [
        "Cannot find module '@/myMixin'. Make sure to define options.resolver",
        "Cannot find module './myMixin'. Make sure to define options.resolver",
      ],
      warnings: [],
      props: [
        {
          kind: 'prop',
          name: 'some-prop-call',
          type: 'unknown',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          default: undefined,
          required: false,
          describeModel: false,
        },
      ],
      methods: [],
    },
  });

  ComponentTestCase({
    name: 'non empty options.resolver.alias',
    options: {
      resolver: {
        alias: {
          '@/': join(__dirname, '../fixtures'),
          './myMixin': join(__dirname, '../fixtures/myMixin.js'),
        },
      },
      filecontent: `
        <script>
          import Vue from 'vue'
          import componentName from './myMixin';   
          import { myMixin as myMixin2 } from '@/myMixin';
          
          // define a component that uses this mixin
          export default Vue.extend({
            name: componentName,
            mixins: [myMixin2],
            props: {
              somePropCall: MethodThanReturnAString(),
            },
          })
        </script>
      `,
    },
    expected: {
      name: 'MyComponentName',
      warnings: [],
      errors: [],
      props: [
        {
          kind: 'prop',
          name: 'some-prop-ref',
          type: 'CallsSomeOtherMethod',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          default: undefined,
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          name: 'some-prop-call',
          type: 'unknown',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          default: undefined,
          required: false,
          describeModel: false,
        },
      ],
      methods: [
        {
          kind: 'method',
          syntax: [
            'hello(): void',
          ],
          name: 'hello',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [],
          returns: {
            type: 'void',
            description: undefined,
          },
        },
      ],
    },
  });

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
      `,
    },
    expected: {
      methods: [
        {
          kind: 'method',
          syntax: [
            'route(): unknown',
          ],
          name: 'route',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: 'mixins defined on the same file',
    // only: true,
    options: {
      filecontent: `
        <script>
          import Vue     from 'vue'
          
          var myMixin = {
            props: {
              somePropRef: CallsSomeOtherMethod,
            },
            created: function () {
              this.hello()
            },
            methods: {
              hello: function () {
                console.log('hello from mixin!')
              }
            }
          }
          
          // define a component that uses this mixin
          export default Vue.extend({
            mixins: [myMixin],
            props: {
              somePropCall: MethodThanReturnAString(),
            },
          })
        </script>
      `,
    },
    expected: {
      keywords: [],
      props: [
        {
          kind: 'prop',
          name: 'some-prop-ref',
          type: 'CallsSomeOtherMethod',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          default: undefined,
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          name: 'some-prop-call',
          type: 'unknown',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          default: undefined,
          required: false,
          describeModel: false,
        },
      ],
      methods: [
        {
          kind: 'method',
          syntax: [
            'hello(): void',
          ],
          name: 'hello',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [],
          returns: {
            type: 'void',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: 'mixins defined on an external file',
    options: {
      resolver: {
        basedir: join(__dirname, '../fixtures'),
      },
      filecontent: `
        <script>
          import Vue from 'vue'
          import componentName, { myMixin } from './myMixin';       
          
          // define a component that uses this mixin
          export default Vue.extend({
            name: componentName,
            mixins: [myMixin],
            props: {
              somePropCall: MethodThanReturnAString(),
            },
          })
        </script>
      `,
    },
    expected: {
      name: 'MyComponentName',
      warnings: [],
      errors: [],
      props: [
        {
          kind: 'prop',
          name: 'some-prop-ref',
          type: 'CallsSomeOtherMethod',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          default: undefined,
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          name: 'some-prop-call',
          type: 'unknown',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          default: undefined,
          required: false,
          describeModel: false,
        },
      ],
      methods: [
        {
          kind: 'method',
          syntax: [
            'hello(): void',
          ],
          name: 'hello',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [],
          returns: {
            type: 'void',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: 'mixins defined on an external SFC file',
    // only: true,
    options: {
      resolver: {
        basedir: join(__dirname, '../fixtures'),
      },
      filecontent: `
        <script>
          import Vue from 'vue'
          import componentName, { myMixin } from './myMixinComponent.vue';       
          
          // define a component that uses this mixin
          export default Vue.extend({
            name: componentName,
            mixins: [myMixin],
            props: {
              somePropCall: MethodThanReturnAString(),
            },
          })
        </script>
      `,
    },
    expected: {
      name: 'MyComponentName',
      warnings: [],
      errors: [],
      props: [
        {
          kind: 'prop',
          name: 'name',
          type: 'string',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          default: undefined,
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          name: 'some-prop-call',
          type: 'unknown',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          default: undefined,
          required: false,
          describeModel: false,
        },
      ],
      methods: [
        {
          kind: 'method',
          syntax: [
            'hello(): void',
          ],
          name: 'hello',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [],
          returns: {
            type: 'void',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: 'mixins defined on an external SFC file which containing errors',
    options: {
      resolver: {
        basedir: join(__dirname, '../fixtures'),
      },
      filecontent: `
        <script>
          import Vue from 'vue'
          import componentName, { myMixin } from './myMixinComponentError.vue';       
          
          // define a component that uses this mixin
          export default Vue.extend({
            name: componentName,
            mixins: [myMixin],
            props: {
              somePropCall: MethodThanReturnAString(),
            },
          })
        </script>
      `,
    },
    expected: {
      name: '',
      warnings: [],
      errors: [
        "Mal-formatted tag at end of template: \"\n  export const myMixin = {};\n  export default 'MyComponentName';\n\n\n<template>\n  <p>Hello {{name}}!</p>\n</template>\n\"",
      ],
      props: [
        {
          kind: 'prop',
          name: 'some-prop-call',
          type: 'unknown',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          default: undefined,
          required: false,
          describeModel: false,
        },
      ],
      methods: [],
    },
  });

  ComponentTestCase({
    name: '@mixin: Mixin exported with custom name',
    options: {
      filecontent: `
        <script>
          import Vue     from 'vue'
          import {route} from '@pits/plugins/route'

          /**
           * @mixin
           */
          export const RouteMixin = Vue.extend({
            methods: {
              route,
            }
          })
        </script>
      `,
    },
    expected: {
      keywords: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'route(): unknown',
          ],
          name: 'route',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@mixin: Mixin exported as object',
    options: {
      filecontent: `
        <script>
          import {route} from '@pits/plugins/route'

          /**
           * @mixin
           */
          export const RouteMixin = {
            methods: {
              route,
            }
          }
        </script>
      `,
    },
    expected: {
      keywords: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'route(): unknown',
          ],
          name: 'route',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
            description: undefined,
          },
        },
      ],
    },
  });

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
      `,
    },
    expected: {
      keywords: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'route(): unknown',
          ],
          name: 'route',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@mixin: Mixin exported as default factory function with arguments and Vue.extend',
    options: {
      filecontent: `
        <script>
          /**
           * @mixin
           */
          export default function TestMixinFactory(boundValue) {
            return Vue.extend({
              methods: {
                myFunction() {
                  return boundValue
                },
              },
            })
          }
        </script>
      `,
    },
    expected: {
      keywords: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'myFunction(): unknown',
          ],
          name: 'myFunction',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@mixin: Mixin exported as default factory function with arguments and TypeScript',
    options: {
      ignoredVisibilities: [],
      filecontent: `
        <script>
          /**
           * @mixin
           */
          export default function TestMixinFactory(boundValue: Record<string, any>) {
            return Vue.extend({
              methods: {
                /**
                 * Testing
                 *
                 * @param {Record<string, any>} test <-- Parser stops with error
                 * @return {Record<string, any>} <-- Gets parsed as description
                 * @protected
                 */
                myFunction(test: Record<string, any>): Record<string, any> {
                  return boundValue
                },
              },
            })
          }
        </script>
      `,
    },
    expected: {
      keywords: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'myFunction(test: Record<string, any>): Record<string, any>',
          ],
          name: 'myFunction',
          visibility: 'protected',
          category: undefined,
          description: 'Testing',
          keywords: [],
          params: [
            {
              name: 'test',
              type: 'Record<string, any>',
              description: '<-- Parser stops with error',
              defaultValue: undefined,
              rest: false,
            },
          ],
          returns: {
            type: 'Record<string, any>',
            description: '<-- Gets parsed as description',
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@mixin: Mixin exported as factory function with arguments and Vue.extend (es6',
    options: {
      filecontent: `
        <script>
          /**
           * @mixin
           */
          export default (boundValue) => {
            return Vue.extend({
              methods: {
                myFunction() {
                  return boundValue
                },
              },
            })
          }
        </script>
      `,
    },
    expected: {
      keywords: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'myFunction(): unknown',
          ],
          name: 'myFunction',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@mixin: Mixin exported as factory function with arguments and Vue.extend',
    options: {
      filecontent: `
        <script>
          /**
           * @mixin
           */
          export function TestMixinFactory(boundValue) {
            return Vue.extend({
              methods: {
                myFunction() {
                  return boundValue
                },
              },
            })
          }
        </script>
      `,
    },
    expected: {
      keywords: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'myFunction(): unknown',
          ],
          name: 'myFunction',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@mixin: Mixin exported as factory function with arguments and referenced Vue.extend',
    options: {
      filecontent: `
        <script>
          /**
           * @mixin
           */
          export function TestMixinFactory(boundValue) {
            const Component = Vue.extend({
              methods: {
                myFunction() {
                  return boundValue
                },
              },
            })

            return Component
          }
        </script>
      `,
    },
    expected: {
      keywords: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'myFunction(): unknown',
          ],
          name: 'myFunction',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@mixin: Mixin exported as factory function and @name',
    options: {
      filecontent: `
        <script>
          import Vue from 'vue.js';

          /**
           * @mixin
           * @name InputMixin
           */
          export function mixin (route) {
            return Vue.extend({
              props: {
                id: String,
                value: [ Boolean, Number, String ]
              },
              methods: { route }
            })
          }
        </script>
      `,
    },
    expected: {
      name: 'InputMixin',
      errors: [],
      keywords: [],
      props: [
        {
          kind: 'prop',
          name: 'id',
          type: 'string',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          name: 'v-model',
          type: ['boolean', 'number', 'string'],
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          required: false,
          describeModel: true,
        },
      ],
      methods: [
        {
          kind: 'method',
          syntax: [
            'route(): unknown',
          ],
          name: 'route',
          category: undefined,
          description: undefined,
          keywords: [],
          visibility: 'public',
          params: [],
          returns: {
            type: 'unknown',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@mixin: Mixin exported as factory arrow function with arguments and referenced Vue.extend',
    // only: true,
    options: {
      filecontent: `
        <script>
          import Vue from 'vue.js';

          /**
           * @mixin
           * @name InputMixin
           */
          export default (route) => Vue.extend({
            props: {
              id: String,
              value: [ Boolean, Number, String ]
            },
            methods: { route }
          })
        </script>
      `,
    },
    expected: {
      name: 'InputMixin',
      errors: [],
      keywords: [],
      props: [
        {
          kind: 'prop',
          name: 'id',
          type: 'string',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          name: 'v-model',
          type: ['boolean', 'number', 'string'],
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          required: false,
          describeModel: true,
        },
      ],
      methods: [
        {
          kind: 'method',
          syntax: [
            'route(): unknown',
          ],
          name: 'route',
          category: undefined,
          description: undefined,
          keywords: [],
          visibility: 'public',
          params: [],
          returns: {
            type: 'unknown',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@mixin: Mixin exported as factory function with arguments and ObjectExpression',
    options: {
      filecontent: `
        <script>
          /**
           * @mixin
           */
          export function TestMixinFactory(boundValue) {
            return {
              methods: {
                myFunction() {
                  return boundValue
                },
              },
            }
          }
        </script>
      `,
    },
    expected: {
      keywords: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'myFunction(): unknown',
          ],
          name: 'myFunction',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
            description: undefined,
          },
        },
      ],
    },
  });

  ComponentTestCase({
    name: '@mixin: Mixin exported as factory function with arguments and referenced ObjectExpression',
    options: {
      filecontent: `
        <script>
          /**
           * @mixin
           */
          export function TestMixinFactory(boundValue) {
            const Component = {
              methods: {
                myFunction() {
                  return boundValue
                },
              },
            }

            return Component
          }
        </script>
      `,
    },
    expected: {
      keywords: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'myFunction(): unknown',
          ],
          name: 'myFunction',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
            description: undefined,
          },
        },
      ],
    },
  });
});
