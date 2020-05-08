const { JSDoc } = require('../lib/JSDoc')

/* global describe it expect */

describe('JSDoc', () => {
  describe('parseType(type)', () => {
    it('should parse JSDoc type', () => {
      const type = 'string'
      const expected = { type: 'string' }
      const result = {}

      JSDoc.parseType(type, result)
      expect(result).toEqual(expected)
    })

    it('should parse JSDoc type with pipe char', () => {
      const type = 'string|string[]'
      const expected = { type: [ 'string', 'string[]' ] }
      const result = {}

      JSDoc.parseType(type, result)
      expect(result).toEqual(expected)
    })

    it('should parse with repeated parameter', () => {
      const type = '...number'
      const expected = { type: 'number', repeated: true }
      const result = {}

      JSDoc.parseType(type, result)
      expect(result).toEqual(expected)
    })

    it('should parse with * as type', () => {
      const type = '*'
      const expected = { type: 'any' }
      const result = {}

      JSDoc.parseType(type, result)
      expect(result).toEqual(expected)
    })
  })

  describe('parseParamKeyword(text)', () => {
    it('should parse @param keyword', () => {
      const comment = '{number} x - The x value.'
      const expected = {
        type: 'number',
        name: 'x',
        description: 'The x value.'
      }
      const result = JSDoc.parseParamKeyword(comment)

      expect(result).toEqual(expected)
    })

    it('should parse @param keyword with missing dash separator', () => {
      const comment = '{number} x  The x value.'
      const expected = {
        type: 'number',
        name: 'x',
        description: 'The x value.'
      }
      const result = JSDoc.parseParamKeyword(comment)

      expect(result).toEqual(expected)
    })

    it('should parse @param keyword with an empty type', () => {
      const comment = '{} x - The x value.'
      const expected = { type: 'any', name: 'x', description: 'The x value.' }
      const result = JSDoc.parseParamKeyword(comment)

      expect(result).toEqual(expected)
    })

    it('should parse @param keyword with missing type', () => {
      const comment = 'x - The x value.'
      const expected = { type: 'any', name: 'x', description: 'The x value.' }
      const result = JSDoc.parseParamKeyword(comment)

      expect(result).toEqual(expected)
    })

    it('should parse @param keyword with malformated input', () => {
      const comment = '{ !x=> The x value.'
      const expected = { type: 'any', name: null, description: '' }
      const result = JSDoc.parseParamKeyword(comment)

      expect(result).toEqual(expected)
    })

    it('should parse @param keyword with repeated parameter', () => {
      const comment = '{...number} num - A positive or negative number.'
      const expected = {
        type: 'number',
        name: 'num',
        description: 'A positive or negative number.',
        repeated: true
      }
      const result = JSDoc.parseParamKeyword(comment)

      expect(result).toEqual(expected)
    })

    it('should parse @param keyword with any type', () => {
      const comment = '{*} somebody - Whatever you want.'
      const expected = {
        type: 'any',
        name: 'somebody',
        description: 'Whatever you want.'
      }
      const result = JSDoc.parseParamKeyword(comment)

      expect(result).toEqual(expected)
    })

    it('should parse @param with no descriptions', () => {
      const comment = '{any} somebody'
      const expected = {
        type: 'any',
        name: 'somebody',
        description: undefined
      }
      const result = JSDoc.parseParamKeyword(comment)

      expect(result).toEqual(expected)
    })
  })

  describe('parseReturnKeyword(text)', () => {
    it('should parse with just a type', () => {
      const comment = '{number}'
      const expected = { type: 'number', description: '' }
      const result = JSDoc.parseReturnKeyword(comment)

      expect(result).toEqual(expected)
    })

    it('should parse @return keyword', () => {
      const comment = '{number} The x+y value.'
      const expected = { type: 'number', description: 'The x+y value.' }
      const result = JSDoc.parseReturnKeyword(comment)

      expect(result).toEqual(expected)
    })

    it('should parse @return keyword with an empty retuning type', () => {
      const comment = '{} The x+y value.'
      const expected = { type: 'any', description: 'The x+y value.' }
      const result = JSDoc.parseReturnKeyword(comment)

      expect(result).toEqual(expected)
    })

    it('should parse @return keyword with missing retuning type', () => {
      const comment = 'The x+y value.'
      const expected = { type: 'any', description: 'The x+y value.' }
      const result = JSDoc.parseReturnKeyword(comment)

      expect(result).toEqual(expected)
    })

    it('should parse @return keyword with malformated input', () => {
      const comment = ''
      const expected = { type: 'any', description: '' }
      const result = JSDoc.parseReturnKeyword(comment)

      expect(result).toEqual(expected)
    })
  })
})
