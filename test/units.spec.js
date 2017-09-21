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

describe('UnitTests', () => {
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

  describe('parseComment(text, defaultVisibility)', () => {
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
      const tokens = require('./fixtures/getIdentifierValue-tokens')
      const identifierName = 'recursive'
      const rangeLimit = 1719
      const result = utils.getIdentifierValue(tokens, identifierName, rangeLimit)
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
  })

  describe('parseOptions(options)', () => {
    it('should failed with missing options.source', () => {
      const options = {}

      assert.throws(() => utils.parseOptions(options), /options.source is required/)
    })

    it('should successfully parse options', () => {
      const options = { source: {} }

      assert.doesNotThrow(() => utils.parseOptions(options))
    })
  })
})
