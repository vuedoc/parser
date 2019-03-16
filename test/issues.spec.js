const parser = require('..')

/* global describe it expect */
/* eslint-disable max-len */

describe('issues', () => {
  describe('#27 - undefined default value is parsed as a string', () => {
    it('should parse undefined default value as it', () => {
      const options = {
        features: [ 'props' ],
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
          kind: 'prop',
          visibility: 'public',
          description: null,
          keywords: [],
          type: 'Boolean',
          nativeType: 'undefined',
          default: undefined,
          name: 'value',
          describeModel: false,
          required: false
        }
      ]

      return parser.parse(options).then(({ props }) => {
        expect(props).toEqual(expected)
      })
    })

    it('should parse missing default value', () => {
      const options = {
        features: [ 'props' ],
        filecontent: `
          <script>
            export default {
              props: {
                value: {
                  type: Boolean
                }
              }
            }
          </script>
        `
      }

      const expected = [
        {
          kind: 'prop',
          visibility: 'public',
          description: null,
          keywords: [],
          type: 'Boolean',
          nativeType: '__undefined__',
          default: '__undefined__',
          name: 'value',
          describeModel: false,
          required: false
        }
      ]

      return parser.parse(options).then(({ props }) => {
        expect(props).toEqual(expected)
      })
    })

    it('should parse boolean default value as it', () => {
      const options = {
        features: [ 'props' ],
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
          kind: 'prop',
          visibility: 'public',
          description: null,
          keywords: [],
          type: 'Boolean',
          nativeType: 'boolean',
          default: false,
          name: 'bool',
          describeModel: false,
          required: false
        }
      ]

      return parser.parse(options).then(({ props }) => {
        expect(props).toEqual(expected)
      })
    })

    it('should parse string default value as it', () => {
      const options = {
        features: [ 'props' ],
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
          kind: 'prop',
          visibility: 'public',
          description: null,
          keywords: [],
          type: 'String',
          nativeType: 'string',
          default: 'hello',
          name: 'str',
          describeModel: false,
          required: false
        }
      ]

      return parser.parse(options).then(({ props }) => {
        expect(props).toEqual(expected)
      })
    })

    it('should parse number default value as it', () => {
      const options = {
        features: [ 'props' ],
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
          kind: 'prop',
          visibility: 'public',
          description: null,
          keywords: [],
          type: 'Number',
          nativeType: 'number',
          default: 123,
          name: 'int',
          describeModel: false,
          required: false
        }
      ]

      return parser.parse(options).then(({ props }) => {
        expect(props).toEqual(expected)
      })
    })

    it('should parse null default value as it', () => {
      const options = {
        features: [ 'props' ],
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
          kind: 'prop',
          visibility: 'public',
          description: null,
          keywords: [],
          type: 'Object',
          nativeType: 'null',
          default: null,
          name: 'null',
          describeModel: false,
          required: false
        }
      ]

      return parser.parse(options).then(({ props }) => {
        expect(props).toEqual(expected)
      })
    })

    it('should parse bigint default value as it', () => {
      const options = {
        features: [ 'props' ],
        filecontent: `
          <script>
            export default {
              props: {
                bigint: {
                  type: BigInt,
                  default: 100n
                }
              }
            }
          </script>
        `
      }

      const expected = [
        {
          kind: 'prop',
          visibility: 'public',
          description: null,
          keywords: [],
          type: 'BigInt',
          nativeType: 'bigint',
          default: '100n',
          name: 'bigint',
          describeModel: false,
          required: false
        }
      ]

      return parser.parse(options).then(({ props }) => {
        expect(props).toEqual(expected)
      })
    })
  })

  describe('#32 - dynamic (lazy) import() function alongside a regular import', () => {
    it('should successfully parse component with regular import', () => {
      const options = {
        filecontent: `
          <template>
            <div>
              <Lazy />
            </div>
          </template>
          <script>
            import Regular from './components/Regular.vue'
            export default {
              components: {
                Lazy: import('./components/Lazy.vue')
              }
            }
          </script>
        `
      }

      return parser.parse(options)
    })

    it('should successfully parse component with lazy import', () => {
      const options = {
        filecontent: `
          <template>
            <div>
              <Lazy />
            </div>
          </template>
          <script>
            import Regular from './components/Regular.vue'
            export default {
              computed: {
                loading() {
                  return () => import('input.vue')
                }
              }
            }
          </script>
        `
      }

      return parser.parse(options)
    })
  })
})
