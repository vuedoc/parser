import { describe, expect, it } from 'vitest';

describe('ScriptParser', () => {
  it('dynamic import() function: should successfully parse code with the reserved import keyword', async () => {
    const options = {
      filecontent: `
        <script>
          export default {
            components: {
              Lazy: import('./components/Lazy.vue')
            }
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      inheritAttrs: true,
      keywords: [],
      errors: [],
      slots: [],
      props: [],
      data: [],
      computed: [],
      events: [],
      methods: [],
    });
  });

  it('Syntax: exports["default"]', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      description: 'description',
      inheritAttrs: true,
      events: [],
      errors: [],
      keywords: [],
      methods: [],
      computed: [
        {
          kind: 'computed',
          name: 'pages',
          type: 'unknown',
          dependencies: [
            'links',
            'site',
          ],
          keywords: [],
          visibility: 'public',
        },
      ],
      data: [
        {
          kind: 'data',
          name: 'currentYear',
          type: 'unknown',
          initialValue: 'new Date().getFullYear()',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [
        {
          kind: 'prop',
          name: 'links',
          type: 'object',
          required: true,
          describeModel: false,
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'prop',
          name: 'site',
          type: 'Site_1.Site',
          required: true,
          describeModel: false,
          keywords: [],
          visibility: 'public',
        },
      ],
      slots: [],
    });
  });

  it('Syntax: module.exports', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      description: 'description',
      inheritAttrs: true,
      events: [],
      errors: [],
      keywords: [],
      methods: [],
      computed: [
        {
          kind: 'computed',
          name: 'pages',
          type: 'unknown',
          dependencies: [
            'links',
            'site',
          ],
          keywords: [],
          visibility: 'public',
        },
      ],
      data: [
        {
          kind: 'data',
          name: 'currentYear',
          type: 'unknown',
          initialValue: 'new Date().getFullYear()',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [
        {
          kind: 'prop',
          name: 'links',
          type: 'object',
          required: true,
          describeModel: false,
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'prop',
          name: 'site',
          type: 'Site_1.Site',
          required: true,
          describeModel: false,
          keywords: [],
          visibility: 'public',
        },
      ],
      slots: [],
    });
  });

  it('Parsing error', async () => {
    const options = {
      filecontent: `
        <script>
          var !*/= mù*! invalid syntax
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [
        'Unexpected token (2:14)',
      ],
    });
  });

  it('parseComment() with disbaled description', async () => {
    const options = {
      features: [
        'name',
      ],
      filecontent: `
        <script>
          /**
           * Disabled description
           * @name InputText
           */
          export default {}
        </script>
      `,
    };

    await expect(options).toParseAs({
      name: 'InputText',
      keywords: [],
      errors: [],
    });
  });

  it('parseComment() with disabled name', async () => {
    const options = {
      features: [
        'description',
      ],
      filecontent: `
        <script>
          /**
           * Component description
           * @name InputText
           */
          export default {}
        </script>
      `,
    };

    await expect(options).toParseAs({
      description: 'Component description',
      keywords: [],
      errors: [],
    });
  });

  it('Handle keyword @name prior than the component name', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      name: 'my-checkbox',
    });
  });

  it('with undefined references', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      name: '',
      props: [
        {
          kind: 'prop',
          name: 'some-prop-call',
          type: 'unknown',
          visibility: 'public',
          keywords: [],
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          name: 'some-prop-ref',
          type: 'CallsSomeOtherMethod',
          visibility: 'public',
          keywords: [],
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
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
          },
        },
        {
          kind: 'method',
          syntax: [
            'someMethodRef(): unknown',
          ],
          name: 'someMethodRef',
          visibility: 'public',
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
          },
        },
      ],
    });
  });

  it('empty options.resolver.alias', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
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
          keywords: [],
          required: false,
          describeModel: false,
        },
      ],
      methods: [],
    });
  });

  it('non empty options.resolver.alias', async () => {
    const options = {
      resolver: {
        alias: {
          '@/': '/home/demsking/Workspace/projects/vuedoc-parser/test/fixtures',
          './myMixin': '/home/demsking/Workspace/projects/vuedoc-parser/test/fixtures/myMixin.js',
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
    };

    await expect(options).toParseAs({
      name: 'MyComponentName',
      warnings: [],
      errors: [],
      props: [
        {
          kind: 'prop',
          name: 'some-prop-ref',
          type: 'CallsSomeOtherMethod',
          visibility: 'public',
          keywords: [],
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          name: 'some-prop-call',
          type: 'unknown',
          visibility: 'public',
          keywords: [],
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
          keywords: [],
          params: [],
          returns: {
            type: 'void',
          },
        },
      ],
    });
  });

  it('Mixin exported as default', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      methods: [
        {
          kind: 'method',
          syntax: [
            'route(): unknown',
          ],
          name: 'route',
          visibility: 'public',
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
          },
        },
      ],
    });
  });

  it('mixins defined on the same file', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      keywords: [],
      props: [
        {
          kind: 'prop',
          name: 'some-prop-ref',
          type: 'CallsSomeOtherMethod',
          visibility: 'public',
          keywords: [],
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          name: 'some-prop-call',
          type: 'unknown',
          visibility: 'public',
          keywords: [],
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
          keywords: [],
          params: [],
          returns: {
            type: 'void',
          },
        },
      ],
    });
  });

  it('mixins defined on an external file', async () => {
    const options = {
      resolver: {
        basedir: '/home/demsking/Workspace/projects/vuedoc-parser/test/fixtures',
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
    };

    await expect(options).toParseAs({
      name: 'MyComponentName',
      warnings: [],
      errors: [],
      props: [
        {
          kind: 'prop',
          name: 'some-prop-ref',
          type: 'CallsSomeOtherMethod',
          visibility: 'public',
          keywords: [],
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          name: 'some-prop-call',
          type: 'unknown',
          visibility: 'public',
          keywords: [],
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
          keywords: [],
          params: [],
          returns: {
            type: 'void',
          },
        },
      ],
    });
  });

  it('mixins defined on an external SFC file', async () => {
    const options = {
      resolver: {
        basedir: '/home/demsking/Workspace/projects/vuedoc-parser/test/fixtures',
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
    };

    await expect(options).toParseAs({
      name: 'MyComponentName',
      warnings: [],
      errors: [],
      props: [
        {
          kind: 'prop',
          name: 'name',
          type: 'string',
          visibility: 'public',
          keywords: [],
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          name: 'some-prop-call',
          type: 'unknown',
          visibility: 'public',
          keywords: [],
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
          keywords: [],
          params: [],
          returns: {
            type: 'void',
          },
        },
      ],
    });
  });

  it('mixins defined on an external SFC file which containing errors', async () => {
    const options = {
      resolver: {
        basedir: '/home/demsking/Workspace/projects/vuedoc-parser/test/fixtures',
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
    };

    await expect(options).toParseAs({
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
          keywords: [],
          required: false,
          describeModel: false,
        },
      ],
      methods: [],
    });
  });

  it('@mixin: Mixin exported with custom name', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      keywords: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'route(): unknown',
          ],
          name: 'route',
          visibility: 'public',
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
          },
        },
      ],
    });
  });

  it('@mixin: Mixin exported as object', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      keywords: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'route(): unknown',
          ],
          name: 'route',
          visibility: 'public',
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
          },
        },
      ],
    });
  });

  it('@mixin: Mixin exported as factory function', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      keywords: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'route(): unknown',
          ],
          name: 'route',
          visibility: 'public',
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
          },
        },
      ],
    });
  });

  it('@mixin: Mixin exported as default factory function with arguments and Vue.extend', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      keywords: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'myFunction(): unknown',
          ],
          name: 'myFunction',
          visibility: 'public',
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
          },
        },
      ],
    });
  });

  it('@mixin: Mixin exported as default factory function with arguments and TypeScript', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      keywords: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'myFunction(test: Record<string, any>): Record<string, any>',
          ],
          name: 'myFunction',
          visibility: 'protected',
          description: 'Testing',
          keywords: [],
          params: [
            {
              name: 'test',
              type: 'Record<string, any>',
              description: '<-- Parser stops with error',
              rest: false,
            },
          ],
          returns: {
            type: 'Record<string, any>',
            description: '<-- Gets parsed as description',
          },
        },
      ],
    });
  });

  it('@mixin: Mixin exported as factory function with arguments and Vue.extend (es6', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      keywords: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'myFunction(): unknown',
          ],
          name: 'myFunction',
          visibility: 'public',
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
          },
        },
      ],
    });
  });

  it('@mixin: Mixin exported as factory function with arguments and Vue.extend', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      keywords: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'myFunction(): unknown',
          ],
          name: 'myFunction',
          visibility: 'public',
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
          },
        },
      ],
    });
  });

  it('@mixin: Mixin exported as factory function with arguments and referenced Vue.extend', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      keywords: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'myFunction(): unknown',
          ],
          name: 'myFunction',
          visibility: 'public',
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
          },
        },
      ],
    });
  });

  it('@mixin: Mixin exported as factory function and @name', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      name: 'InputMixin',
      errors: [],
      keywords: [],
      props: [
        {
          kind: 'prop',
          name: 'id',
          type: 'string',
          visibility: 'public',
          keywords: [],
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          name: 'v-model',
          type: [
            'boolean',
            'number',
            'string',
          ],
          visibility: 'public',
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
          keywords: [],
          visibility: 'public',
          params: [],
          returns: {
            type: 'unknown',
          },
        },
      ],
    });
  });

  it('@mixin: Mixin exported as factory arrow function with arguments and referenced Vue.extend', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      name: 'InputMixin',
      errors: [],
      keywords: [],
      props: [
        {
          kind: 'prop',
          name: 'id',
          type: 'string',
          visibility: 'public',
          keywords: [],
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          name: 'v-model',
          type: [
            'boolean',
            'number',
            'string',
          ],
          visibility: 'public',
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
          keywords: [],
          visibility: 'public',
          params: [],
          returns: {
            type: 'unknown',
          },
        },
      ],
    });
  });

  it('@mixin: Mixin exported as factory function with arguments and ObjectExpression', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      keywords: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'myFunction(): unknown',
          ],
          name: 'myFunction',
          visibility: 'public',
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
          },
        },
      ],
    });
  });

  it('@mixin: Mixin exported as factory function with arguments and referenced ObjectExpression', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      keywords: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'myFunction(): unknown',
          ],
          name: 'myFunction',
          visibility: 'public',
          keywords: [],
          params: [],
          returns: {
            type: 'unknown',
          },
        },
      ],
    });
  });
});
