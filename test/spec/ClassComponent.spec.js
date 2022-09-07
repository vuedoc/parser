import { describe, expect, it } from 'vitest';

describe('ClassComponent', () => {
  it('#37 - Class Component', async () => {
    const options = {
      ignoredVisibilities: [
        'private',
      ],
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
             * computed CustomeObject description
             */
            get computedCustomeObject() {
              return new CustomeObject();
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
    };

    await expect(options).toParseAs({
      name: 'App',
      description: 'A class component element',
      inheritAttrs: false,
      errors: [],
      keywords: [
        {
          name: 'contributor',
          description: 'Jon Snow',
        },
      ],
      events: [
        {
          kind: 'event',
          name: 'created',
          arguments: [],
          description: 'event constructor description',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'event',
          name: 'mounted',
          arguments: [],
          description: 'event mounted description',
          keywords: [],
          visibility: 'public',
        },
      ],
      methods: [
        {
          kind: 'method',
          name: 'greet',
          params: [],
          description: 'method greet description',
          keywords: [],
          syntax: [
            'greet(): void',
          ],
          visibility: 'public',
          returns: {
            type: 'void',
          },
        },
        {
          kind: 'method',
          name: '_protectedMethod',
          params: [],
          description: 'method _protectedMethod description',
          keywords: [],
          syntax: [
            '_protectedMethod(): void',
          ],
          visibility: 'protected',
          returns: {
            type: 'void',
          },
        },
      ],
      computed: [
        {
          kind: 'computed',
          name: 'computedMsg',
          type: 'string',
          dependencies: [
            'msg',
          ],
          description: 'computed computedMsg description',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'computed',
          name: 'computedString',
          type: 'string',
          dependencies: [
            'msg',
          ],
          description: 'computed computedString description',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'computed',
          name: 'computedString2',
          type: 'string',
          dependencies: [],
          description: 'computed computedString description',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'computed',
          name: 'computedNull',
          type: 'unknown',
          dependencies: [],
          description: 'computed computedNull description',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'computed',
          name: 'computedBool',
          type: 'boolean',
          dependencies: [],
          description: 'computed computedBool description',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'computed',
          name: 'computedArray',
          type: 'number[]',
          dependencies: [],
          description: 'computed computedArray description',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'computed',
          name: 'computedObject',
          type: 'object',
          dependencies: [],
          description: 'computed computedObject description',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'computed',
          name: 'computedNewObject',
          type: 'array',
          dependencies: [],
          description: 'computed computedNewObject description',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'computed',
          name: 'computedCustomeObject',
          type: 'CustomeObject',
          dependencies: [],
          description: 'computed CustomeObject description',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'computed',
          name: 'computedNewObject2',
          type: 'unknown',
          dependencies: [],
          description: 'computed computedNewObject2 description',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'computed',
          name: 'computedRegExpLiteral',
          type: 'regexp',
          dependencies: [],
          description: 'computed computedRegExpLiteral description',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'computed',
          name: 'computedBigIntLiteral',
          type: 'bigint',
          dependencies: [],
          description: 'computed computedBigIntLiteral description',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'computed',
          name: 'computedNumber',
          type: 'number',
          dependencies: [],
          description: 'computed computedNumber description',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'computed',
          name: 'computedNumber1',
          type: 'boolean',
          dependencies: [],
          description: 'computed computedNumber description',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'computed',
          name: 'computedNumber2',
          type: 'string',
          dependencies: [
            'msg',
          ],
          description: 'computed computedNumber description',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'computed',
          name: '[Symbol.species]',
          type: 'unknown',
          dependencies: [],
          description: 'computed [Symbol.species] description',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'computed',
          name: 'empty',
          type: 'unknown',
          dependencies: [],
          description: 'computed [Symbol.species] description',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'computed',
          name: 'something',
          type: 'Array<any>',
          dependencies: [],
          keywords: [],
          visibility: 'public',
        },
      ],
      data: [
        {
          kind: 'data',
          name: 'msg',
          type: 'string',
          description: 'data msg description',
          initialValue: '"Hello"',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'data',
          name: 'helloMsg',
          type: 'string',
          description: 'data helloMsg with expression',
          initialValue: "'Hello, ' + this.name",
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [
        {
          kind: 'prop',
          name: 'name',
          type: 'string',
          required: false,
          describeModel: false,
          description: 'prop name description',
          keywords: [],
          visibility: 'public',
        },
      ],
      slots: [],
    });
  });

  it('vuedoc.md#25 - Class Component', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
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
          type: 'unknown[]',
          initialValue: '[this.$router.currentRoute]',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'data',
          name: 'historyLength',
          type: 'number',
          initialValue: 'window.history.length',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'data',
          name: 'transitionName',
          type: 'string',
          initialValue: '"slide-left"',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'data',
          name: 'init',
          type: 'boolean',
          initialValue: 'false',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
      slots: [],
    });
  });

  it('Class Component Visibilities', async () => {
    const options = {
      filecontent: `
        <script>
          import Vue from 'vue';
          import Component from 'vue-class-component';

          /**
           * MyComponent description
           */
          @Component()
          export default class MyComponent extends Vue {
            private shouldBeIgnored = 'some string';
            protected shouldBeIgnored2 = 'some other string';
            #shouldBeIgnored3 = 'some other string';
            public shouldBeSeen = 'some other string';

            private get shouldBeIgnored3() {
              return 'some other string';
            }

            protected get shouldBeIgnored4() {
              return 'some other string';
            }

            get #shouldBeIgnored5() {
              return 'some other string';
            }

            public get shouldBeSeen2() {
              return 'some other string';
            }

            #shouldBeIgnored6() {
              return 'some other string';
            }

            public shouldBeSeen3() {
              return 'some other string';
            }
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      name: 'MyComponent',
      description: 'MyComponent description',
      inheritAttrs: true,
      errors: [],
      keywords: [],
      events: [],
      methods: [
        {
          kind: 'method',
          name: 'shouldBeSeen3',
          keywords: [],
          params: [],
          visibility: 'public',
          returns: {
            type: 'string',
          },
          syntax: [
            'shouldBeSeen3(): string',
          ],
        },
      ],
      computed: [
        {
          kind: 'computed',
          name: 'shouldBeSeen2',
          type: 'string',
          keywords: [],
          visibility: 'public',
          dependencies: [],
        },
      ],
      data: [
        {
          kind: 'data',
          name: 'shouldBeSeen',
          type: 'string',
          initialValue: '"some other string"',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
      slots: [],
    });
  });
});
