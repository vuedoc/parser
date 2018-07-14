'use strict'

const parser = require('..')

/* global describe it expect */

describe('issues', () => {
  describe('#27 - undefined default value is parsed as a string', () => {
    it('should parse undefined default value as it', () => {
      const options = {
        features: ['props'],
        filecontent: `
          <script>
            export default {
              props: {
                value: {
                  type: Boolean,
                  default: undefined
                }
              }
            }
          </script>
        `
      }

      const expected = [
        {
          visibility: 'public',
          description: null,
          keywords: [],
          value: {
            type: 'Boolean',
            default: undefined
          },
          name: 'value'
        }
      ]

      return parser.parse(options).then(({ props }) => {
        expect(props).toEqual(expected)
      })
    })

    it('should parse boolean default value as it', () => {
      const options = {
        features: ['props'],
        filecontent: `
          <script>
            export default {
              props: {
                bool: {
                  type: Boolean,
                  default: false
                }
              }
            }
          </script>
        `
      }

      const expected = [
        {
          visibility: 'public',
          description: null,
          keywords: [],
          value: {
            type: 'Boolean',
            default: false
          },
          name: 'bool'
        }
      ]

      return parser.parse(options).then(({ props }) => {
        expect(props).toEqual(expected)
      })
    })

    it('should parse string default value as it', () => {
      const options = {
        features: ['props'],
        filecontent: `
          <script>
            export default {
              props: {
                str: {
                  type: String,
                  default: 'hello'
                }
              }
            }
          </script>
        `
      }

      const expected = [
        {
          visibility: 'public',
          description: null,
          keywords: [],
          value: {
            type: 'String',
            default: 'hello'
          },
          name: 'str'
        }
      ]

      return parser.parse(options).then(({ props }) => {
        expect(props).toEqual(expected)
      })
    })

    it('should parse number default value as it', () => {
      const options = {
        features: ['props'],
        filecontent: `
          <script>
            export default {
              props: {
                int: {
                  type: Number,
                  default: 123
                }
              }
            }
          </script>
        `
      }

      const expected = [
        {
          visibility: 'public',
          description: null,
          keywords: [],
          value: {
            type: 'Number',
            default: 123
          },
          name: 'int'
        }
      ]

      return parser.parse(options).then(({ props }) => {
        expect(props).toEqual(expected)
      })
    })

    it('should parse null default value as it', () => {
      const options = {
        features: ['props'],
        filecontent: `
          <script>
            export default {
              props: {
                null: {
                  type: Object,
                  default: null
                }
              }
            }
          </script>
        `
      }

      const expected = [
        {
          visibility: 'public',
          description: null,
          keywords: [],
          value: {
            type: 'Object',
            default: null
          },
          name: 'null'
        }
      ]

      return parser.parse(options).then(({ props }) => {
        expect(props).toEqual(expected)
      })
    })
  })
})
