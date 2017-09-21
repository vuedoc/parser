'use strict'

const Parser = require('../lib/parser')
const assert = require('assert')

/* global describe it */

const template = `
  <div>
    Hello
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
})
