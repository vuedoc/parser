const assert = require('assert')
const { Parser } = require('../lib/parser/Parser')

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
`

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
`

const events = [
  'name', 'description', 'keywords',
  'prop', 'data', 'computed', 'method',
  'event', 'slot'
]

describe('Parser', () => {
  describe('validateOptions(options)', () => {
    it('should failed with missing options.source', () => {
      const options = {}

      assert.throws(() => Parser.validateOptions(options), /options.source is required/)
    })

    it('should successfully parse options', () => {
      const options = { source: {} }

      assert.doesNotThrow(() => Parser.validateOptions(options))
    })

    it('should parse with an invalid type of options.features', () => {
      const options = { source: {}, features: 'events' }

      assert.throws(() => Parser.validateOptions(options),
        /options\.features must be an array/)
    })

    it('should parse with an invalid options.features', () => {
      const options = { source: {}, features: [ 'invalid-feature' ] }

      assert.throws(() => Parser.validateOptions(options),
        /Unknow 'invalid-feature' feature\. Supported features:/)
    })

    it('should parse with a valid options.features', () => {
      const options = { source: {}, features: [ 'name', 'events' ] }

      assert.doesNotThrow(() => Parser.validateOptions(options))
    })
  })

  describe('getEventName(feature)', () => {
    it('should succed with a singular name', () => {
      const feature = 'name'
      const expected = feature

      assert.equal(Parser.getEventName(feature), expected)
    })

    it('should succed with a plural name', () => {
      const feature = 'methods'
      const expected = 'method'

      assert.equal(Parser.getEventName(feature), expected)
    })
  })

  describe('constructor(options)', () => {
    it('should successfully create new object', () => {
      const filename = './fixtures/checkbox.vue'
      const defaultMethodVisibility = 'public'
      const options = {
        source: { script, template },
        filename,
        defaultMethodVisibility
      }

      const parser = new Parser(options)

      expect(parser.options.source.template).toBe(template)
      expect(parser.options.source.script).toBe(script)
      expect(parser.options.defaultMethodVisibility).toBe(defaultMethodVisibility)
      expect(parser.scope).toEqual({})
    })

    it('should successfully create new object with missing script', () => {
      const options = {
        source: { template }
      }

      const parser = new Parser(options)

      assert.equal(parser.options.source.script, null)
      assert.equal(parser.options.source.template, template)
    })

    it('should successfully create new object with empty script', () => {
      const options = {
        source: { template, script: '' }
      }

      const parser = new Parser(options)

      assert.equal(parser.options.source.script, '')
      assert.equal(parser.options.source.template, template)
    })
  })

  describe('walk()', () => {
    it('should successfully create new object', (done) => {
      const filename = './fixtures/checkbox.vue'
      const defaultMethodVisibility = 'public'
      const options = {
        source: { script, template },
        filename,
        defaultMethodVisibility
      }

      const parser = new Parser(options)

      parser.on('end', done)
      parser.walk()
    })

    describe('features.length === 0', () => {
      it('should ignore all features', (done) => {
        const options = { source: { script }, features: [] }
        const parser = new Parser(options)

        const walker = parser.walk().on('end', done)

        Parser.SUPPORTED_FEATURES.forEach((feature) => {
          walker.on(feature, () => {
            throw new Error(`Should ignore the component '${feature}' feature`)
          })
        })
      })
    })

    describe('description', () => {
      const script = `
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
      `

      it('should successfully emit component description', (done) => {
        const options = { source: { script } }

        new Parser(options).walk().on('description', ({ value }) => {
          assert.equal(value, 'Component description\non multiline\n\nwith preserve\n\n\nwhitespaces')

          done()
        })
      })

      it('should ignore the component description with missing `description` in options.features', (done) => {
        const filename = './fixtures/checkbox.vue'
        const options = {
          source: { script },
          filename,
          features: [ 'name' ]
        }

        new Parser(options).walk()
          .on('description', () => {
            throw new Error('Should ignore the component description')
          })
          .on('end', done)
      })
    })

    describe('keywords', () => {
      it('should successfully emit component keywords by ignoring name, slot and mixin', (done) => {
        const script = `
          /**
           * @name my-checkbox
           * @mixin
           * @slot default slot
           * @since 1.0.0
           */
          export default {}
        `

        const options = { source: { script } }

        new Parser(options).walk().on('keywords', ({ value }) => {
          expect(value).toEqual([ { name: 'since', description: '1.0.0' } ])
          done()
        })
      })

      it('should ignore the component keywords with missing `keywords` in options.features', (done) => {
        const filename = './fixtures/checkbox.vue'
        const script = `
          /**
           * @name my-checkbox
           * @since 1.0.0
           */
          export default {}
        `
        const options = {
          source: { script },
          filename,
          features: [ 'name' ]
        }

        new Parser(options).walk()
          .on('keywords', () => done(new Error('Should ignore the component keywords')))
          .on('end', done)
      })
    })

    describe('export default expression', () => {
      it('should successfully emit component name', (done) => {
        const script = `
          import child from 'child.vue'

          const component = {
            name: 'hello'
          }

          export default component
        `
        const options = { source: { script } }

        new Parser(options).walk().on('name', ({ value }) => {
          assert.equal(value, 'hello')
          done()
        })
      })

      it('should failed with missing exporting identifier', (done) => {
        const script = `
          export default component
        `
        const options = { source: { script } }

        new Parser(options).walk().on('end', () => done())
      })

      it('should not fail when there is a top-level non-assignment expression', (done) => {
        const script = `
          import library from 'library'

          library.init()

          const component = {
            name: 'hello'
          }

          export default component
        `
        const options = { source: { script } }

        new Parser(options).walk().on('name', ({ value }) => {
          assert.equal(value, 'hello')
          done()
        })
      })
    })

    describe('parseTemplate()', () => {
      it('should successfully emit default slot', (done) => {
        const filename = './fixtures/checkbox.vue'
        const defaultMethodVisibility = 'public'
        const template = '<slot/>'
        const options = {
          source: { template },
          filename,
          defaultMethodVisibility
        }

        new Parser(options).walk().on('slot', (slot) => {
          assert.equal(slot.name, 'default')
          assert.equal(slot.description, '')
          done()
        })
      })

      it('should successfully emit default slot with description', (done) => {
        const filename = './fixtures/checkbox.vue'
        const defaultMethodVisibility = 'public'
        const template = `
          <div>
            <!-- a comment -->
            <p>Hello</p>
            <!-- this comment will be ignored -->
            <!-- default slot -->
            <slot/>
          </div>
        `
        const options = {
          source: { template },
          filename,
          defaultMethodVisibility
        }

        new Parser(options).walk().on('slot', (slot) => {
          assert.equal(slot.name, 'default')
          assert.equal(slot.description, 'default slot')
          done()
        })
      })

      it('should ignore the component slots with missing `slots` in options.features', (done) => {
        const filename = './fixtures/checkbox.vue'
        const template = `
          <div>
            <!-- a comment -->
            <p>Hello</p>
            <!-- default slot -->
            <slot/>
          </div>
        `
        const options = {
          source: { template },
          filename,
          features: [ 'name' ]
        }

        new Parser(options).walk()
          .on('slot', () => {
            throw new Error('Should ignore the component slots')
          })
          .on('end', done)
      })

      it('should successfully emit defining template event with v-on: prefix', (done) => {
        const template = `
          <div>
            <input
              type="text"
              v-on:input="$emit('input', $event)"/>
          </div>
        `
        const options = {
          source: { template },
          filename: './fixtures/checkbox.vue',
          features: [ 'events' ]
        }

        new Parser(options).walk()
          .on('event', (event) => {
            assert.equal(event.name, 'input')
            assert.equal(event.description, '')
            assert.equal(event.visibility, 'public')
            assert.deepEqual(event.keywords, [])
            done()
          })
      })

      it('should successfully emit defining template event with v-on: prefix and a description', (done) => {
        const template = `
          <div>
            <!-- Emit the input event -->
            <input
              type="text"
              v-on:input="$emit('input', $event)"/>
          </div>
        `
        const options = {
          source: { template },
          filename: './fixtures/checkbox.vue',
          features: [ 'events' ]
        }

        new Parser(options).walk()
          .on('event', (event) => {
            assert.equal(event.name, 'input')
            assert.equal(event.description, 'Emit the input event')
            assert.equal(event.visibility, 'public')
            assert.deepEqual(event.keywords, [])
            done()
          })
      })

      it('should successfully emit defining template event with v-on: prefix and a visibility', (done) => {
        const template = `
          <div>
            <!-- @private -->
            <input
              type="text"
              v-on:input="$emit('input', $event)"/>
          </div>
        `
        const options = {
          source: { template },
          filename: './fixtures/checkbox.vue',
          features: [ 'events' ]
        }

        new Parser(options).walk()
          .on('event', (event) => {
            assert.equal(event.name, 'input')
            assert.equal(event.description, '')
            assert.equal(event.visibility, 'private')
            assert.deepEqual(event.keywords, [])
            done()
          })
      })

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
        `
        const options = {
          source: { template },
          filename: './fixtures/checkbox.vue',
          features: [ 'events' ]
        }

        new Parser(options).walk()
          .on('event', (event) => {
            assert.equal(event.name, 'input')
            assert.equal(event.description, 'Emit the input event')
            assert.equal(event.visibility, 'protected')
            assert.deepEqual(event.keywords, [
              { name: 'value', description: 'A input value' }
            ])
            done()
          })
      })

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
        `
        const options = {
          source: { template },
          filename: './fixtures/checkbox.vue',
          features: [ 'events' ]
        }

        new Parser(options).walk()
          .on('event', (event) => {
            assert.equal(event.name, 'input')
            assert.equal(event.description, 'Emit the input event')
            assert.equal(event.visibility, 'protected')
            assert.deepEqual(event.keywords, [
              { name: 'value', description: 'A input value' }
            ])
            done()
          })
      })

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
        `
        const options = {
          source: { template },
          filename: './fixtures/checkbox.vue',
          features: [ 'events' ]
        }

        const expected = [
          { kind: 'event',
            name: 'input',
            category: null,
            arguments: [],
            visibility: 'protected',
            description: 'Emit the input event',
            keywords:
            [ { name: 'value', description: 'A input value' } ] },
          { kind: 'event',
            name: 'change',
            category: null,
            arguments: [],
            visibility: 'protected',
            description: 'Emit the input event',
            keywords:
            [ { name: 'value', description: 'A input value' } ] }
        ]

        const result = []

        new Parser(options).walk()
          .on('event', (event) => result.push(event))
          .on('end', () => {
            expect(result).toEqual(expected)
            done()
          })
      })
    })

    describe('parseKeywords()', () => {
      [ 'arg', 'prop', 'param', 'argument' ].forEach((tag) => {
        it(`should successfully emit param with @${tag}`, (done) => {
          const filename = './fixtures/checkbox.vue'
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
          `
          const options = { source: { script }, filename }
          const expected = [
            {
              type: 'number',
              name: 'x',
              description: 'The x value.',
              defaultValue: undefined,
              rest: false
            }
          ]

          new Parser(options).walk().on('method', (method) => {
            assert.equal(method.name, 'getX')
            assert.equal(method.description, 'Get the x value.')
            assert.deepEqual(method.params, expected)
            done()
          })
        })
      });

      it('should successfully emit param with parameter\'s properties', (done) => {
        const filename = './fixtures/checkbox.vue'
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
        `
        const options = { source: { script }, filename }
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
            rest: false }
        ]

        new Parser(options).walk().on('method', (method) => {
          assert.equal(method.name, 'assign')
          assert.equal(method.description, 'Assign the project to an employee.')
          assert.deepEqual(method.params, expected)
          done()
        })
      })

      it('should successfully emit param with array type', (done) => {
        const filename = './fixtures/checkbox.vue'
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
        `
        const options = { source: { script }, filename }
        const expected = [
          {
            type: 'Object[]',
            name: 'employees',
            description: 'The employees who are responsible for the project.',
            defaultValue: undefined,
            rest: false }
        ]

        new Parser(options).walk().on('method', (method) => {
          assert.equal(method.name, 'assign')
          assert.equal(method.description, 'Assign the project to a list of employees.')
          assert.deepEqual(method.params, expected)
          done()
        })
      })

      it('should successfully emit param with properties of values in an array', (done) => {
        const filename = './fixtures/checkbox.vue'
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
        `
        const options = { source: { script }, filename }
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
            rest: false }
        ]

        new Parser(options).walk().on('method', (method) => {
          assert.equal(method.name, 'assign')
          assert.equal(method.description, 'Assign the project to a list of employees.')
          assert.deepEqual(method.params, expected)
          done()
        })
      })

      it('should successfully emit optional param', (done) => {
        const filename = './fixtures/checkbox.vue'
        const script = `
          export default {
            methods: {
              /**
               * @param {string} [somebody] - Somebody's name.
               */
              sayHello (somebody) {}
            }
          }
        `
        const options = { source: { script }, filename }
        const expected = [
          {
            type: 'string',
            name: 'somebody',
            description: 'Somebody\'s name.',
            optional: true,
            defaultValue: undefined,
            rest: false
          }
        ]

        new Parser(options).walk().on('method', (method) => {
          assert.equal(method.name, 'sayHello')
          assert.equal(method.description, '')
          assert.deepEqual(method.params, expected)
          done()
        })
      })

      it('should successfully emit optional parameter (using Google Closure Compiler syntax)', (done) => {
        const filename = './fixtures/checkbox.vue'
        const script = `
          export default {
            methods: {
              /**
               * @param {string} [somebody=] - Somebody's name.
               */
              sayHello (somebody) {}
            }
          }
        `
        const options = { source: { script }, filename }
        const expected = [
          {
            type: 'string',
            name: 'somebody',
            description: 'Somebody\'s name.',
            defaultValue: undefined,
            optional: true,
            rest: false
          }
        ]

        new Parser(options).walk().on('method', (method) => {
          assert.equal(method.name, 'sayHello')
          assert.equal(method.description, '')
          assert.deepEqual(method.params, expected)
          done()
        })
      })

      it('should successfully emit optional param and one type OR another type (type union)', (done) => {
        const filename = './fixtures/checkbox.vue'
        const script = `
          export default {
            methods: {
              /**
               * @param {(string|string[])} [somebody=John Doe] - Somebody's name, or an array of names.
               */
              sayHello (somebody) {}
            }
          }
        `
        const options = { source: { script }, filename }
        const expected = [
          {
            type: [ 'string', 'string[]' ],
            name: 'somebody',
            description: 'Somebody\'s name, or an array of names.',
            optional: true,
            defaultValue: 'John Doe',
            rest: false
          }
        ]

        new Parser(options).walk().on('method', (method) => {
          assert.equal(method.name, 'sayHello')
          assert.equal(method.description, '')
          assert.deepEqual(method.params, expected)
          done()
        })
      })

      it('should successfully emit optional param and default value', (done) => {
        const filename = './fixtures/checkbox.vue'
        const script = `
          export default {
            methods: {
              /**
               * @param {string} [somebody=John Doe] - Somebody's name.
              */
              sayHello (somebody) {}
            }
          }
        `
        const options = { source: { script }, filename }
        const expected = [
          {
            type: 'string',
            name: 'somebody',
            description: 'Somebody\'s name.',
            optional: true,
            defaultValue: 'John Doe',
            rest: false
          }
        ]

        new Parser(options).walk().on('method', (method) => {
          assert.equal(method.name, 'sayHello')
          assert.equal(method.description, '')
          assert.deepEqual(method.params, expected)
          done()
        })
      })

      it('should successfully emit param in a event', (done) => {
        const filename = './fixtures/checkbox.vue'
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
        `
        const options = { source: { script }, filename }
        const expected = [
          { type: 'number',
            name: 'x',
            description: 'The x value.',
            rest: false }
        ]

        new Parser(options).walk().on('event', (event) => {
          assert.equal(event.name, 'input')
          assert.equal(event.description, 'Emit the x value.')
          assert.deepEqual(event.arguments, expected)
          done()
        })
      })

      it('should successfully emit return', (done) => {
        const filename = './fixtures/checkbox.vue'
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
        `
        const options = { source: { script }, filename }
        const expected = {
          type: 'number',
          description: 'The x value.'
        }

        new Parser(options).walk().on('method', (method) => {
          assert.equal(method.name, 'getX')
          assert.equal(method.description, 'Get the x value.')
          assert.deepEqual(method.returns, expected)
          done()
        })
      })

      it('should successfully emit alias @returns', (done) => {
        const filename = './fixtures/checkbox.vue'
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
        `
        const options = { source: { script }, filename }
        const expected = {
          type: 'number',
          description: 'The x value.'
        }

        new Parser(options).walk().on('method', (method) => {
          assert.equal(method.name, 'getX')
          assert.equal(method.description, 'Get the x value.')
          assert.deepEqual(method.returns, expected)
          done()
        })
      })

      it('should successfully emit return with array type', (done) => {
        const filename = './fixtures/checkbox.vue'
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
        `
        const options = { source: { script }, filename }
        const expected = {
          type: 'number[]',
          description: 'The x values.'
        }

        new Parser(options).walk().on('method', (method) => {
          assert.equal(method.name, 'getX')
          assert.equal(method.description, 'Get the x values.')
          assert.deepEqual(method.returns, expected)
          done()
        })
      })

      it('should successfully emit return with one type OR another returning type (type union)', (done) => {
        const filename = './fixtures/checkbox.vue'
        const script = `
          export default {
            methods: {
              /**
               * @return {(string| string[])} The x values.
               */
              getX () {}
            }
          }
        `
        const options = { source: { script }, filename }
        const expected = {
          type: [ 'string', 'string[]' ],
          description: 'The x values.'
        }

        new Parser(options).walk().on('method', (method) => {
          assert.equal(method.name, 'getX')
          assert.deepEqual(method.returns, expected)
          done()
        })
      })
    })

    describe('parseComponentName()', () => {
      it('should successfully emit component name with only template', (done) => {
        const filename = './fixtures/checkbox.vue'
        const defaultMethodVisibility = 'private'
        const template = `
          <div>
            <!-- a comment -->
            <p>Hello</p>
          </div>
        `
        const options = {
          source: { template },
          filename,
          defaultMethodVisibility
        }

        new Parser(options).walk().on('name', ({ value }) => {
          assert.equal(value, 'checkbox')
          done()
        })
      })

      it('should successfully emit component name with explicit name', (done) => {
        const filename = './fixtures/checkbox.vue'
        const defaultMethodVisibility = 'private'
        const script = `
          export default {
            name: 'myInput'
          }
        `
        const options = {
          source: { script },
          filename,
          defaultMethodVisibility
        }

        new Parser(options).walk().on('name', ({ value }) => {
          assert.equal(value, 'myInput')
          done()
        })
      })

      it('should ignore the component name with missing `name` in options.features', (done) => {
        const filename = './fixtures/checkbox.vue'
        const script = `
          export default {
            name: 'myInput'
          }
        `
        const options = {
          source: { script },
          filename,
          features: [ 'description' ]
        }

        new Parser(options).walk()
          .on('name', () => {
            throw new Error('Should ignore the component name')
          })
          .on('end', done)
      })

      it('should ignore the component name with missing `name` in options.features and options.source.script', (done) => {
        const filename = './fixtures/checkbox.vue'
        const template = `
          <div>
            <!-- a comment -->
            <p>Hello</p>
          </div>
        `
        const options = {
          source: { template },
          filename,
          features: [ 'description' ]
        }

        new Parser(options).walk()
          .on('name', () => {
            throw new Error('Should ignore the component name')
          })
          .on('end', done)
      })
    })

    describe('should successfully emit model', () => {
      it('with all fields set', (done) => {
        const script = `
          export default {
            model: {
              prop: 'model',
              event: 'change'
            }
          }
        `
        const options = {
          source: { script }
        }

        new Parser(options).walk().on('model', (model) => {
          expect(model).toEqual({
            kind: 'model',
            prop: 'model',
            event: 'change',
            description: '',
            visibility: 'public',
            keywords: []
          })
          done()
        })
      })

      it('with only model.prop', (done) => {
        const script = `
          export default {
            model: {
              prop: 'model'
            }
          }
        `
        const options = {
          source: { script }
        }

        new Parser(options).walk().on('model', (model) => {
          expect(model).toEqual({
            kind: 'model',
            prop: 'model',
            event: 'input',
            description: '',
            visibility: 'public',
            keywords: []
          })
          done()
        })
      })

      it('with only model.event', (done) => {
        const script = `
          export default {
            model: {
              event: 'change'
            }
          }
        `
        const options = {
          source: { script }
        }

        new Parser(options).walk().on('model', (model) => {
          expect(model).toEqual({
            kind: 'model',
            prop: 'value',
            event: 'change',
            description: '',
            visibility: 'public',
            keywords: []
          })
          done()
        })
      })

      it('with empty object', (done) => {
        const script = `
          export default {
            model: {}
          }
        `
        const options = {
          source: { script }
        }

        new Parser(options).walk().on('model', (model) => {
          expect(model).toEqual({
            kind: 'model',
            prop: 'value',
            event: 'input',
            description: '',
            visibility: 'public',
            keywords: []
          })
          done()
        })
      })
    })

    it('should successfully emit generic prop', (done) => {
      const filename = './fixtures/checkbox.vue'
      const defaultMethodVisibility = 'public'
      const script = `
        export default {
          props: {
            id: { type: String, default: '$id' }
          }
        }
      `
      const options = {
        source: { script },
        filename,
        defaultMethodVisibility
      }

      new Parser(options).walk().on('prop', (prop) => {
        assert.equal(prop.visibility, 'public')
        assert.equal(prop.name, 'id')
        assert.equal(prop.default, '$id')
        assert.equal(prop.type, 'String')
        assert.equal(prop.description, '')
        assert.equal(prop.required, false)
        assert.deepEqual(prop.keywords, [])
        done()
      })
    })

    it('should successfully emit v-model prop', (done) => {
      const filename = './fixtures/checkbox.vue'
      const defaultMethodVisibility = 'public'
      const script = `
        export default {
          props: {
            /**
              * @model v-model keyword. Keyword description is ignored
              */
            value: { type: String }
          }
        }
      `
      const options = {
        source: { script },
        filename,
        defaultMethodVisibility
      }

      new Parser(options).walk().on('prop', (prop) => {
        assert.equal(prop.visibility, 'public')
        assert.equal(prop.name, 'value')
        assert.equal(prop.describeModel, true)
        assert.equal(prop.description, '')
        assert.deepEqual(prop.keywords, [])
        assert.deepEqual(prop.type, 'String')
        done()
      })
    })

    it('should successfully emit v-model prop with the model field', (done) => {
      const filename = './fixtures/checkbox.vue'
      const defaultMethodVisibility = 'public'
      const script = `
        export default {
          model: {
            prop: 'checked'
          },
          props: {
             checked: { type: String }
          }
        }
      `
      const options = {
        source: { script },
        filename,
        defaultMethodVisibility
      }

      new Parser(options).walk().on('prop', (prop) => {
        assert.equal(prop.visibility, 'public')
        assert.equal(prop.name, 'checked')
        assert.equal(prop.description, '')
        assert.equal(prop.describeModel, true)
        assert.equal(prop.type, 'String')
        assert.deepEqual(prop.keywords, [])
        done()
      })
    })

    it('should successfully emit prop with truthy describeModel for prop.name === "value"', (done) => {
      const filename = './fixtures/checkbox.vue'
      const defaultMethodVisibility = 'public'
      const script = `
        export default {
          props: {
            value: { type: String }
          }
        }
      `
      const options = {
        source: { script },
        filename,
        defaultMethodVisibility
      }

      new Parser(options).walk().on('prop', (prop) => {
        assert.equal(prop.name, 'value')
        assert.equal(prop.describeModel, true)
        done()
      })
    })

    it('should successfully emit generic prop declared in array', (done) => {
      const filename = './fixtures/checkbox.vue'
      const defaultMethodVisibility = 'public'
      const script = `
        export default {
          props: ['id']
        }
      `
      const options = {
        source: { script },
        filename,
        defaultMethodVisibility
      }

      new Parser(options).walk().on('prop', (prop) => {
        assert.equal(prop.visibility, 'public')
        assert.equal(prop.name, 'id')
        assert.equal(prop.type, 'any')
        assert.equal(prop.description, '')
        assert.deepEqual(prop.keywords, [])
        assert.deepEqual(prop.value, null)
        assert.deepEqual(prop.describeModel, false)
        done()
      })
    })

    it('should successfully emit prop with multiple types (array syntax)', (done) => {
      const script = `
        export default {
          props: {
            opacityA: [Boolean, Number]
          }
        }
      `
      const options = {
        source: { script }
      }

      new Parser(options).walk().on('prop', (prop) => {
        expect(prop).toEqual({
          kind: 'prop',
          name: 'opacity-a',
          type: [ 'Boolean', 'Number' ],
          visibility: 'public',
          category: null,
          description: '',
          required: false,
          describeModel: false,
          keywords: [],
          default: undefined
        })

        done()
      })
    })

    it('should successfully emit prop with multiple types (object syntax)', (done) => {
      const script = `
        export default {
          props: {
            opacityO: {
              type: [Boolean, Number]
            }
          }
        }
      `
      const options = {
        source: { script }
      }

      new Parser(options).walk().on('prop', (prop) => {
        expect(prop).toEqual({
          kind: 'prop',
          name: 'opacity-o',
          type: [ 'Boolean', 'Number' ],
          visibility: 'public',
          category: null,
          description: '',
          required: false,
          describeModel: false,
          keywords: [],
          default: undefined
        })

        done()
      })
    })

    it('should successfully emit a data item from an component.data object', (done) => {
      const filename = './fixtures/checkbox.vue'
      const script = `
        export default {
          data: {
            /**
             * ID data
             */
            id: 12
          }
        }
      `
      const options = {
        source: { script },
        filename
      }

      const expected = {
        kind: 'data',
        keywords: [],
        category: null,
        visibility: 'public',
        description: 'ID data',
        initialValue: 12,
        type: 'number',
        name: 'id'
      }

      new Parser(options).walk().on('data', (prop) => {
        assert.deepEqual(prop, expected)
        done()
      })
    })

    it('should successfully emit a data item from an component.data arrow function', (done) => {
      const filename = './fixtures/checkbox.vue'
      const script = `
        export default {
          data: () => ({
            /**
              * Enabled data
              */
            enabled: false
          })
        }
      `
      const options = {
        source: { script },
        filename
      }

      const expected = {
        kind: 'data',
        keywords: [],
        category: null,
        visibility: 'public',
        description: 'Enabled data',
        initialValue: false,
        type: 'boolean',
        name: 'enabled'
      }

      new Parser(options).walk().on('data', (prop) => {
        assert.deepEqual(prop, expected)
        done()
      })
    })

    it('should successfully emit a data item from an component.data es5 function', (done) => {
      const filename = './fixtures/checkbox.vue'
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
      `
      const options = {
        source: { script },
        filename
      }

      const expected = {
        kind: 'data',
        keywords: [],
        category: null,
        visibility: 'public',
        description: 'ID data',
        initialValue: 'Hello',
        type: 'string',
        name: 'id'
      }

      new Parser(options).walk().on('data', (prop) => {
        assert.deepEqual(prop, expected)
        done()
      })
    })

    it('should successfully emit a data item from an component.data es6 function', (done) => {
      const filename = './fixtures/checkbox.vue'
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
      `
      const options = {
        source: { script },
        filename
      }

      const expected = {
        kind: 'data',
        keywords: [],
        category: null,
        visibility: 'public',
        description: 'ID data',
        initialValue: 'Hello',
        type: 'string',
        name: 'id'
      }

      new Parser(options).walk().on('data', (prop) => {
        assert.deepEqual(prop, expected)
        done()
      })
    })

    it('should successfully emit a computed property item', (done) => {
      const filename = './fixtures/checkbox.vue'
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
      `
      const options = {
        source: { script },
        filename
      }

      const expected = {
        name: 'id',
        keywords: [],
        visibility: 'private',
        description: 'ID computed prop',
        category: null,
        dependencies: [ 'value', 'name' ]
      }

      new Parser(options).walk().on('computed', (prop) => {
        assert.equal(prop.name, expected.name)
        assert.deepEqual(prop.keywords, expected.keywords)
        assert.equal(prop.visibility, expected.visibility)
        assert.equal(prop.description, expected.description)
        assert.equal(prop.value, undefined)
        assert.deepEqual(prop.dependencies, expected.dependencies)
        done()
      })
    })

    it('should successfully emit a computed property item with a getter', (done) => {
      const filename = './fixtures/checkbox.vue'
      const script = `
        export default {
          computed: {
            /**
              * ID computed prop
              *
              * @private
              */
            idGetter: {
              get () {
                const value = this.value
                return this.name + value
              }
            }
          }
        }
      `
      const options = {
        source: { script },
        filename
      }
      const expected = {
        name: 'idGetter',
        kind: 'computed',
        category: null,
        keywords: [],
        visibility: 'private',
        description: 'ID computed prop',
        dependencies: [ 'value', 'name' ]
      }

      new Parser(options).walk().on('computed', (prop) => {
        expect(prop).toEqual(expected)
        done()
      })
    })

    it('should ignore functions other than get on computed property', (done) => {
      const filename = './fixtures/checkbox.vue'
      const script = `
        export default {
          computed: {
            /**
              * ID computed prop
              *
              * @private
              */
            idGetter: {
              foo () {
                const value = this.value
                return this.name + value
              }
            }
          }
        }
      `
      const options = {
        source: { script },
        filename
      }

      new Parser(options).walk().on('computed', (prop) => {
        assert.deepEqual(prop.dependencies, [])
        done()
      })
    })

    it('shouldn\'t emit an unknow item (object)', (done) => {
      const filename = './fixtures/checkbox.vue'
      const defaultMethodVisibility = 'public'
      const script = `
        export default {
          unknow: {
            /**
              * @model v-model keyword
              */
            value: { type: String }
          }
        }
      `
      const options = {
        source: { script },
        filename,
        defaultMethodVisibility
      }

      /* eslint-disable no-unused-vars */
      new Parser(options).walk()
        .on('unknow', (prop) => {
          throw new Error('Should ignore unknow entry')
        })
        .on('end', done)
    })

    it('shouldn\'t emit an unknow item (array)', (done) => {
      const filename = './fixtures/checkbox.vue'
      const defaultMethodVisibility = 'public'
      const script = `
        export default {
          unknow: [
            /**
              * @id id keyword
              */
            'id'
          ]
        }
      `
      const options = {
        source: { script },
        filename,
        defaultMethodVisibility
      }

      new Parser(options).walk()
        .on('unknow', (prop) => {
          throw new Error('Should ignore unknow entry')
        })
        .on('end', done)
    })

    it('should successfully emit methods', (done) => {
      const filename = './fixtures/checkbox.vue'
      const defaultMethodVisibility = 'private'
      const script = `
        export default {
          methods: {
            getValue: (ctx) => {}
          }
        }
      `
      const options = {
        source: { script },
        filename,
        defaultMethodVisibility
      }

      new Parser(options).walk().on('method', (prop) => {
        assert.equal(prop.visibility, 'private')
        assert.equal(prop.name, 'getValue')
        assert.equal(prop.description, '')
        assert.deepEqual(prop.keywords, [])
        assert.deepEqual(prop.params, [
            {
              name: 'ctx',
              type: 'unknow',
              defaultValue: undefined,
              description: '',
              rest: false
            }
        ])

        done()
      })
    })

    it('should emit nothing', (done) => {
      const defaultMethodVisibility = 'private'
      const script = `
        export default {
          description: 'desc-v'
        }
      `
      const options = {
        source: { script },
        defaultMethodVisibility
      }

      const parser = new Parser(options)

      events.forEach((event) => parser.on(event, () => {
        done(new Error(`should not emit ${event} event`))
      }))

      parser.walk().on('end', () => done())
    })

    it('should emit event without description', (done) => {
      const defaultMethodVisibility = 'private'
      const script = `
        export default {
          mounted: () => {
            this.$emit('loading', true)
          }
        }
      `
      const options = {
        source: { script },
        defaultMethodVisibility
      }

      new Parser(options).walk().on('event', (event) => {
        assert.equal(event.name, 'loading')
        assert.equal(event.description, '')
        assert.equal(event.visibility, 'public')
        assert.deepEqual(event.keywords, [])
        done()
      })
    })

    it('should emit event with description', (done) => {
      const defaultMethodVisibility = 'private'
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
      `
      const options = {
        source: { script },
        defaultMethodVisibility
      }

      new Parser(options).walk().on('event', (event) => {
        assert.equal(event.name, 'loading')
        assert.equal(event.description, 'loading event')
        assert.equal(event.visibility, 'protected')
        assert.deepEqual(event.keywords, [])
        done()
      })
    })

    it('should emit event with @event keyword', (done) => {
      const defaultMethodVisibility = 'private'
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
      `
      const options = {
        source: { script },
        defaultMethodVisibility
      }

      new Parser(options).walk().on('event', (event) => {
        assert.equal(event.name, 'loading')
        assert.equal(event.description, 'Event description')
        assert.equal(event.visibility, 'public')
        assert.deepEqual(event.keywords, [])

        done()
      })
    })

    it('should emit event with identifier name', (done) => {
      const defaultMethodVisibility = 'private'
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
      `
      const options = {
        source: { script },
        defaultMethodVisibility
      }

      new Parser(options).walk().on('event', (event) => {
        assert.equal(event.name, 'loading')
        assert.equal(event.description, 'loading event')
        assert.equal(event.visibility, 'public')
        assert.deepEqual(event.keywords, [])
        done()
      })
    })

    it('should emit event with recursive identifier name', (done) => {
      const defaultMethodVisibility = 'private'
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
      `
      const options = {
        source: { script },
        defaultMethodVisibility
      }

      new Parser(options).walk().on('event', (event) => {
        assert.equal(event.name, 'loading')
        assert.equal(event.description, 'loading event')
        assert.equal(event.visibility, 'protected')
        assert.deepEqual(event.keywords, [])
        done()
      })
    })

    it('should emit event with external identifier name', (done) => {
      const defaultMethodVisibility = 'private'
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
      `
      const options = {
        source: { script },
        defaultMethodVisibility
      }

      new Parser(options).walk().on('event', (event) => {
        assert.equal(event.name, 'loading')
        assert.equal(event.description, 'loading event')
        assert.equal(event.visibility, 'public')
        assert.deepEqual(event.keywords, [])
        done()
      })
    })

    it('should failed to found identifier name', (done) => {
      const defaultMethodVisibility = 'private'
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
      `
      const options = {
        source: { script },
        defaultMethodVisibility
      }

      new Parser(options).walk().on('event', (event) => {
        assert.equal(event.name, '***unhandled***')
        assert.equal(event.description, 'loading event')
        assert.equal(event.visibility, 'public')
        assert.deepEqual(event.keywords, [])
        done()
      })
    })

    it('should skip already sent event', (done) => {
      const defaultMethodVisibility = 'private'
      const script = `
        export default {
          created () {
            this.$emit('loading')
          },
          mounted: () => {
            this.$emit('loading', true)
          }
        }
      `
      const options = {
        source: { script },
        defaultMethodVisibility
      }

      let eventCount = 0

      new Parser(options).walk()
        .on('event', (event) => {
          assert.equal(event.name, 'loading')

          eventCount++
        })
        .on('end', () => {
          assert.equal(eventCount, 1)

          done()
        })
    })

    it('should skip malformated event emission', (done) => {
      const defaultMethodVisibility = 'private'
      const script = `
        export default {
          loading2: () => {
            this.$emit
          }
        }
      `
      const options = {
        source: { script },
        defaultMethodVisibility
      }

      let eventCount = 0

      new Parser(options).walk()
        .on('event', () => eventCount++)
        .on('end', () => {
          assert.equal(eventCount, 0)

          done()
        })
    })

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
      `
      const options = {
        source: { script },
        features: [ 'name' ]
      }

      new Parser(options).walk()
        .on('event', (e) => {
          throw new Error('Should ignore the component events')
        })
        .on('end', done)
    })
  })
})
