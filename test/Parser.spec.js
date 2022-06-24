import assert from 'assert';
import { Parser } from '../lib/parser/Parser.js';

/* global describe it expect */
/* eslint-disable max-len */
/* eslint-disable indent */

const template = `
  <div>
    <!-- Template event with @ -->
    <input @input="$emit('template-@-event', $event)">

    <!-- Template event with v-on -->
    <input v-on:input="$emit('template-v-on-event', $event)" />

    <label>
      <input :disabled="disabled" type="text" v-model="checkbox">
      <!-- Default slot -->
      <slot></slot>
      <!-- Use this slot to set the checkbox label -->
      <slot name="label">Unamed checkbox</slot>
      <!--
        This
        is multiline description
      -->
      <slot name="multiline">Unamed checkbox</slot>
      <slot name="undescribed"></slot>
      <template></template>
    </label>
  </div>
`;

const script = `
  const componentName = 'checkboxPointer'
  const aliasName = componentName

  /**
   * The generic component
   * Sub description
   *
   *
   * @public
   * @alpnum azert0 123456789
   * @generic Keyword generic description
   * @multiline Keyword multiline
   *            description
   * @special-char {$[ç(àë£€%µù!,|\`_\\<>/_ç^?;.:/!§)]}
   * @punctuations !,?;.:!
   * @operators -/+<>=*%
   *
   * @slot inputs - Use this slot to define form inputs ontrols
   * @slot actions - Use this slot to define form action buttons controls
   * @slot footer - Use this slot to define form footer content.
   *
   * @model
   */
  export default Vue.extend({
    name: 'checkbox',
    name: componentName,

    model: {
      prop: 'model',
      event: 'input'
    },

    props: {
      /**
       * The checkbox model
       * @model
       */
      model: {
        type: Array,
        required: true
      },

      /**
       * Initial checkbox state
       */
      disabled: Boolean,

      /**
       * Initial checkbox value
       */
      checked: {
        type: Boolean,
        default: true
      },

      // Prop with multiple type
      active: [Number, Boolean],

      // Prop with arrow function
      propWithArrow: {
        type: Object,
        default: () => ({ name: 'X'})
      },

      // Prop with object function
      propWithFunction: {
        type: Object,
        default() {
          return { name: 'X' }
        }
      },

      // Prop with anonymous function
      propWithAnonymousFunction: {
        type: Object,
        default: function() {
          return { name: 'X' }
        }
      },

      // Prop with named function
      propWithNamedFunction: {
        type: Object,
        default: function propWithNamedFunction() {
          return { name: 'X' }
        }
      },
    },

    data () {
      const pointer = 'pointed value'

      return {
        int: 12,
        float: 12.2,
        booleanTrue: true,
        booleanFalse: false,
        string: 'Hello',
        string: 'Hello',
        null: null,
        undefined: undefined,
        function: new Function(),
        arrowFunction: () => undefined,
        date: Date.now(),
        pointer: pointer,
        componentName: componentName,
        value: null
      }
    },

    data: {
      int: 13
    },

    computed: {
      id () {
        const name = this.componentName

        return \`\${name}-\${this.pointer}\`
      },
      name () {
        return this.componentName
      }
    },

    methods: {
      /**
      * @private
      */
      privateMethod () {
        console.log('check')

        const name = 'check'
        const value = 'event value'

        if (name) {
          console.log('>', name)
        }

        /**
        * Event with identifier name
        */
        this.$emit(name, value)
      },

      /**
      * Check the checkbox
      */
      check () {
        console.log('check')

        let eventName = 'check'
        const value = 'event value'

        if (eventName) {
          console.log('>', eventName)
        }

        eventName = 'renamed'

        /**
        * Event with renamed identifier name
        */
        this.$emit(eventName, value)
      },

      /**
      * @protected
      */
      recursiveIdentifierValue () {
        console.log('check')

        let recursiveValue = 'recursive'
        const value = 'event value'

        if (eventName) {
          console.log('>', eventName)
          this.$emit('if-event', value)
        } else if (value) {
          this.$emit('else-if-event', value)
        } else {
          this.$emit('else-event', 123)
        }

        for (let i = 0; i < 0; i++) {
          this.$emit('for-event', value)
        }

        for (let i of []) {
          this.$emit('for-of-event', value)
        }

        for (let i in {}) {
          this.$emit('for-in-event', value)
        }

        do {
          this.$emit('do-while-event', value)
        } while (false)

        while (false) {
          this.$emit('while-event', value)
        }

        switch (x) {
          case 1:
            this.$emit('switch-case-event', value)
            break

          default:
            this.$emit('switch-case-default-event', value)
            break
        }

        try {
          this.$emit('try-event', value)
        } catch (e) {
          this.$emit('try-catch-event', value)
        } finally {
          this.$emit('try-finally-event', value)
        }

        eventName = recursiveValue

        /**
        * Event with recursive identifier name
        */
        this.$emit(eventName, value, 12)
      },

      uncommentedMethod (a, b = 2, c = this.componentName) {},
      withDefault (f = () => 0) {},
      withAlias (a = aliasName) {},
      withSpread (...args) {},
      withDefaultObject (options = {}) {},
      withDestructuring ({ x, y }) {},
    },

    beforeRouteEnter (to, from, next) {
      next((vm) => {
        /**
         * beforeRouteEnter event description
         */
        vm.$emit('beforeRouteEnter-event', this.value)
      })
    },

    beforeRouteUpdate (to, from, next) {
      next((vm) => {
        /**
         * beforeRouteUpdate event description
         */
        vm.$emit('beforeRouteUpdate-event', this.value)
      })
    },

    beforeRouteLeave (to, from, next) {
      next((vm) => {
        /**
         * beforeRouteLeave event description
         */
        vm.$emit('beforeRouteLeave-event', this.value)
      })
    },

    beforeCreate () {
      /**
       * beforeCreate event description
       */
      this.$emit('beforeCreate-event', this.value)
    },

    created () {
      /**
       * Created event description
       */
      this.$emit('created-event', this.value)
    },

    beforeMount () {
      /**
       * beforeMount event description
       */
      this.$emit('beforeMount-event', this.value)
    },

    mounted () {
      /**
       * mounted event description
       */
      this.$emit('mounted-event', this.value)
    },

    beforeUpdate () {
      /**
       * beforeUpdate event description
       */
      this.$emit('beforeUpdate-event', this.value)
    },

    updated () {
      /**
       * updated event description
       */
      this.$emit('updated-event', this.value)
    },

    beforeDestroy () {
      /**
       * beforeDestroy event description
       */
      this.$emit('beforeDestroy-event', this.value)
    },

    destroyed () {
      /**
       * destroyed event description
       */
      this.$emit('destroyed-event', this.value)
    },

    render (createElement, { props }) {
      /**
       * render event description
       */
      this.$emit('render-event', this.value)
    }
  })
`;

