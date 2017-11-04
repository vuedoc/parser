'use strict'

const Parser = require('../lib/parser')
const assert = require('assert')

/* global describe it */

const template = `
  <div>
    <input />
    <slot/>
  </div>
`

const script = `
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
  export default {}
  `

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
      const options = { source: {}, features: ['invalid-feature'] }

      assert.throws(() => Parser.validateOptions(options),
        /Unknow 'invalid-feature' feature\. Supported features:/)
    })

    it('should parse with a valid options.features', () => {
      const options = { source: {}, features: ['name', 'events'] }

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

      assert.notEqual(parser.ast, null)
      assert.equal(parser.template, template)
      assert.equal(parser.filename, filename)
      assert.equal(parser.defaultMethodVisibility, defaultMethodVisibility)
    })

    it('should successfully create new object with missing script', () => {
      const options = {
        source: { template }
      }
      const parser = new Parser(options)

      assert.equal(parser.ast, null)
      assert.equal(parser.template, template)
    })

    it('should successfully create new object with empty script', () => {
      const options = {
        source: { template, script: '' }
      }
      const parser = new Parser(options)

      assert.equal(parser.ast, null)
      assert.equal(parser.template, template)
    })
  })

  describe('walk()', () => {
    describe('features.length === 0', () => {
      const script = `
        /**
         * Component description
         * on multiline
         */
        export default {}
      `

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
         */
        export default {}
      `

      it('should successfully emit component description', (done) => {
        const options = { source: { script } }
        const parser = new Parser(options)

        parser.walk().on('description', (value) => {
          assert.equal(value, 'Component description on multiline')

          done()
        })
      })

      it('should ignore the component description with missing `description` in options.features', (done) => {
        const filename = './fixtures/checkbox.vue'
        const options = {
          source: { script },
          filename,
          features: ['name']
        }
        const parser = new Parser(options)

        parser.walk()
          .on('description', () => {
            throw new Error('Should ignore the component description')
          })
          .on('end', done)
      })
    })

    describe('keywords', () => {
      const script = `
        /**
         * @name my-checkbox
         */
        export default {}
      `

      it('should successfully emit component keywords', (done) => {
        const options = { source: { script } }
        const parser = new Parser(options)

        parser.walk().on('keywords', (value) => {
          assert.deepEqual(value, [ { name: 'name', description: 'my-checkbox' } ])

          done()
        })
      })

      it('should ignore the component keywords with missing `keywords` in options.features', (done) => {
        const filename = './fixtures/checkbox.vue'
        const options = {
          source: { script },
          filename,
          features: ['name']
        }
        const parser = new Parser(options)

        parser.walk()
          .on('keywords', () => {
            throw new Error('Should ignore the component keywords')
          })
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
        const parser = new Parser(options)

        parser.walk().on('name', (value) => {
          assert.equal(value, 'hello')

          done()
        })
      })

      it('should failed with missing exporting identifier', (done) => {
        const script = `
          export default component
        `
        const options = { source: { script } }
        const parser = new Parser(options)

        parser.walk().on('end', () => done())
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
        const parser = new Parser(options)

        parser.walk().on('name', (value) => {
          assert.equal(value, 'hello')

          done()
        })
      })
    })

    describe('parseTemplate()', () => {
      it('should successfully emit default slot', (done) => {
        const filename = './fixtures/checkbox.vue'
        const defaultMethodVisibility = 'public'
        const options = {
          source: { template },
          filename,
          defaultMethodVisibility
        }
        const parser = new Parser(options)

        parser.walk().on('slot', (slot) => {
          assert.equal(slot.name, 'default')
          assert.equal(slot.description, null)
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
            <!-- default slot -->
            <slot/>
          </div>
        `
        const options = {
          source: { template },
          filename,
          defaultMethodVisibility
        }
        const parser = new Parser(options)

        parser.walk().on('slot', (slot) => {
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
          features: ['name']
        }
        const parser = new Parser(options)

        parser.walk()
          .on('slot', () => {
            throw new Error('Should ignore the component slots')
          })
          .on('end', done)
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
        const parser = new Parser(options)

        parser.walk().on('name', (name) => {
          assert.equal(name, 'checkbox')
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
        const parser = new Parser(options)

        parser.walk().on('name', (name) => {
          assert.equal(name, 'my-input')
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
          features: ['description']
        }
        const parser = new Parser(options)

        parser.walk()
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
          features: ['description']
        }
        const parser = new Parser(options)

        parser.walk()
          .on('name', () => {
            throw new Error('Should ignore the component name')
          })
          .on('end', done)
      })
    })

    describe('extractProperties(property)', () => {
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
        const parser = new Parser(options)

        parser.walk().on('prop', (prop) => {
          assert.equal(prop.visibility, 'public')
          assert.equal(prop.name, 'id')
          assert.equal(prop.description, null)
          assert.deepEqual(prop.keywords, [])
          assert.deepEqual(prop.value, { type: 'String', default: '$id' })
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
        const parser = new Parser(options)

        parser.walk().on('prop', (prop) => {
          assert.equal(prop.visibility, 'public')
          assert.equal(prop.name, 'v-model')
          assert.equal(prop.description, '')
          assert.deepEqual(prop.keywords, [ { name: 'model', description: 'v-model keyword' } ])
          assert.deepEqual(prop.value, { type: 'String' })
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
              id: 'Hello'
            }
          }
        `
        const options = {
          source: { script },
          filename
        }
        const parser = new Parser(options)
        const expected = {
          keywords: [],
          visibility: 'public',
          description: 'ID data',
          value: 'Hello',
          name: 'id'
        }

        parser.walk().on('data', (prop) => {
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
               * ID data
               */
              id: 'Hello'
            })
          }
        `
        const options = {
          source: { script },
          filename
        }
        const parser = new Parser(options)
        const expected = {
          keywords: [],
          visibility: 'public',
          description: 'ID data',
          value: 'Hello',
          name: 'id'
        }

        parser.walk().on('data', (prop) => {
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
        const parser = new Parser(options)
        const expected = {
          keywords: [],
          visibility: 'public',
          description: 'ID data',
          value: 'Hello',
          name: 'id'
        }

        parser.walk().on('data', (prop) => {
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
        const parser = new Parser(options)
        const expected = {
          keywords: [],
          visibility: 'public',
          description: 'ID data',
          value: 'Hello',
          name: 'id'
        }

        parser.walk().on('data', (prop) => {
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
        const parser = new Parser(options)
        const expected = {
          name: 'id',
          keywords: [{ name: 'private', description: '' }],
          visibility: 'private',
          description: 'ID computed prop',
          dependencies: ['value', 'name']
        }

        parser.walk().on('computed', (prop) => {
          assert.equal(prop.name, expected.name)
          assert.deepEqual(prop.keywords, expected.keywords)
          assert.equal(prop.visibility, expected.visibility)
          assert.equal(prop.description, expected.description)
          assert.equal(prop.value.type, 'FunctionExpression')
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
        const parser = new Parser(options)
        const expected = {
          name: 'idGetter',
          keywords: [{ name: 'private', description: '' }],
          visibility: 'private',
          description: 'ID computed prop',
          dependencies: ['value', 'name']
        }

        parser.walk().on('computed', (prop) => {
          assert.equal(prop.name, expected.name)
          assert.deepEqual(prop.keywords, expected.keywords)
          assert.equal(prop.visibility, expected.visibility)
          assert.equal(prop.description, expected.description)
          assert.equal(prop.value.get.type, 'FunctionExpression')
          assert.deepEqual(prop.dependencies, expected.dependencies)
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
        const parser = new Parser(options)

        parser.walk().on('computed', (prop) => {
          assert.deepEqual(prop.dependencies, [])
          done()
        })
      })

      it('shouldn\'t emit an unknow item', (done) => {
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
        const parser = new Parser(options)

        parser.walk()
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
        const parser = new Parser(options)

        parser.walk().on('method', (prop) => {
          assert.equal(prop.visibility, 'private')
          assert.equal(prop.name, 'getValue')
          assert.equal(prop.description, null)
          assert.deepEqual(prop.keywords, [])
          assert.deepEqual(prop.params, [{
            name: 'ctx',
            type: 'Identifier',
            start: 76,
            end: 79,
            range: [76, 79]
          }])
          done()
        })
      })

      it('should emit nothing', (done) => {
        const defaultMethodVisibility = 'private'
        const script = `
          export default {
            desc: 'desc-v'
          }
        `
        const options = {
          source: { script },
          defaultMethodVisibility
        }
        const parser = new Parser(options)

        parser.walk().on('end', () => done())
      })
    })

    describe('subWalk(entry)', () => {
      it('should emit event without description', (done) => {
        const defaultMethodVisibility = 'private'
        const script = `
          export default {
            desc: () => {
              this.$emit('loading', true)
            }
          }
        `
        const options = {
          source: { script },
          defaultMethodVisibility
        }
        const parser = new Parser(options)

        parser.walk().on('event', (event) => {
          assert.equal(event.name, 'loading')
          assert.equal(event.description, null)
          assert.equal(event.visibility, 'public')
          assert.deepEqual(event.keywords, [])
          done()
        })
      })

      it('should emit event with description', (done) => {
        const defaultMethodVisibility = 'private'
        const script = `
          export default {
            desc: () => {
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
        const parser = new Parser(options)

        parser.walk().on('event', (event) => {
          assert.equal(event.name, 'loading')
          assert.equal(event.description, 'loading event')
          assert.equal(event.visibility, 'protected')
          assert.deepEqual(event.keywords, [ { name: 'protected', description: '' } ])
          done()
        })
      })

      it('should emit event with @event keyword', (done) => {
        const defaultMethodVisibility = 'private'
        const script = `
          export default {
            desc () {
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
        const parser = new Parser(options)

        parser.walk().on('event', (event) => {
          assert.equal(event.name, 'loading')
          assert.equal(event.description, 'Event description')
          assert.equal(event.visibility, 'public')
          assert.deepEqual(event.keywords, [ { name: 'event', description: 'loading' } ])

          done()
        })
      })

      it('should emit event with missing @event value keyword', (done) => {
        const defaultMethodVisibility = 'private'
        const script = `
          export default {
            desc () {
              /**
               * @event
               */
              this.$emit(name)
            }
          }
        `
        const options = {
          source: { script },
          defaultMethodVisibility
        }
        const parser = new Parser(options)

        parser.walk().on('error', (err) => {
          assert.ok(/Missing keyword value for @event/.test(err.message))

          done()
        })
      })

      it('should emit event with identifier name', (done) => {
        const defaultMethodVisibility = 'private'
        const script = `
          export default {
            desc: () => {
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
        const parser = new Parser(options)

        parser.walk().on('event', (event) => {
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
            desc: () => {
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
        const parser = new Parser(options)

        parser.walk().on('event', (event) => {
          assert.equal(event.name, 'loading')
          assert.equal(event.description, 'loading event')
          assert.equal(event.visibility, 'protected')
          assert.deepEqual(event.keywords, [ { name: 'protected', description: '' } ])
          done()
        })
      })

      it('should emit event with external identifier name', (done) => {
        const defaultMethodVisibility = 'private'
        const script = `
          const ppname = 'loading'

          export default {
            desc: () => {
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
        const parser = new Parser(options)

        parser.walk().on('event', (event) => {
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
            desc: () => {
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
        const parser = new Parser(options)

        parser.walk().on('event', (event) => {
          assert.equal(event.name, '****unhandled-event-name****')
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
            loading: () => {
              this.$emit('loading')
            },
            loading2: () => {
              this.$emit('loading', true)
            }
          }
        `
        const options = {
          source: { script },
          defaultMethodVisibility
        }

        const parser = new Parser(options)
        let eventCount = 0

        parser.walk()
          .on('event', (event) => {
            assert.equal(event.name, 'loading')
            assert.equal(event.description, undefined)
            assert.equal(event.visibility, 'public')
            assert.deepEqual(event.keywords, [])

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

        const parser = new Parser(options)
        let eventCount = 0

        parser.walk()
          .on('event', () => {
            eventCount++
          })
          .on('end', () => {
            assert.equal(eventCount, 0)

            done()
          })
      })

      it('should ignore the component events with missing `events` in options.features', (done) => {
        const script = `
          export default {
            loading: () => {
              this.$emit('loading')
            },
            loading2: () => {
              this.$emit('loading', true)
            }
          }
        `
        const options = {
          source: { script },
          features: ['name']
        }
        const parser = new Parser(options)

        parser.walk()
          .on('event', () => {
            throw new Error('Should ignore the component events')
          })
          .on('end', done)
      })
    })
  })
})
