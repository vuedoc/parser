const { CommentParser } = require('../lib/parser/CommentParser')

/* global describe it expect */
/* eslint-disable max-len */
/* eslint-disable indent */
/* eslint-disable prefer-destructuring */

const comment = `
  /**
   * The generic component
   * Sub description
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
   */`

describe('CommentParser', () => {
  describe('parse(text, defaultVisibility = public)', () => {
    const result = CommentParser.parse(comment)
    const keywords = result.keywords

    it('should successfully extract both description and keywords', () => {
      expect(result.description).toBe('The generic component\nSub description')
      expect(result.keywords.length).toBe(9)
    })

    it('should successfully skip the public visibility keyword', () => {
      const keyword = keywords.find((keyword) => keyword.name === 'public')

      expect(keyword).toBeUndefined()
    })

    it('should successfully extract keyword with alpnum chars in description', () => {
      const keyword = keywords.find((keyword) => keyword.name === 'alpnum')

      expect(keyword).toBeDefined()
      expect(keyword.description).toBe('azert0 123456789')
    })

    it('should successfully extract generic keyword with description', () => {
      const keyword = keywords.find((keyword) => keyword.name === 'generic')

      expect(keyword).toBeDefined()
      expect(keyword.description).toBe('Keyword generic description')
    })

    it('should successfully extract keyword with multiline description', () => {
      const keyword = keywords.find((keyword) => keyword.name === 'multiline')

      expect(keyword).toBeDefined()
      expect(keyword.description).toBe('Keyword multiline\n           description')
    })

    it('should successfully extract keyword with special chars in description', () => {
      const keyword = keywords.find((keyword) => keyword.name === 'special-char')

      expect(keyword).toBeDefined()
      expect(keyword.description).toBe('{$[ç(àë£€%µù!,|`_\\<>/_ç^?;.:/!§)]}')
    })

    it('should successfully extract keyword with punctuations chars in description', () => {
      const keyword = keywords.find((keyword) => keyword.name === 'punctuations')

      expect(keyword).toBeDefined()
      expect(keyword.description).toBe('!,?;.:!')
    })

    it('should successfully extract keyword with operators chars in description', () => {
      const keyword = keywords.find((keyword) => keyword.name === 'operators')

      expect(keyword).toBeDefined()
      expect(keyword.description).toBe('-/+<>=*%')
    })

    it('should successfully extract grouped keywords', () => {
      const group = keywords.filter((keyword) => keyword.name === 'slot')

      expect(group.length).toBe(3)
    })

    it('should success with malformated keyword syntax', () => {
      const comment = `
        /**
         * The generic component
         * Sub description
         *
         * @keyword*
         */`
      const result = CommentParser.parse(comment)

      expect(result.description).toBe('The generic component\nSub description')
      expect(result.keywords.length).toBe(1)
    })

    it('should parse with defaultVisibility = protected', () => {
      const comment = `
        /**
         * The generic component
         */`
      const visibility = 'protected'
      const result = CommentParser.parse(comment, visibility)

      expect(result.visibility).toBe(visibility)
    })
  })

  describe('getVisibility(keywords)', () => {
    it('should return the attached visibility', () => {
      const keywords = [
        { name: 'private',
          description: '' }
      ]
      const result = CommentParser.getVisibility(keywords)
      const expected = 'private'

      expect(result).toBe(expected)
    })

    it('should return null for not found visibility', () => {
      const keywords = [
        { name: 'author',
          description: 'Sébastien' }
      ]
      const result = CommentParser.getVisibility(keywords)
      const expected = null

      expect(result).toBe(expected)
    })
  })

  describe('format(comment)', () => {
    it('should return the trimmed comment', () => {
      const comment = `
        <!-- Hello, World -->
      `
      const result = CommentParser.format(comment)
      const expected = 'Hello, World'

      expect(result).toBe(expected)
    })

    it('should return null for an invalid comment', () => {
      const comment = ' <!--Hello, World  '
      const result = CommentParser.format(comment)
      const expected = null

      expect(result).toBe(expected)
    })

    it('should return null for a non comment', () => {
      const comment = ' Hello, \nWorld  '
      const result = CommentParser.format(comment)
      const expected = null

      expect(result).toBe(expected)
    })
  })
})