const events = [
  'name', 'description', 'keywords',
  'prop', 'data', 'computed', 'method',
  'event', 'slot',
];

describe('Parser', () => {
  describe('validateOptions(options)', () => {
    it('should failed with missing options.source', () => {
      const options = {};

      assert.throws(() => Parser.validateOptions(options), /options.source is required/);
    });

    it('should successfully parse options', () => {
      const options = { source: {} };

      assert.doesNotThrow(() => Parser.validateOptions(options));
    });

    it('should parse with an invalid type of options.features', () => {
      const options = { source: {}, features: 'events' };

      assert.throws(
        () => Parser.validateOptions(options),
        /options\.features must be an array/
      );
    });

    it('should parse with an invalid options.features', () => {
      const options = { source: {}, features: ['invalid-feature'] };

      assert.throws(
        () => Parser.validateOptions(options),
        /Unknow 'invalid-feature' feature\. Supported features:/
      );
    });

    it('should parse with a valid options.features', () => {
      const options = { source: {}, features: ['name', 'events'] };

      assert.doesNotThrow(() => Parser.validateOptions(options));
    });
  });

  describe('getEventName(feature)', () => {
    it('should succed with a singular name', () => {
      const feature = 'name';
      const expected = feature;

      expect(Parser.getEventName(feature)).toBe(expected);
    });

    it('should succed with a plural name', () => {
      const feature = 'methods';
      const expected = 'method';

      expect(Parser.getEventName(feature)).toBe(expected);
    });
  });

  describe('constructor(options)', () => {
    it('should successfully create new object', () => {
      const filename = './fixtures/checkbox.vue';
      const options = {
        source: { script, template },
        filename,
      };

      const parser = new Parser(options);

      expect(parser.options.source.template).toBe(template);
      expect(parser.options.source.script).toBe(script);
      expect(parser.scope).toEqual({});
    });

    it('should successfully create new object with missing script', () => {
      const options = {
        source: { template },
      };

      const parser = new Parser(options);

      expect(parser.options.source.script).toBeUndefined();
      expect(parser.options.source.template).toBe(template);
    });

    it('should successfully create new object with empty script', () => {
      const options = {
        source: { template, script: '' },
      };

      const parser = new Parser(options);

      expect(parser.options.source.script).toBe('');
      expect(parser.options.source.template).toBe(template);
    });
  });

  describe('walk()', () => {
    it('should successfully create new object', (done) => {
      const filename = './fixtures/checkbox.vue';
      const options = {
        source: { script, template },
        filename,
      };

      const parser = new Parser(options);

      parser.on('end', done);
      parser.walk();
    });

    describe('features.length === 0', () => {
      it('should ignore all features', (done) => {
        const options = { source: { script }, features: [] };
        const parser = new Parser(options);

        const walker = parser.walk().on('end', done);

        Parser.SUPPORTED_FEATURES.forEach((feature) => {
          walker.on(feature, () => {
            throw new Error(`Should ignore the component '${feature}' feature`);
          });
        });
      });
    });

    describe('description', () => {
      const script = {
        attrs: {
          lang: 'js',
        },
        content: `
          /**
           * Component description
           * on multiline
           *
           * with preserve
           *
           *
           * whitespaces
           */
          export default {}
        `,
      };

      it('should successfully emit component description', (done) => {
        const options = { source: { script } };

        new Parser(options).walk().on('description', ({ value }) => {
          expect(value).toBe('Component description\non multiline\n\nwith preserve\n\n\nwhitespaces');

          done();
        });
      });

      it('should ignore the component description with missing `description` in options.features', (done) => {
        const filename = './fixtures/checkbox.vue';
        const options = {
          source: { script },
          filename,
          features: ['name'],
        };

        new Parser(options).walk()
          .on('description', () => {
            throw new Error('Should ignore the component description');
          })
          .on('end', done);
      });
    });

    describe('keywords', () => {
      it('should successfully emit component keywords by ignoring name, slot and mixin', (done) => {
        const script = {
          attrs: {
            lang: 'js',
          },
          content: `
            /**
             * @name my-checkbox
             * @mixin
             * @slot default slot
             * @tagtest 1.0.0
             */
            export default {}
          `,
        };

        const options = { source: { script } };

        new Parser(options).walk().on('keywords', ({ value }) => {
          expect(value).toEqual([{ name: 'tagtest', description: '1.0.0' }]);
          done();
        });
      });

      it('should ignore the component keywords with missing `description` in options.features', (done) => {
        const filename = './fixtures/checkbox.vue';
        const script = `
          /**
           * hello
           */
          export default {}
        `;
        const options = {
          source: { script },
          filename,
          features: ['name'],
        };

        new Parser(options).walk()
          .on('description', () => done(new Error('Should ignore the component description')))
          .on('end', done);
      });
    });

    describe('export default expression', () => {
      it('should successfully emit component name', (done) => {
        const options = {
          source: {
            script: {
              attrs: {
                lang: 'js',
              },
              content: `
                import child from 'child.vue'
      
                const component = {
                  name: 'hello'
                }
      
                export default component
              `,
            },
          },
        };

        new Parser(options).walk().on('name', ({ value }) => {
          expect(value).toBe('hello');
          done();
        });
      });

      it('should failed with missing exporting identifier', (done) => {
        const script = `
          export default component
        `;
        const options = { source: { script } };

        new Parser(options).walk().on('end', () => done());
      });

      it('should not fail when there is a top-level non-assignment expression', (done) => {
        const options = {
          source: {
            script: {
              attrs: {
                lang: 'js',
              },
              content: `
                import library from 'library'
      
                library.init()
      
                const component = {
                  name: 'hello'
                }
      
                export default component
              `,
            },
          },
        };

        new Parser(options).walk().on('name', ({ value }) => {
          expect(value).toBe('hello');
          done();
        });
      });
    });

    describe('parseTemplate()', () => {
      it('should successfully emit default slot', (done) => {
        const filename = './fixtures/checkbox.vue';
        const template = '<slot/>';
        const options = {
          filename,
          source: {
            template: {
              attrs: {
                lang: 'html',
              },
              content: template,
            },
          },
        };

        new Parser(options).walk().on('slot', (slot) => {
          expect(slot.name).toBe('default');
          expect(slot.description).toBeUndefined();
          done();
        });
      });

      it('should successfully emit default slot with description', (done) => {
        const filename = './fixtures/checkbox.vue';
        const template = `
          <div>
            <!-- a comment -->
            <p>Hello</p>
            <!-- this comment will be ignored -->
            <!-- default slot -->
            <slot/>
          </div>
        `;
        const options = {
          filename,
          source: {
            template: {
              attrs: {
                lang: 'html',
              },
              content: template,
            },
          },
        };

        new Parser(options).walk().on('slot', (slot) => {
          expect(slot.name).toBe('default');
          expect(slot.description).toBe('default slot');
          done();
        });
      });

      it('should ignore the component slots with missing `slots` in options.features', (done) => {
        const filename = './fixtures/checkbox.vue';
        const template = `
          <div>
            <!-- a comment -->
            <p>Hello</p>
            <!-- default slot -->
            <slot/>
          </div>
        `;
        const options = {
          filename,
          features: ['name'],
          source: {
            template: {
              attrs: {
                lang: 'html',
              },
              content: template,
            },
          },
        };

        new Parser(options).walk()
          .on('slot', () => {
            throw new Error('Should ignore the component slots');
          })
          .on('end', done);
      });

      it('should successfully emit defining template event with v-on: prefix', (done) => {
        const template = `
          <div>
            <input
              type="text"
              v-on:input="$emit('input', $event)"/>
          </div>
        `;
        const filename = './fixtures/checkbox.vue';
        const features = ['events'];
        const options = {
          filename,
          features,
          source: {
            template: {
              attrs: {
                lang: 'html',
              },
              content: template,
            },
          },
        };

        new Parser(options).walk()
          .on('event', (event) => {
            expect(event.name).toBe('input');
            expect(event.description).toBeUndefined();
            expect(event.visibility).toBe('public');
            expect(event.keywords).toEqual([]);
            done();
          });
      });

      it('should successfully emit defining template event with v-on: prefix and a description', (done) => {
        const template = `
          <div>
            <!-- Emit the input event -->
            <input
              type="text"
              v-on:input="$emit('input', $event)"/>
          </div>
        `;
        const filename = './fixtures/checkbox.vue';
        const features = ['events'];
        const options = {
          filename,
          features,
          source: {
            template: {
              attrs: {
                lang: 'html',
              },
              content: template,
            },
          },
        };

        new Parser(options).walk()
          .on('event', (event) => {
            expect(event.name).toBe('input');
            expect(event.description).toBe('Emit the input event');
            expect(event.visibility).toBe('public');
            expect(event.keywords).toEqual([]);
            done();
          });
      });

      it('should successfully emit defining template event with v-on: prefix and a visibility', (done) => {
        const template = `
          <div>
            <!-- @private -->
            <input
              type="text"
              v-on:input="$emit('input', $event)"/>
          </div>
        `;
        const filename = './fixtures/checkbox.vue';
        const features = ['events'];
        const options = {
          filename,
          features,
          ignoredVisibilities: ['protected'],
          source: {
            template: {
              attrs: {
                lang: 'html',
              },
              content: template,
            },
          },
        };

        new Parser(options).walk()
          .on('event', (event) => {
            expect(event.name).toBe('input');
            expect(event.description).toBe(undefined);
            expect(event.visibility).toBe('private');
            expect(event.keywords).toEqual([]);
            done();
          });
      });

      it('should successfully emit defining template event with v-on: prefix and meta info', (done) => {
        const template = `
          <div>
            <!--
              Emit the input event

              @protected
              @value A input value
            -->
            <input
              type="text"
              v-on:input="$emit('input', $event)"/>
          </div>
        `;
        const filename = './fixtures/checkbox.vue';
        const features = ['events'];
        const options = {
          filename,
          features,
          ignoredVisibilities: ['private'],
          source: {
            template: {
              attrs: {
                lang: 'html',
              },
              content: template,
            },
          },
        };

        new Parser(options).walk()
          .on('event', (event) => {
            expect(event.name).toBe('input');
            expect(event.description).toBe('Emit the input event');
            expect(event.visibility).toBe('protected');
            expect(event.keywords).toEqual([
              { name: 'value', description: 'A input value' },
            ]);
            done();
          });
      });

      it('should successfully emit defining template event with the @ prefix and meta info', (done) => {
        const template = `
          <div>
            <!--
              Emit the input event

              @protected
              @value A input value
            -->
            <input
              type="text"
              @input="$emit('input', $event)"/>
          </div>
        `;
        const filename = './fixtures/checkbox.vue';
        const features = ['events'];
        const options = {
          filename,
          features,
          ignoredVisibilities: ['private'],
          source: {
            template: {
              attrs: {
                lang: 'html',
              },
              content: template,
            },
          },
        };

        new Parser(options).walk()
          .on('event', (event) => {
            expect(event.name).toBe('input');
            expect(event.description).toBe('Emit the input event');
            expect(event.visibility).toBe('protected');
            expect(event.keywords).toEqual([
              { name: 'value', description: 'A input value' },
            ]);
            done();
          });
      });

      it('should successfully emit defining template events with both v-on: and @ prefixes', (done) => {
        const template = `
          <div>
            <!--
              Emit the input event

              @protected
              @value A input value
            -->
            <input
              type="text"
              @input="$emit('input', $event)"
              v-on:change="$emit('change', $event)"/>
          </div>
        `;
        const filename = './fixtures/checkbox.vue';
        const features = ['events'];
        const options = {
          filename,
          features,
          ignoredVisibilities: ['private'],
          source: {
            template: {
              attrs: {
                lang: 'html',
              },
              content: template,
            },
          },
        };

        const expected = [
          { kind: 'event',
            name: 'input',
            category: undefined,
            arguments: [],
            visibility: 'protected',
            description: 'Emit the input event',
            keywords:
            [{ name: 'value', description: 'A input value' }] },
          { kind: 'event',
            name: 'change',
            category: undefined,
            arguments: [],
            visibility: 'protected',
            description: 'Emit the input event',
            keywords:
            [{ name: 'value', description: 'A input value' }] },
        ];

        const result = [];

        new Parser(options).walk()
          .on('event', (event) => result.push(event))
          .on('end', () => {
            expect(result).toEqual(expected);
            done();
          });
      });
    });

    describe('parseKeywords()', () => {
      ['arg', 'prop', 'param', 'argument'].forEach((tag) => {
        it(`should successfully emit param with @${tag}`, (done) => {
          const filename = './fixtures/checkbox.vue';
          const script = `
            export default {
              methods: {
                /**
                 * Get the x value.
                 * @${tag} {number} x - The x value.
                 */
                getX (x) {}
              }
            }
          `;
          const options = {
            filename,
            source: {
              script: {
                attrs: {
                  lang: 'js',
                },
                content: script,
              },
            },
          };
          const expected = [
            {
              type: 'number',
              name: 'x',
              description: 'The x value.',
              defaultValue: undefined,
              rest: false,
            },
          ];

          new Parser(options).walk().on('method', (method) => {
            expect(method.name).toBe('getX');
            expect(method.description).toBe('Get the x value.');
            expect(method.params).toEqual(expected);
            done();
          });
        });
      });

      it('should successfully emit param with parameter\'s properties', (done) => {
        const filename = './fixtures/checkbox.vue';
        const script = `
          export default {
            methods: {
              /**
               * Assign the project to an employee.
               * @param {Object} employee - The employee who is responsible for the project.
               * @param {string} employee.name - The name of the employee.
               * @param {string} employee.department - The employee's department.
               */
              assign (employee) {}
            }
          }
        `;
        const options = {
          filename,
          source: {
            script: {
              attrs: {
                lang: 'js',
              },
              content: script,
            },
          },
        };
        const expected = [
          {
            type: 'Object',
            name: 'employee',
            description: 'The employee who is responsible for the project.',
            defaultValue: undefined,
            rest: false },
          {
            type: 'string',
            name: 'employee.name',
            description: 'The name of the employee.',
            defaultValue: undefined,
            rest: false },
          {
            type: 'string',
            name: 'employee.department',
            description: 'The employee\'s department.',
            defaultValue: undefined,
            rest: false },
        ];

        new Parser(options).walk().on('method', (method) => {
          expect(method.name).toBe('assign');
          expect(method.description).toBe('Assign the project to an employee.');
          expect(method.params).toEqual(expected);
          done();
        });
      });

      it('should successfully emit param with array type', (done) => {
        const filename = './fixtures/checkbox.vue';
        const script = `
          export default {
            methods: {
              /**
               * Assign the project to a list of employees.
               * @param {Object[]} employees - The employees who are responsible for the project.
               */
              assign (employees) {}
            }
          }
        `;
        const options = {
          filename,
          source: {
            script: {
              attrs: {
                lang: 'js',
              },
              content: script,
            },
          },
        };
        const expected = [
          {
            type: 'Object[]',
            name: 'employees',
            description: 'The employees who are responsible for the project.',
            defaultValue: undefined,
            rest: false },
        ];

        new Parser(options).walk().on('method', (method) => {
          expect(method.name).toBe('assign');
          expect(method.description).toBe('Assign the project to a list of employees.');
          expect(method.params).toEqual(expected);
          done();
        });
      });

      it('should successfully emit param with properties of values in an array', (done) => {
        const filename = './fixtures/checkbox.vue';
        const script = `
          export default {
            methods: {
              /**
               * Assign the project to a list of employees.
               * @param {Object[]} employees - The employees who are responsible for the project.
               * @param {string} employees[].name - The name of an employee.
               * @param {string} employees[].department - The employee's department.
               */
              assign (employees) {}
            }
          }
        `;
        const options = {
          filename,
          source: {
            script: {
              attrs: {
                lang: 'js',
              },
              content: script,
            },
          },
        };
        const expected = [
          {
            type: 'Object[]',
            name: 'employees',
            description: 'The employees who are responsible for the project.',
            defaultValue: undefined,
            rest: false },
          {
            type: 'string',
            name: 'employees[].name',
            description: 'The name of an employee.',
            defaultValue: undefined,
            rest: false },
          {
            type: 'string',
            name: 'employees[].department',
            description: 'The employee\'s department.',
            defaultValue: undefined,
            rest: false },
        ];

        new Parser(options).walk().on('method', (method) => {
          expect(method.name).toBe('assign');
          expect(method.description).toBe('Assign the project to a list of employees.');
          expect(method.params).toEqual(expected);
          done();
        });
      });

      it('should successfully emit optional param', (done) => {
        const filename = './fixtures/checkbox.vue';
        const script = `
          export default {
            methods: {
              /**
               * @param {string} [somebody] - Somebody's name.
               */
              sayHello (somebody) {}
            }
          }
        `;
        const options = {
          filename,
          source: {
            script: {
              attrs: {
                lang: 'js',
              },
              content: script,
            },
          },
        };
        const expected = [
          {
            type: 'string',
            name: 'somebody',
            description: 'Somebody\'s name.',
            optional: true,
            defaultValue: undefined,
            rest: false,
          },
        ];

        new Parser(options).walk().on('method', (method) => {
          expect(method.name).toBe('sayHello');
          expect(method.description).toBe(undefined);
          expect(method.params).toEqual(expected);
          done();
        });
      });

      it('should successfully emit optional parameter (using Google Closure Compiler syntax)', (done) => {
        const filename = './fixtures/checkbox.vue';
        const script = `
          export default {
            methods: {
              /**
               * @param {string} [somebody=] - Somebody's name.
               */
              sayHello (somebody) {}
            }
          }
        `;
        const options = {
          filename,
          source: {
            script: {
              attrs: {
                lang: 'js',
              },
              content: script,
            },
          },
        };
        const expected = [
          {
            type: 'string',
            name: 'somebody',
            description: 'Somebody\'s name.',
            defaultValue: undefined,
            optional: true,
            rest: false,
          },
        ];

        new Parser(options).walk().on('method', (method) => {
          expect(method.name).toBe('sayHello');
          expect(method.description).toBe(undefined);
          expect(method.params).toEqual(expected);
          done();
        });
      });

      it('should successfully emit optional param and one type OR another type (type union)', (done) => {
        const filename = './fixtures/checkbox.vue';
        const script = `
          export default {
            methods: {
              /**
               * @param {(string|string[])} [somebody=John Doe] - Somebody's name, or an array of names.
               */
              sayHello (somebody) {}
            }
          }
        `;
        const options = {
          filename,
          source: {
            script: {
              attrs: {
                lang: 'js',
              },
              content: script,
            },
          },
        };
        const expected = [
          {
            type: ['string', 'string[]'],
            name: 'somebody',
            description: 'Somebody\'s name, or an array of names.',
            optional: true,
            defaultValue: 'John Doe',
            rest: false,
          },
        ];

        new Parser(options).walk().on('method', (method) => {
          expect(method.name).toBe('sayHello');
          expect(method.description).toBe(undefined);
          expect(method.params).toEqual(expected);
          done();
        });
      });

      it('should successfully emit optional param and default value', (done) => {
        const filename = './fixtures/checkbox.vue';
        const script = `
          export default {
            methods: {
              /**
               * @param {string} [somebody=John Doe] - Somebody's name.
              */
              sayHello (somebody) {}
            }
          }
        `;
        const options = {
          filename,
          source: {
            script: {
              attrs: {
                lang: 'js',
              },
              content: script,
            },
          },
        };
        const expected = [
          {
            type: 'string',
            name: 'somebody',
            description: 'Somebody\'s name.',
            optional: true,
            defaultValue: 'John Doe',
            rest: false,
          },
        ];

        new Parser(options).walk().on('method', (method) => {
          expect(method.name).toBe('sayHello');
          expect(method.description).toBe(undefined);
          expect(method.params).toEqual(expected);
          done();
        });
      });

      it('should successfully emit param in a event', (done) => {
        const filename = './fixtures/checkbox.vue';
        const script = `
          export default {
            methods: {
              getX (x) {
                /**
                 * Emit the x value.
                 * @param {number} x - The x value.
                 */
                this.$emit('input', x)
              }
            }
          }
        `;
        const options = {
          filename,
          source: {
            script: {
              attrs: {
                lang: 'js',
              },
              content: script,
            },
          },
        };
        const expected = [
          { type: 'number',
            name: 'x',
            description: 'The x value.',
            rest: false },
        ];

        new Parser(options).walk().on('event', (event) => {
          expect(event.name).toBe('input');
          expect(event.description).toBe('Emit the x value.');
          expect(event.arguments).toEqual(expected);
          done();
        });
      });

      it('should successfully emit return', (done) => {
        const filename = './fixtures/checkbox.vue';
        const script = `
          export default {
            methods: {
              /**
               * Get the x value.
               * @return {number} The x value.
               */
              getX () {}
            }
          }
        `;
        const options = {
          filename,
          source: {
            script: {
              attrs: {
                lang: 'js',
              },
              content: script,
            },
          },
        };
        const expected = {
          type: 'number',
          description: 'The x value.',
        };

        new Parser(options).walk().on('method', (method) => {
          expect(method.name).toBe('getX');
          expect(method.description).toBe('Get the x value.');
          expect(method.returns).toEqual(expected);
          done();
        });
      });

      it('should successfully emit alias @returns', (done) => {
        const filename = './fixtures/checkbox.vue';
        const script = `
          export default {
            methods: {
              /**
               * Get the x value.
               * @returns {number} The x value.
               */
              getX () {}
            }
          }
        `;
        const options = {
          filename,
          source: {
            script: {
              attrs: {
                lang: 'js',
              },
              content: script,
            },
          },
        };
        const expected = {
          type: 'number',
          description: 'The x value.',
        };

        new Parser(options).walk().on('method', (method) => {
          expect(method.name).toBe('getX');
          expect(method.description).toBe('Get the x value.');
          expect(method.returns).toEqual(expected);
          done();
        });
      });

      it('should successfully emit return with array type', (done) => {
        const filename = './fixtures/checkbox.vue';
        const script = `
          export default {
            methods: {
              /**
               * Get the x values.
               * @return {number[]} The x values.
               */
              getX () {}
            }
          }
        `;
        const options = {
          filename,
          source: {
            script: {
              attrs: {
                lang: 'js',
              },
              content: script,
            },
          },
        };
        const expected = {
          type: 'number[]',
          description: 'The x values.',
        };

        new Parser(options).walk().on('method', (method) => {
          expect(method.name).toBe('getX');
          expect(method.description).toBe('Get the x values.');
          expect(method.returns).toEqual(expected);
          done();
        });
      });

      it('should successfully emit return with one type OR another returning type (type union)', (done) => {
        const filename = './fixtures/checkbox.vue';
        const script = `
          export default {
            methods: {
              /**
               * @return {(string| string[])} The x values.
               */
              getX () {}
            }
          }
        `;
        const options = {
          filename,
          source: {
            script: {
              attrs: {
                lang: 'js',
              },
              content: script,
            },
          },
        };
        const expected = {
          type: ['string', 'string[]'],
          description: 'The x values.',
        };

        new Parser(options).walk().on('method', (method) => {
          expect(method.name).toBe('getX');
          expect(method.returns).toEqual(expected);
          done();
        });
      });
    });

    describe('parseComponentName()', () => {
      it('should successfully emit component name with only template', (done) => {
        const filename = './fixtures/checkbox.vue';
        const template = `
          <div>
            <!-- a comment -->
            <p>Hello</p>
          </div>
        `;
        const options = {
          filename,
          source: {
            template: {
              attrs: {
                lang: 'html',
              },
              content: template,
            },
          },
        };

        new Parser(options).walk().on('name', ({ value }) => {
          expect(value).toBe('checkbox');
          done();
        });
      });

      it('should successfully emit component name with explicit name', (done) => {
        const filename = './fixtures/checkbox.vue';
        const script = `
          export default {
            name: 'myInput'
          }
        `;
        const options = {
          filename,
          source: {
            script: {
              attrs: {
                lang: 'js',
              },
              content: script,
            },
          },
        };

        new Parser(options).walk().on('name', ({ value }) => {
          expect(value).toBe('myInput');
          done();
        });
      });

      it('should ignore the component name with missing `name` in options.features', (done) => {
        const filename = './fixtures/checkbox.vue';
        const script = `
          export default {
            name: 'myInput'
          }
        `;
        const options = {
          filename,
          features: ['description'],
          source: {
            script: {
              attrs: {
                lang: 'js',
              },
              content: script,
            },
          },
        };

        new Parser(options).walk()
          .on('name', () => {
            throw new Error('Should ignore the component name');
          })
          .on('end', done);
      });

      it('should ignore the component name with missing `name` in options.features and options.source.script', (done) => {
        const filename = './fixtures/checkbox.vue';
        const template = `
          <div>
            <!-- a comment -->
            <p>Hello</p>
          </div>
        `;
        const options = {
          filename,
          features: ['description'],
          source: {
            template: {
              attrs: {
                lang: 'html',
              },
              content: template,
            },
          },
        };

        new Parser(options).walk()
          .on('name', () => {
            throw new Error('Should ignore the component name');
          })
          .on('end', done);
      });
    });

    describe('should successfully emit model', () => {
      it('with all fields set', (done) => {
        const script = `
          export default {
            model: {
              prop: 'model',
              event: 'change'
            }
          }
        `;
        const options = {
          source: {
            script: {
              attrs: {
                lang: 'js',
              },
              content: script,
            },
          },
        };

        new Parser(options).walk().on('model', (model) => {
          expect(model).toEqual({
            kind: 'model',
            prop: 'model',
            event: 'change',
            description: undefined,
            visibility: 'public',
            keywords: [],
          });
          done();
        });
      });

      it('with only model.prop', (done) => {
        const script = `
          export default {
            model: {
              prop: 'model'
            }
          }
        `;
        const options = {
          source: {
            script: {
              attrs: {
                lang: 'js',
              },
              content: script,
            },
          },
        };

        new Parser(options).walk().on('model', (model) => {
          expect(model).toEqual({
            kind: 'model',
            prop: 'model',
            event: 'input',
            description: undefined,
            visibility: 'public',
            keywords: [],
          });
          done();
        });
      });

      it('with only model.event', (done) => {
        const script = `
          export default {
            model: {
              event: 'change'
            }
          }
        `;
        const options = {
          source: {
            script: {
              attrs: {
                lang: 'js',
              },
              content: script,
            },
          },
        };

        new Parser(options).walk().on('model', (model) => {
          expect(model).toEqual({
            kind: 'model',
            prop: 'value',
            event: 'change',
            description: undefined,
            visibility: 'public',
            keywords: [],
          });
          done();
        });
      });

      it('with empty object', (done) => {
        const script = `
          export default {
            model: {}
          }
        `;
        const options = {
          source: {
            script: {
              attrs: {
                lang: 'js',
              },
              content: script,
            },
          },
        };

        new Parser(options).walk().on('model', (model) => {
          expect(model).toEqual({
            kind: 'model',
            prop: 'value',
            event: 'input',
            description: undefined,
            visibility: 'public',
            keywords: [],
          });
          done();
        });
      });
    });

    it('should successfully emit generic prop', (done) => {
      const filename = './fixtures/checkbox.vue';
      const script = `
        export default {
          props: {
            id: { type: String, default: '$id' }
          }
        }
      `;
      const options = {
        filename,
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      new Parser(options).walk().on('prop', (prop) => {
        expect(prop.visibility).toBe('public');
        expect(prop.name).toBe('id');
        expect(prop.default).toBe('"$id"');
        expect(prop.type).toBe('String');
        expect(prop.description).toBeUndefined();
        expect(prop.required).toBeFalsy();
        expect(prop.keywords).toEqual([]);
        done();
      });
    });

    it('should successfully emit v-model prop', (done) => {
      const filename = './fixtures/checkbox.vue';
      const script = `
        export default {
          props: {
            /**
              * @model v-model keyword. Keyword description is ignored
              */
            value: { type: String }
          }
        }
      `;
      const options = {
        filename,
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      new Parser(options).walk().on('prop', (prop) => {
        expect(prop.visibility).toBe('public');
        expect(prop.name).toBe('value');
        expect(prop.describeModel).toBe(true);
        expect(prop.description).toBeUndefined();
        expect(prop.keywords).toEqual([]);
        expect(prop.type).toBe('String');
        done();
      });
    });

    it('should successfully emit v-model prop with the model field', (done) => {
      const filename = './fixtures/checkbox.vue';
      const script = `
        export default {
          model: {
            prop: 'checked'
          },
          props: {
             checked: { type: String }
          }
        }
      `;
      const options = {
        filename,
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      new Parser(options).walk().on('prop', (prop) => {
        expect(prop.visibility).toBe('public');
        expect(prop.name).toBe('checked');
        expect(prop.description).toBeUndefined();
        expect(prop.describeModel).toBeTruthy();
        expect(prop.type).toBe('String');
        expect(prop.keywords).toEqual([]);
        done();
      });
    });

    it('should successfully emit prop with truthy describeModel for prop.name === "value"', (done) => {
      const filename = './fixtures/checkbox.vue';
      const script = `
        export default {
          props: {
            value: { type: String }
          }
        }
      `;
      const options = {
        filename,
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      new Parser(options).walk().on('prop', (prop) => {
        expect(prop.name).toBe('value');
        expect(prop.describeModel).toBeTruthy();
        done();
      });
    });

    it('should successfully emit generic prop declared in array', (done) => {
      const filename = './fixtures/checkbox.vue';
      const script = `
        export default {
          props: ['id']
        }
      `;
      const options = {
        filename,
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      new Parser(options).walk().on('prop', (prop) => {
        expect(prop.visibility).toBe('public');
        expect(prop.name).toBe('id');
        expect(prop.type).toBe('unknown');
        expect(prop.description).toBeUndefined();
        expect(prop.keywords).toEqual([]);
        expect(prop.value).toBeUndefined();
        expect(prop.describeModel).toBeFalsy();
        done();
      });
    });

    it('should successfully emit prop with multiple types (array syntax)', (done) => {
      const script = `
        export default {
          props: {
            opacityA: [Boolean, Number]
          }
        }
      `;
      const options = {
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      new Parser(options).walk().on('prop', (prop) => {
        expect(prop).toEqual({
          kind: 'prop',
          name: 'opacity-a',
          type: ['Boolean', 'Number'],
          visibility: 'public',
          category: undefined,
          description: undefined,
          required: false,
          describeModel: false,
          keywords: [],
          default: undefined,
        });

        done();
      });
    });

    it('should successfully emit prop with multiple types (object syntax)', (done) => {
      const script = `
        export default {
          props: {
            opacityO: {
              type: [Boolean, Number]
            }
          }
        }
      `;
      const options = {
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      new Parser(options).walk().on('prop', (prop) => {
        expect(prop).toEqual({
          kind: 'prop',
          name: 'opacity-o',
          type: ['Boolean', 'Number'],
          visibility: 'public',
          category: undefined,
          description: undefined,
          required: false,
          describeModel: false,
          keywords: [],
          default: undefined,
        });

        done();
      });
    });

    it('should successfully emit a data item from an component.data object', (done) => {
      const filename = './fixtures/checkbox.vue';
      const script = `
        export default {
          data: {
            /**
             * ID data
             */
            id: 12
          }
        }
      `;
      const options = {
        filename,
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      const expected = {
        kind: 'data',
        keywords: [],
        category: undefined,
        version: undefined,
        visibility: 'public',
        description: 'ID data',
        initialValue: '12',
        type: 'number',
        name: 'id',
      };

      new Parser(options).walk().on('data', (entry) => {
        expect(entry).toEqual(expected);
        done();
      });
    });

    it('should successfully emit a data item from an component.data arrow function', (done) => {
      const filename = './fixtures/checkbox.vue';
      const script = `
        export default {
          data: () => ({
            /**
              * Enabled data
              */
            enabled: false
          })
        }
      `;
      const options = {
        filename,
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      const expected = {
        kind: 'data',
        keywords: [],
        category: undefined,
        version: undefined,
        visibility: 'public',
        description: 'Enabled data',
        initialValue: 'false',
        type: 'boolean',
        name: 'enabled',
      };

      new Parser(options).walk().on('data', (entry) => {
        expect(entry).toEqual(expected);
        done();
      });
    });

    it('should successfully emit a data item from an component.data es5 function', (done) => {
      const filename = './fixtures/checkbox.vue';
      const script = `
        export default {
          data: function () {
            return {
              /**
                * ID data
                */
              id: 'Hello'
            }
          }
        }
      `;
      const options = {
        filename,
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      const expected = {
        kind: 'data',
        keywords: [],
        category: undefined,
        version: undefined,
        visibility: 'public',
        description: 'ID data',
        initialValue: '"Hello"',
        type: 'string',
        name: 'id',
      };

      new Parser(options).walk().on('data', (entry) => {
        expect(entry).toEqual(expected);
        done();
      });
    });

    it('should successfully emit a data item from an component.data es6 function', (done) => {
      const filename = './fixtures/checkbox.vue';
      const script = `
        export default {
          data () {
            return {
              /**
                * ID data
                */
              id: 'Hello'
            }
          }
        }
      `;
      const options = {
        filename,
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      const expected = {
        kind: 'data',
        keywords: [],
        category: undefined,
        version: undefined,
        visibility: 'public',
        description: 'ID data',
        initialValue: '"Hello"',
        type: 'string',
        name: 'id',
      };

      new Parser(options).walk().on('data', (entry) => {
        expect(entry).toEqual(expected);
        done();
      });
    });

    it('should successfully emit a computed property item', (done) => {
      const filename = './fixtures/checkbox.vue';
      const script = `
        export default {
          computed: {
            /**
              * ID computed prop
              *
              * @private
              */
            id () {
              const value = this.value
              return this.name + value
            }
          }
        }
      `;
      const options = {
        filename,
        ignoredVisibilities: ['protected'],
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      const expected = {
        name: 'id',
        type: 'unknown',
        keywords: [],
        visibility: 'private',
        description: 'ID computed prop',
        category: undefined,
        version: undefined,
        dependencies: ['value', 'name'],
      };

      new Parser(options).walk().on('computed', (prop) => {
        expect(prop.name).toBe(expected.name);
        expect(prop.keywords).toEqual(expected.keywords);
        expect(prop.visibility).toBe(expected.visibility);
        expect(prop.description).toBe(expected.description);
        expect(prop.value).toBeUndefined();
        expect(prop.dependencies).toEqual(expected.dependencies);
        done();
      });
    });

    it('should successfully emit a computed property item with a getter', (done) => {
      const filename = './fixtures/checkbox.vue';
      const script = `
        export default {
          computed: {
            /**
              * ID computed prop
              */
            idGetter: {
              get () {
                const value = this.value
                return this.name + value
              }
            }
          }
        }
      `;
      const options = {
        filename,
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };
      const expected = {
        name: 'idGetter',
        kind: 'computed',
        type: 'unknown',
        category: undefined,
        version: undefined,
        keywords: [],
        visibility: 'public',
        description: 'ID computed prop',
        dependencies: ['value', 'name'],
      };

      new Parser(options).walk().on('computed', (prop) => {
        expect(prop).toEqual(expected);
        done();
      });
    });

    it('should ignore functions other than get on computed property', (done) => {
      const filename = './fixtures/checkbox.vue';
      const script = `
        export default {
          computed: {
            /**
              * ID computed prop
              */
            idGetter: {
              foo () {
                const value = this.value
                return this.name + value
              }
            }
          }
        }
      `;
      const options = {
        filename,
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      new Parser(options).walk().on('computed', (prop) => {
        expect(prop.dependencies).toEqual([]);
        done();
      });
    });

    it('shouldn\'t emit an unknow item (object)', (done) => {
      const filename = './fixtures/checkbox.vue';
      const script = `
        export default {
          unknow: {
            /**
              * @model v-model keyword
              */
            value: { type: String }
          }
        }
      `;
      const options = {
        filename,
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      /* eslint-disable no-unused-vars */
      new Parser(options).walk()
        .on('unknown', (prop) => {
          throw new Error('Should ignore unknow entry');
        })
        .on('end', done);
    });

    it('shouldn\'t emit an unknow item (array)', (done) => {
      const filename = './fixtures/checkbox.vue';
      const script = `
        export default {
          unknow: [
            /**
              * @id id keyword
              */
            'id'
          ]
        }
      `;
      const options = {
        filename,
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      new Parser(options).walk()
        .on('unknown', (prop) => {
          throw new Error('Should ignore unknow entry');
        })
        .on('end', done);
    });

    it('should successfully emit methods', (done) => {
      const filename = './fixtures/checkbox.vue';
      const script = `
        export default {
          methods: {
            getValue: (ctx) => {}
          }
        }
      `;
      const options = {
        filename,
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      new Parser(options).walk().on('method', (prop) => {
        expect(prop.visibility).toBe('public');
        expect(prop.name).toBe('getValue');
        expect(prop.description).toBeUndefined();
        expect(prop.keywords).toEqual([]);
        expect(prop.params).toEqual([
          {
            name: 'ctx',
            type: 'unknown',
            defaultValue: undefined,
            description: undefined,
            rest: false,
          },
        ]);

        done();
      });
    });

    it('should emit nothing', (done) => {
      const script = `
        export default {
          description: 'desc-v'
        }
      `;
      const options = {
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      const parser = new Parser(options);

      events.forEach((event) => parser.on(event, () => {
        done(new Error(`should not emit ${event} event`));
      }));

      parser.walk().on('end', () => done());
    });

    it('should emit event without description', (done) => {
      const script = `
        export default {
          mounted: () => {
            this.$emit('loading', true)
          }
        }
      `;
      const options = {
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      new Parser(options).walk().on('event', (event) => {
        expect(event.name).toBe('loading');
        expect(event.description).toBeUndefined();
        expect(event.visibility).toBe('public');
        expect(event.keywords).toEqual([]);
        done();
      });
    });

    it('should emit event with description', (done) => {
      const script = `
        export default {
          created: () => {
            /**
             * loading event
             *
             * @protected
             */
            this.$emit('loading', true)
          }
        }
      `;
      const options = {
        ignoredVisibilities: ['private'],
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      new Parser(options).walk().on('event', (event) => {
        expect(event.name).toBe('loading');
        expect(event.description).toBe('loading event');
        expect(event.visibility).toBe('protected');
        expect(event.keywords).toEqual([]);
        done();
      });
    });

    it('should emit event with @event keyword', (done) => {
      const script = `
        export default {
          created () {
            /**
             * Event description
             *
             * @event loading
             */
            this.$emit(name, true)
          }
        }
      `;
      const options = {
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      new Parser(options).walk().on('event', (event) => {
        expect(event.name).toBe('loading');
        expect(event.description).toBe('Event description');
        expect(event.visibility).toBe('public');
        expect(event.keywords).toEqual([]);
        done();
      });
    });

    it('should emit event with identifier name', (done) => {
      const script = `
        export default {
          beforeRouteEnter: (to, from, next) => {
            const name = 'loading'
            /**
             * loading event
             */
            this.$emit(name, true)
          }
        }
      `;
      const options = {
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      new Parser(options).walk().on('event', (event) => {
        expect(event.name).toBe('loading');
        expect(event.description).toBe('loading event');
        expect(event.visibility).toBe('public');
        expect(event.keywords).toEqual([]);
        done();
      });
    });

    it('should emit event with recursive identifier name', (done) => {
      const script = `
        export default {
          mounted: () => {
            const pname = 'loading'
            const value = true
            const name = pname
            /**
              * loading event
              * @protected
              */
            this.$emit(name, true)
          }
        }
      `;
      const options = {
        ignoredVisibilities: ['private'],
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      new Parser(options).walk().on('event', (event) => {
        expect(event.name).toBe('loading');
        expect(event.description).toBe('loading event');
        expect(event.visibility).toBe('protected');
        expect(event.keywords).toEqual([]);
        done();
      });
    });

    it('should emit event with external identifier name', (done) => {
      const script = `
        const ppname = 'loading'

        export default {
          created: () => {
            const pname = ppname
            const name = pname
            /**
              * loading event
              */
            this.$emit(name, true)
          }
        }
      `;
      const options = {
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      new Parser(options).walk().on('event', (event) => {
        expect(event.name).toBe('loading');
        expect(event.description).toBe('loading event');
        expect(event.visibility).toBe('public');
        expect(event.keywords).toEqual([]);
        done();
      });
    });

    it('should failed to found identifier name', (done) => {
      const script = `
        export default {
          created: () => {
            const pname = ppname
            const name = pname
            /**
              * loading event
              */
            this.$emit(name, true)
          }
        }
      `;
      const options = {
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      new Parser(options).walk().on('event', (event) => {
        expect(event.name).toBe('ppname');
        expect(event.description).toBe('loading event');
        expect(event.visibility).toBe('public');
        expect(event.keywords).toEqual([]);
        done();
      });
    });

    it('should skip already sent event', (done) => {
      const script = `
        export default {
          created () {
            this.$emit('loading')
          },
          mounted: () => {
            this.$emit('loading', true)
          }
        }
      `;
      const options = {
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      let eventCount = 0;

      new Parser(options).walk()
        .on('event', (event) => {
          expect(event.name).toBe('loading');

          eventCount++;
        })
        .on('end', () => {
          expect(eventCount).toBe(1);

          done();
        });
    });

    it('should skip malformated event emission', (done) => {
      const script = `
        export default {
          loading2: () => {
            this.$emit
          }
        }
      `;
      const options = {
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      let eventCount = 0;

      new Parser(options).walk()
        .on('event', () => eventCount++)
        .on('end', () => {
          expect(eventCount).toBe(0);

          done();
        });
    });

    it('should ignore the component events with missing `events` in options.features', (done) => {
      const script = `
        export default {
          created: () => {
            this.$emit('loading')
          },
          mounted: () => {
            this.$emit('loading', true)
          }
        }
      `;
      const options = {
        features: ['name'],
        source: {
          script: {
            attrs: {
              lang: 'js',
            },
            content: script,
          },
        },
      };

      new Parser(options).walk()
        .on('event', (e) => {
          throw new Error('Should ignore the component events');
        })
        .on('end', done);
    });
  });
});
