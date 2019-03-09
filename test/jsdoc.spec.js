const assert = require('assert')
const jsdoc = require('../lib/jsdoc')

/* global describe it */

describe('jsdoc', () => {
  describe('parseType(type)', () => {
    it('should parse JSDoc type', () => {
      const type = 'string'
      const expected = { type: 'string' }
      const result = {}

      jsdoc.parseType(type, result)
      assert.deepEqual(result, expected)
    })

    it('should parse JSDoc type with pipe char', () => {
      const type = 'string|string[]'
      const expected = { type: [ 'string', 'string[]' ] }
      const result = {}

      jsdoc.parseType(type, result)
      assert.deepEqual(result, expected)
    })

    it('should parse with repeated parameter', () => {
      const type = '...number'
      const expected = { type: 'number', repeated: true }
      const result = {}

      jsdoc.parseType(type, result)
      assert.deepEqual(result, expected)
    })

    it('should parse with * as type', () => {
      const type = '*'
      const expected = { type: 'Any' }
      const result = {}

      jsdoc.parseType(type, result)
      assert.deepEqual(result, expected)
    })
  })

  describe('parseParamKeyword(text)', () => {
    it('should parse @param keyword', () => {
      const comment = '{number} x - The x value.'
      const expected = { type: 'number', name: 'x', desc: 'The x value.' }
      const result = jsdoc.parseParamKeyword(comment)

      assert.deepEqual(result, expected)
    })

    it('should parse @param keyword with missing dash separator', () => {
      const comment = '{number} x  The x value.'
      const expected = { type: 'number', name: 'x', desc: 'The x value.' }
      const result = jsdoc.parseParamKeyword(comment)

      assert.deepEqual(result, expected)
    })

    it('should parse @param keyword with an empty type', () => {
      const comment = '{} x - The x value.'
      const expected = { type: 'Any', name: 'x', desc: 'The x value.' }
      const result = jsdoc.parseParamKeyword(comment)

      assert.deepEqual(result, expected)
    })

    it('should parse @param keyword with missing type', () => {
      const comment = 'x - The x value.'
      const expected = { type: 'Any', name: 'x', desc: 'The x value.' }
      const result = jsdoc.parseParamKeyword(comment)

      assert.deepEqual(result, expected)
    })

    it('should parse @param keyword with malformated input', () => {
      const comment = '{ !x=> The x value.'
      const expected = { type: 'Any', name: null, desc: null }
      const result = jsdoc.parseParamKeyword(comment)

      assert.deepEqual(result, expected)
    })

    it('should parse @param keyword with repeated parameter', () => {
      const comment = '{...number} num - A positive or negative number.'
      const expected = {
        type: 'number',
        name: 'num',
        desc: 'A positive or negative number.',
        repeated: true
      }
      const result = jsdoc.parseParamKeyword(comment)

      assert.deepEqual(result, expected)
    })

    it('should parse @param keyword with Any type', () => {
      const comment = '{*} somebody - Whatever you want.'
      const expected = {
        type: 'Any',
        name: 'somebody',
        desc: 'Whatever you want.'
      }
      const result = jsdoc.parseParamKeyword(comment)

      assert.deepEqual(result, expected)
    })
  })

  describe('parseReturnKeyword(text)', () => {
    it('should parse @return keyword', () => {
      const comment = '{number} The x+y value.'
      const expected = { type: 'number', desc: 'The x+y value.' }
      const result = jsdoc.parseReturnKeyword(comment)

      assert.deepEqual(result, expected)
    })

    it('should parse @return keyword with an empty retuning type', () => {
      const comment = '{} The x+y value.'
      const expected = { type: 'Any', desc: 'The x+y value.' }
      const result = jsdoc.parseReturnKeyword(comment)

      assert.deepEqual(result, expected)
    })

    it('should parse @return keyword with missing retuning type', () => {
      const comment = 'The x+y value.'
      const expected = { type: 'Any', desc: 'The x+y value.' }
      const result = jsdoc.parseReturnKeyword(comment)

      assert.deepEqual(result, expected)
    })

    it('should parse @return keyword with malformated input', () => {
      const comment = ''
      const expected = { type: 'Any', desc: '' }
      const result = jsdoc.parseReturnKeyword(comment)

      assert.deepEqual(result, expected)
    })
  })
})
