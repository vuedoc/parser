'use strict'

const utils = require('../lib/utils')
const assert = require('assert')

/* global describe it */

const comment = `
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
   */`

describe('libutils', () => {
  describe('getVisibility(keywords, defaultVisibility)', () => {
    it('should successfully return keyword visibility', () => {
      const visibility = 'protected'
      const keywords = [{ name: visibility }]
      const expected = visibility
      const result = utils.getVisibility(keywords)

      assert.equal(result, expected)
    })

    it('should successfully return default visibility', () => {
      const visibility = 'protected'
      const keywords = []
      const expected = visibility
      const result = utils.getVisibility(keywords, visibility)

      assert.equal(result, expected)
    })
  })

  describe('parseComment(text, defaultVisibility, features)', () => {
    const result = utils.parseComment(comment)
    const keywords = result.keywords

    it('should successfully extract the public visibility keyword', () => {
      const keyword = keywords.find((keyword) => keyword.name === 'public')

      assert.ok(keyword)
      assert.equal(keyword.description, '')
    })

    it('should successfully extract keyword with alpnum chars in description', () => {
      const keyword = keywords.find((keyword) => keyword.name === 'alpnum')

      assert.ok(keyword)
      assert.equal(keyword.description, 'azert0 123456789')
    })

    it('should successfully extract generic keyword with description', () => {
      const keyword = keywords.find((keyword) => keyword.name === 'generic')

      assert.ok(keyword)
      assert.equal(keyword.description, 'Keyword generic description')
    })

    it('should successfully extract keyword with multiline description', () => {
      const keyword = keywords.find((keyword) => keyword.name === 'multiline')

      assert.ok(keyword)
      assert.equal(keyword.description, 'Keyword multiline description')
    })

    it('should successfully extract keyword with special chars in description', () => {
      const keyword = keywords.find((keyword) => keyword.name === 'special-char')

      assert.ok(keyword)
      assert.equal(keyword.description, '{$[ç(àë£€%µù!,|`_\\<>/_ç^?;.:/!§)]}')
    })

    it('should successfully extract keyword with punctuations chars in description', () => {
      const keyword = keywords.find((keyword) => keyword.name === 'punctuations')

      assert.ok(keyword)
      assert.equal(keyword.description, '!,?;.:!')
    })

    it('should successfully extract keyword with operators chars in description', () => {
      const keyword = keywords.find((keyword) => keyword.name === 'operators')

      assert.ok(keyword)
      assert.equal(keyword.description, '-/+<>=*%')
    })

    it('should successfully extract grouped keywords', () => {
      const group = keywords.filter((keyword) => keyword.name === 'slot')

      assert.equal(group.length, 3)
    })

    it('should successfully tag describeModel', () => {
      assert.equal(result.describeModel, true)
    })

    it('should successfully extract both description and keywords', () => {
      assert.equal(result.description, 'The generic component Sub description')
      assert.equal(result.keywords.length, 11)
    })

    it('should success with malformated keyword syntax', () => {
      const comment = `
        /**
         * The generic component
         * Sub description
         *
         * @keyword*
         */`
      const result = utils.parseComment(comment)

      assert.equal(result.description, 'The generic component Sub description')
      assert.equal(result.keywords.length, 1)
    })

    it('should parse with defaultVisibility', () => {
      const comment = `
        /**
         * The generic component
         */`
      const visibility = 'protected'
      const result = utils.parseComment(comment, visibility)

      assert.equal(result.visibility, visibility)
    })

    it('should parse with features === []', () => {
      const result = utils.parseComment(comment, 'public', [])

      assert.equal(result.description, '')
      assert.equal(result.keywords.length, 0)
    })
  })

  describe('getComment(property, defaultVisibility)', () => {
    it('should succeed with an empty property', () => {
      const property = {}
      const expected = {
        visibility: utils.DEFAULT_VISIBILITY,
        description: null,
        keywords: []
      }
      const result = utils.getComment(property)

      assert.deepEqual(result, expected)
    })

    it('should succeed with property.leadingComments', () => {
      const property = {
        leadingComments: [{
          value: `
            /**
             * Hello
             */
          `
        }]
      }
      const visibility = 'protected'
      const expected = {
        visibility: visibility,
        description: 'Hello',
        keywords: [],
        describeModel: false
      }
      const result = utils.getComment(property, visibility)

      assert.deepEqual(result, expected)
    })

    it('should succeed with property.trailingComments', () => {
      const property = {
        trailingComments: [{
          value: `
            /**
             * @private
             */
          `
        }]
      }
      const expected = {
        visibility: 'private',
        description: '',
        keywords: [{ name: 'private', description: '' }],
        describeModel: false
      }
      const result = utils.getComment(property)

      assert.deepEqual(result, expected)
    })
  })

  describe('value(property)', () => {
    describe('with', () => {
      it('property.key.type === Literal', () => {
        const property = {
          key: {
            type: 'Literal',
            name: 'name',
            value: 'val-value'
          },
          value: {
            value: 'val-value'
          }
        }
        const expected = { [property.key.value]: property.value }
        const result = utils.value(property)

        assert.deepEqual(result, expected)
      })

      it('property.value.type === Literal', () => {
        const property = {
          key: {
            name: 'name',
            value: 'val-value'
          },
          value: {
            type: 'Literal',
            value: 'val-value'
          }
        }
        const expected = { [property.key.name]: property.value.value }
        const result = utils.value(property)

        assert.deepEqual(result, expected)
      })

      it('property.value.type === Identifier', () => {
        const property = {
          key: {
            name: 'name',
            value: 'val-value'
          },
          value: {
            type: 'Identifier',
            value: 'val-value'
          }
        }
        const expected = { [property.key.name]: property.value.name }
        const result = utils.value(property)

        assert.deepEqual(result, expected)
      })

      it('property.value.type === ObjectExpression', () => {
        const property = {
          key: {
            name: 'name',
            value: 'val-value'
          },
          value: {
            type: 'ObjectExpression',
            value: 'val-value',
            properties: []
          }
        }
        const expected = { [property.key.name]: utils.values(property) }
        const result = utils.value(property)

        assert.deepEqual(result, expected)
      })

      it('property.value.type === FunctionExpression', () => {
        const property = {
          key: {
            name: 'name',
            value: 'val-value'
          },
          value: {
            type: 'FunctionExpression',
            value: 'val-value'
          }
        }
        const expected = { [property.key.name]: new utils.NodeFunction(property.value) }
        const result = utils.value(property)

        assert.deepEqual(result, expected)
      })

      it('property.value.type === ArrowFunctionExpression', () => {
        const property = {
          key: {
            name: 'name',
            value: 'val-value'
          },
          value: {
            type: 'ArrowFunctionExpression',
            value: 'val-value'
          }
        }
        const expected = { [property.key.name]: new utils.NodeFunction(property.value) }
        const result = utils.value(property)

        assert.deepEqual(result, expected)
      })
    })
  })

  describe('values(entry)', () => {
    it('should successfully return the entry values', () => {
      const entry = require('./fixtures/entry-value')
      const values = utils.values(entry)
      const expected = { type: 'Array', required: true, twoWay: true }

      assert.deepEqual(values, expected)
    })

    it('should successfully return the entry values with ObjectExpression', () => {
      const entry = require('./fixtures/entry-value-object-expression')
      const values = utils.values(entry)
      const expected = { twoWay: { twoWay: { required: true } } }

      assert.deepEqual(values, expected)
    })
  })

  describe('tokensInterval(tokens, range)', () => {
    const entry = require('./fixtures/entry-value')
    const tokens = entry.value.properties

    it('should successfully return tokens in range interval', () => {
      const range = [213, 230]
      const results = utils.tokensInterval(tokens, range)
      const expected = [{
        'type': 'Property',
        'start': 214,
        'end': 228,
        'range': [
          214,
          228
        ],
        'method': false,
        'shorthand': false,
        'computed': false,
        'key': {
          'type': 'Identifier',
          'start': 214,
          'end': 222,
          'range': [
            214,
            222
          ],
          'name': 'required'
        },
        'value': {
          'type': 'Literal',
          'start': 224,
          'end': 228,
          'range': [
            224,
            228
          ],
          'value': true,
          'raw': 'true'
        },
        'kind': 'init'
      }]

      assert.deepEqual(results, expected)
    })

    it('should successfully found 0 tokens', () => {
      const range = [0, 100]
      const results = utils.tokensInterval(tokens, range)
      const expected = []

      assert.deepEqual(results, expected)
    })
  })

  describe('getIdentifierValue(tokens, identifierName, rangeLimit)', () => {
    const tokens = require('./fixtures/getIdentifierValue-tokens')

    it('should succeed to found identifier value', () => {
      const identifierName = 'name'
      const rangeLimit = 989
      const result = utils.getIdentifierValue(tokens, identifierName, rangeLimit)
      const expected = 'check'

      assert.equal(result, expected)
    })

    it('should succeed to found recursive identifier value', () => {
      const tokens = require('./fixtures/getIdentifierValue-tokens-recursive')
      const identifierName = 'eventName'
      const rangeLimit = 1719
      const result = utils.getIdentifierValue(tokens, identifierName, rangeLimit)
      const expected = 'recursive'

      assert.equal(result, expected)
    })

    it('should failed to found recursive identifier value', () => {
      const tokens = require('./fixtures/getIdentifierValue-tokens-notfound')
      const identifierName = 'recursive'
      const rangeLimit = 1719
      const result = utils.getIdentifierValue(tokens, identifierName, rangeLimit)
      const expected = { notFoundIdentifier: 'recursive' }

      assert.deepEqual(result, expected)
    })
  })

  describe('getIdentifierValueFromStart(tokens, identifierName, rangeLimit)', () => {
    const tokens = require('./fixtures/getIdentifierValueFromStart-tokens')

    it('should succeed to found identifier value', () => {
      const identifierName = 'ppname'
      const result = utils.getIdentifierValueFromStart(tokens, identifierName)
      const expected = 'loading'

      assert.equal(result, expected)
    })

    it('should succeed to found identifier value with export default', () => {
      const tokens = require('./fixtures/getIdentifierValueFromStart-tokens-export-default')
      const identifierName = 'ppname'
      const result = utils.getIdentifierValueFromStart(tokens, identifierName)
      const expected = 'loading'

      assert.equal(result, expected)
    })

    it('should succeed to found identifier value with recursive identifier', () => {
      const tokens = require('./fixtures/getIdentifierValueFromStart-tokens-recursive')
      const identifierName = 'ppname'
      const result = utils.getIdentifierValueFromStart(tokens, identifierName)
      const expected = 'loading'

      assert.equal(result, expected)
    })

    it('should failed to found identifier value', () => {
      const identifierName = 'notfound'
      const result = utils.getIdentifierValueFromStart(tokens, identifierName)
      const expected = null

      assert.equal(result, expected)
    })
  })

  describe('unCamelcase(text)', () => {
    it('should succeed with CamelCase entry', () => {
      const entry = 'InputCheckbox'
      const result = utils.unCamelcase(entry)
      const expected = 'input-checkbox'

      assert.equal(result, expected)
    })

    it('should succeed with a non CamelCase entry', () => {
      const entry = 'input-checkbox'
      const result = utils.unCamelcase(entry)

      assert.equal(result, entry)
    })

    it('should succeed with entry that contains numbers', () => {
      const entry = 'i18n'
      const result = utils.unCamelcase(entry)
      const expected = 'i18n'

      assert.equal(result, expected)
    })
  })

  describe('getDependencies(ast, source)', () => {
    it('should successfully extract ThisExpession items', () => {
      const ast = { start: 182, end: 272 }
      const source = `
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
      const expected = ['value', 'name']
      const result = utils.getDependencies(ast, source)

      assert.deepEqual(expected, result)
    })

    it('should return an empty dependencies array', () => {
      const ast = { start: 0, end: 272 }
      const source = `
          export default {
            computed: {
              id () {
                return 'Hello'
              }
            }
          }
        `
      const expected = []
      const result = utils.getDependencies(ast, source)

      assert.deepEqual(expected, result)
    })

    it('should return an empty dependencies array with ast === null', () => {
      const ast = null
      const source = ``
      const expected = []
      const result = utils.getDependencies(ast, source)

      assert.deepEqual(expected, result)
    })
  })

  describe('parseJsdocType(type)', () => {
    it('should parse JSDoc type', () => {
      const type = 'string'
      const expected = 'string'
      const result = utils.parseJsdocType(type)

      assert.deepEqual(result, expected)
    })

    it('should parse JSDoc type with pipe char', () => {
      const type = 'string|string[]'
      const expected = ['string', 'string[]']
      const result = utils.parseJsdocType(type)

      assert.deepEqual(result, expected)
    })
  })

  describe('parseParamKeyword(text)', () => {
    it('should parse @param keyword', () => {
      const comment = '{number} x - The x value.'
      const expected = { type: 'number', name: 'x', desc: 'The x value.' }
      const result = utils.parseParamKeyword(comment)

      assert.deepEqual(result, expected)
    })

    it('should parse @param keyword with missing dash separator', () => {
      const comment = '{number} x  The x value.'
      const expected = { type: 'number', name: 'x', desc: 'The x value.' }
      const result = utils.parseParamKeyword(comment)

      assert.deepEqual(result, expected)
    })

    it('should parse @param keyword with an empty type', () => {
      const comment = '{} x - The x value.'
      const expected = { type: 'Any', name: 'x', desc: 'The x value.' }
      const result = utils.parseParamKeyword(comment)

      assert.deepEqual(result, expected)
    })

    it('should parse @param keyword with missing type', () => {
      const comment = 'x - The x value.'
      const expected = { type: 'Any', name: 'x', desc: 'The x value.' }
      const result = utils.parseParamKeyword(comment)

      assert.deepEqual(result, expected)
    })

    it('should parse @param keyword with malformated input', () => {
      const comment = '{ !x=> The x value.'
      const expected = { type: 'Any', name: null, desc: null }
      const result = utils.parseParamKeyword(comment)

      assert.deepEqual(result, expected)
    })
  })

  describe('parseReturnKeyword(text)', () => {
    it('should parse @return keyword', () => {
      const comment = '{number} The x+y value.'
      const expected = { type: 'number', desc: 'The x+y value.' }
      const result = utils.parseReturnKeyword(comment)

      assert.deepEqual(result, expected)
    })

    it('should parse @return keyword with an empty retuning type', () => {
      const comment = '{} The x+y value.'
      const expected = { type: 'Any', desc: 'The x+y value.' }
      const result = utils.parseReturnKeyword(comment)

      assert.deepEqual(result, expected)
    })

    it('should parse @return keyword with missing retuning type', () => {
      const comment = 'The x+y value.'
      const expected = { type: 'Any', desc: 'The x+y value.' }
      const result = utils.parseReturnKeyword(comment)

      assert.deepEqual(result, expected)
    })

    it('should parse @return keyword with malformated input', () => {
      const comment = ''
      const expected = { type: 'Any', desc: '' }
      const result = utils.parseReturnKeyword(comment)

      assert.deepEqual(result, expected)
    })
  })

  describe('escapeImportKeyword(code)', () => {
    it('should escape the reserved import keyword', () => {
      const code = 'import("x"); import("y")'
      const expected = 'importX("x"); importX("y")'
      const result = utils.escapeImportKeyword(code)

      assert.deepEqual(result, expected)
    })
  })
})
