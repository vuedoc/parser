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
    })

    describe('extractProperties(property)', () => {
      it('should successfully emit component name', (done) => {
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

        parser.walk().on('props', (prop) => {
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

        parser.walk().on('props', (prop) => {
          assert.equal(prop.visibility, 'public')
          assert.equal(prop.name, 'v-model')
          assert.equal(prop.description, '')
          assert.deepEqual(prop.keywords, [ { name: 'model', description: 'v-model keyword' } ])
          assert.deepEqual(prop.value, { type: 'String' })
          done()
        })
      })

      it('should successfully emit an unknow item', (done) => {
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

        parser.walk().on('unknow', (prop) => {
          done()
        })
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

        parser.walk().on('methods', (prop) => {
          assert.equal(prop.visibility, 'private')
          assert.equal(prop.name, 'getValue')
          assert.equal(prop.description, null)
          assert.deepEqual(prop.keywords, [])
          assert.deepEqual(prop.params, [{
            name: 'ctx',
            type: 'Identifier',
            start: 76,
            end: 79,
            range: [76,79]
          }])
          done()
        })
      })
    })
  })
})
