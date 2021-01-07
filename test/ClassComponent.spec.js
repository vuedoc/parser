const { ComponentTestCase } = require('./lib/TestUtils');

/* eslint-disable max-len */
/* eslint-disable indent */
/* global describe */

describe('Class Component', () => {
  ComponentTestCase({
    name: '#37 - Class Component',
    options: {
      filecontent: `
        <script>
          import Vue from 'vue';
          import Component from 'vue-class-component';

          /**
           * A class component element
           *
           * @contributor Jon Snow
           */
          @Component({
            inheritAttrs: false,
            props: {
              /**
               * prop name description
               */
              name: String
            }
          })
          class App extends Vue {
            static staticVar = 123;

            static ignoredMethod() {}

            constructor() {
              super(...arguments);

              /**
               * data msg description
               */
              this.msg = 'Hello';

              /**
               * data helloMsg with expression
               */
              this.helloMsg = 'Hello, ' + this.name;

              /**
               * event constructor description
               */
              this.$emit('created')
            }

            // lifecycle hook
            mounted() {
              this.greet();

              /**
               * event mounted description
               */
              this.$emit('mounted')
            }

            /**
             * computed computedMsg description
             */
            get computedMsg() {
              return 'computed ' + this.msg;
            }

            /**
             * computed computedString description
             */
            get computedString() {
              return \`computed \` + this.msg;
            }

            /**
             * computed computedString description
             */
            get computedString2() {
              return 'computed';
            }

            /**
             * computed computedNull description
             */
            get computedNull() {
              return null;
            }

            /**
             * computed computedBool description
             */
            get computedBool() {
              return true;
            }

            /**
             * computed computedArray description
             */
            get computedArray() {
              return [1, 2];
            }

            /**
             * computed computedObject description
             */
            get computedObject() {
              return {};
            }

            /**
             * computed computedNewObject description
             */
            get computedNewObject() {
              return new Array();
            }

            /**
             * computed computedNewObject2 description
             */
            get computedNewObject2() {
              return new hash.val();
            }

            /**
             * computed computedRegExpLiteral description
             */
            get computedRegExpLiteral() {
              return /[a-z]/;
            }

            /**
             * computed computedBigIntLiteral description
             */
            get computedBigIntLiteral() {
              return 100n;
            }

            /**
             * computed computedNumber description
             */
            get computedNumber() {
              return 12;
            }

            /**
             * computed computedNumber description
             */
            get computedNumber1() {
              return !12;
            }

            /**
             * computed computedNumber description
             */
            get computedNumber2() {
              return 12 + this.msg;
            }

            /**
             * computed [Symbol.species] description
             */
            get [Symbol.species]() { return Array; }

            /**
             * computed [Symbol.species] description
             */
            get empty() {}

            public get something(): Array<any> {
              return [];
            }

            /**
             * method greet description
             */
            greet() {
              alert('greeting: ' + this.msg);
            }

            /**
             * method _protectedMethod description
             * @protected
             */
            _protectedMethod() {}

            /**
             * method _ignoredMethod description
             * @private
             */
            _ignoredMethod() {}
          };

          export default App;
        </script>
      `,
      ignoredVisibilities: [ 'private' ]
    },
    expected: {
      name: 'App',
      description: 'A class component element',
      inheritAttrs: false,
      errors: [],
      keywords: [
        {
          name: 'contributor',
          description: 'Jon Snow'
        }
      ],
      events: [
        { kind: 'event',
          name: 'created',
          arguments: [],
          description: 'event constructor description',
          category: undefined,
          version: undefined,
          keywords: [],
          visibility: 'public'
        },
        { kind: 'event',
          name: 'mounted',
          arguments: [],
          description: 'event mounted description',
          category: undefined,
          version: undefined,
          keywords: [],
          visibility: 'public'
        }
      ],
      methods: [
        { kind: 'method',
          name: 'greet',
          params: [],
          description: 'method greet description',
          category: undefined,
          version: undefined,
          keywords: [],
          syntax: [
            'greet(): void'
          ],
          visibility: 'public',
          returns: {
            description: undefined,
            type: 'void'
          }
        },
        { kind: 'method',
          name: '_protectedMethod',
          params: [],
          description: 'method _protectedMethod description',
          category: undefined,
          version: undefined,
          keywords: [],
          syntax: [
            '_protectedMethod(): void'
          ],
          visibility: 'protected',
          returns: {
            description: undefined,
            type: 'void'
          }
        }
      ],
      computed: [
        { kind: 'computed',
          name: 'computedMsg',
          type: 'string',
          category: undefined,
          version: undefined,
          dependencies: [ 'msg' ],
          description: 'computed computedMsg description',
          keywords: [],
          visibility: 'public'
        },
        { kind: 'computed',
          name: 'computedString',
          type: 'string',
          category: undefined,
          version: undefined,
          dependencies: [ 'msg' ],
          description: 'computed computedString description',
          keywords: [],
          visibility: 'public'
        },
        { kind: 'computed',
          name: 'computedString2',
          type: 'string',
          category: undefined,
          version: undefined,
          dependencies: [],
          description: 'computed computedString description',
          keywords: [],
          visibility: 'public'
        },
        { kind: 'computed',
          name: 'computedNull',
          type: 'null',
          category: undefined,
          version: undefined,
          dependencies: [],
          description: 'computed computedNull description',
          keywords: [],
          visibility: 'public'
        },
        { kind: 'computed',
          name: 'computedBool',
          type: 'boolean',
          category: undefined,
          version: undefined,
          dependencies: [],
          description: 'computed computedBool description',
          keywords: [],
          visibility: 'public'
        },
        { kind: 'computed',
          name: 'computedArray',
          type: 'array',
          category: undefined,
          version: undefined,
          dependencies: [],
          description: 'computed computedArray description',
          keywords: [],
          visibility: 'public'
        },
        { kind: 'computed',
          name: 'computedObject',
          type: 'object',
          category: undefined,
          version: undefined,
          dependencies: [],
          description: 'computed computedObject description',
          keywords: [],
          visibility: 'public'
        },
        { kind: 'computed',
          name: 'computedNewObject',
          type: 'Array',
          category: undefined,
          version: undefined,
          dependencies: [],
          description: 'computed computedNewObject description',
          keywords: [],
          visibility: 'public'
        },
        { kind: 'computed',
          name: 'computedNewObject2',
          type: 'object',
          category: undefined,
          version: undefined,
          dependencies: [],
          description: 'computed computedNewObject2 description',
          keywords: [],
          visibility: 'public'
        },
        { kind: 'computed',
          name: 'computedRegExpLiteral',
          type: 'regexp',
          category: undefined,
          version: undefined,
          dependencies: [],
          description: 'computed computedRegExpLiteral description',
          keywords: [],
          visibility: 'public'
        },
        { kind: 'computed',
          name: 'computedBigIntLiteral',
          type: 'bigint',
          category: undefined,
          version: undefined,
          dependencies: [],
          description: 'computed computedBigIntLiteral description',
          keywords: [],
          visibility: 'public'
        },
        { kind: 'computed',
          name: 'computedNumber',
          type: 'number',
          category: undefined,
          version: undefined,
          dependencies: [],
          description: 'computed computedNumber description',
          keywords: [],
          visibility: 'public'
        },
        { kind: 'computed',
          name: 'computedNumber1',
          type: 'boolean',
          category: undefined,
          version: undefined,
          dependencies: [],
          description: 'computed computedNumber description',
          keywords: [],
          visibility: 'public'
        },
        { kind: 'computed',
          name: 'computedNumber2',
          type: 'number',
          category: undefined,
          version: undefined,
          dependencies: [ 'msg' ],
          description: 'computed computedNumber description',
          keywords: [],
          visibility: 'public'
        },
        { kind: 'computed',
          name: '[Symbol.species]',
          type: 'unknow',
          category: undefined,
          version: undefined,
          dependencies: [],
          description: 'computed [Symbol.species] description',
          keywords: [],
          visibility: 'public'
        },
        { kind: 'computed',
          name: 'empty',
          type: 'unknow',
          category: undefined,
          version: undefined,
          dependencies: [],
          description: 'computed [Symbol.species] description',
          keywords: [],
          visibility: 'public'
        },
        { kind: 'computed',
          name: 'something',
          type: 'Array<any>',
          category: undefined,
          version: undefined,
          dependencies: [],
          description: undefined,
          keywords: [],
          visibility: 'public'
        }
      ],
      data: [
        {
          kind: 'data',
          name: 'msg',
          type: 'string',
          category: undefined,
          version: undefined,
          description: 'data msg description',
          initialValue: '"Hello"',
          keywords: [],
          visibility: 'public'
        },
        {
          kind: 'data',
          name: 'helloMsg',
          type: 'BinaryExpression',
          category: undefined,
          version: undefined,
          description: 'data helloMsg with expression',
          initialValue: '\'Hello, \' + this.name',
          keywords: [],
          visibility: 'public'
        }
      ],
      props: [
        { kind: 'prop',
          name: 'name',
          type: 'String',
          category: undefined,
          version: undefined,
          required: false,
          default: undefined,
          describeModel: false,
          description: 'prop name description',
          keywords: [],
          visibility: 'public'
        }
      ],
      slots: []
    }
  });

  ComponentTestCase({
    name: 'vuedoc.md#25 - Class Component',
    options: {
      filecontent: `
        <script>
          import Vue from 'vue';
          import Component from 'vue-class-component';

          /**
           * MyComponent description
           */
          @Component({
            name: 'MyComponent',
            router,
            components: {
              XHeader,
            },
          })
          class App extends Vue {
            data() {
              return {
                routeQueue: [this.$router.currentRoute],
                historyLength: window.history.length,
                transitionName: 'slide-left',
                init: false,
              };
            }
          };

          export default App
        </script>
      `
    },
    expected: {
      name: 'MyComponent',
      description: 'MyComponent description',
      inheritAttrs: true,
      errors: [],
      keywords: [],
      events: [],
      methods: [],
      computed: [],
      data: [
        {
          kind: 'data',
          name: 'routeQueue',
          type: 'array',
          description: undefined,
          category: undefined,
          version: undefined,
          initialValue: '[this.$router.currentRoute]',
          keywords: [],
          visibility: 'public'
        },
        {
          kind: 'data',
          name: 'historyLength',
          type: 'object',
          description: undefined,
          category: undefined,
          version: undefined,
          initialValue: 'window.history.length',
          keywords: [],
          visibility: 'public'
        },
        {
          kind: 'data',
          name: 'transitionName',
          type: 'string',
          description: undefined,
          category: undefined,
          version: undefined,
          initialValue: '"slide-left"',
          keywords: [],
          visibility: 'public'
        },
        {
          kind: 'data',
          name: 'init',
          type: 'boolean',
          description: undefined,
          category: undefined,
          version: undefined,
          initialValue: 'false',
          keywords: [],
          visibility: 'public'
        },
      ],
      props: [],
      slots: []
    }
  });
});
