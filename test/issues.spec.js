const parser = require('..')

/* global describe it expect */
/* eslint-disable max-len */
/* eslint-disable indent */

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
          nativeType: 'boolean',
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

  describe('#29 - Bad format when using code block in comment', () => {
    it('should successfully parse comment with block comment', () => {
      const options = {
        filecontent: `
          <script>
            /**
             * My beautifull component. Usage:
             *
             * \`\`\`
             * <my-component
             *     v-model='foo'
             * />
             * \`\`\`
             */
            export default {}

          </script>
        `
      }
      const expected = 'My beautifull component. Usage:\n\n```\n<my-component\n    v-model=\'foo\'\n/>\n```'

      return parser.parse(options).then(({ description }) => {
        expect(description).toEqual(expected)
      })
    })

    it('should successfully preserve spaces on keywords', () => {
      const options = {
        filecontent: `
          <script>
            /**
             * Description
             *
             * @note Node one
             * - Line 1
             *   Line 2
             * @note Node two
             * - Line 3
             * @note Node three
             */
            export default {}

          </script>
        `
      }
      const expectedDescription = 'Description'
      const expectedKeywords = [
        {
          name: 'note',
          description: 'Node one\n- Line 1\n  Line 2' },
        {
          name: 'note',
          description: 'Node two\n- Line 3' },
        {
          name: 'note',
          description: 'Node three' }
      ]

      return parser.parse(options).then(({ description, keywords }) => {
        expect(description).toEqual(expectedDescription)
        expect(keywords).toEqual(expectedKeywords)
      })
    })
  })

  describe('#30 - Block of comment is broken when using @ in comment in replacement of v-on', () => {
    it('should successfully parse comment with block comment', () => {
      const options = {
        filecontent: `
          <script>
            /**
             * Usage:
             * \`\`\`
             * <my-component @input='doSomething' />
             * \`\`\`
             */
            export default {}

          </script>
        `
      }
      const expected = 'Usage:\n```\n<my-component @input=\'doSomething\' />\n```'

      return parser.parse(options).then(({ description }) => {
        expect(description).toEqual(expected)
      })
    })

    it('should successfully parse with keywords', () => {
      const options = {
        filecontent: `
          <script>
            /**
             * Description
             *
             * @note Node one
             * - Line 1
             *   Line 2
             * @note Node two
             * - Line 3
             * @note Node three
             */
            export default {}

          </script>
        `
      }
      const expectedDescription = 'Description'
      const expectedKeywords = [
        {
          name: 'note',
          description: 'Node one\n- Line 1\n  Line 2' },
        {
          name: 'note',
          description: 'Node two\n- Line 3' },
        {
          name: 'note',
          description: 'Node three' }
      ]

      return parser.parse(options).then(({ description, keywords }) => {
        expect(description).toEqual(expectedDescription)
        expect(keywords).toEqual(expectedKeywords)
      })
    })
  })

  describe('#40 - Nested slot documentation', () => {
    it('should successfully parse nested slots', () => {
      const options = {
        filecontent: `
          <template>
            <!-- Overrides entire dialog contents -->
            <slot name="content">
              <n-module ref="module" :type="type">
                <!-- Overrides dialog header -->
                <slot name="header" slot="header">
                  <n-tile>
                    <div>
                      <div :class="config.children.title">{{ title }}</div>
                    </div>

                    <!-- Overrides dialog header actions, i.e. default close button -->
                    <slot name="actions" slot="actions">
                      <n-button @click.native="close" circle ghost color="black">
                        <n-icon :icon="config.icons.close"></n-icon>
                      </n-button>
                    </slot>
                  </n-tile>
                </slot>

                <!-- Dialog body -->
                <slot></slot>

                <!-- Dialog footer -->
                <slot name="footer" slot="footer"></slot>
              </n-module>
            </slot>
          </template>
        `
      }

      const expected = [
        {
          kind: 'slot',
          visibility: 'public',
          description: 'Overrides entire dialog contents',
          keywords: [],
          name: 'content',
          props: []
        },
        {
          kind: 'slot',
          visibility: 'public',
          description: 'Overrides dialog header',
          keywords: [],
          name: 'header',
          props: []
        },
        {
          kind: 'slot',
          visibility: 'public',
          description: 'Overrides dialog header actions, i.e. default close button',
          keywords: [],
          name: 'actions',
          props: []
        },
        {
          kind: 'slot',
          visibility: 'public',
          description: 'Dialog body',
          keywords: [],
          name: 'default',
          props: []
        },
        {
          kind: 'slot',
          visibility: 'public',
          description: 'Dialog footer',
          keywords: [],
          name: 'footer',
          props: []
        }
      ]

      return parser.parse(options).then(({ slots }) => {
        expect(slots).toEqual(expected)
      })
    })
  })

  describe('#39 - Events parsing on function calls', () => {
    it('should successfully parse events on this.$nextTick()', () => {
      const options = {
        filecontent: `
          <script>
            export default {
              created () {
                this.$nextTick(() => {
                  /**
                   * Emits when confirmation dialog is closed
                   */
                  this.$emit('close');
                });
              }
            }
          </script>
        `
      }

      const expected = [
        {
          kind: 'event',
          name: 'close',
          description: 'Emits when confirmation dialog is closed',
          arguments: [],
          keywords: [],
          visibility: 'public'
        }
      ]

      return parser.parse(options).then(({ events }) => {
        expect(events).toEqual(expected)
      })
    })

    it('should successfully parse events on Vue.nextTick()', () => {
      const options = {
        filecontent: `
          <script>
            export default {
              created () {
                Vue.nextTick(() => {
                  /**
                   * Emits when confirmation dialog is closed
                   */
                  this.$emit('close');
                });
              }
            }
          </script>
        `
      }

      const expected = [
        {
          kind: 'event',
          name: 'close',
          description: 'Emits when confirmation dialog is closed',
          arguments: [],
          keywords: [],
          visibility: 'public'
        }
      ]

      return parser.parse(options).then(({ events }) => {
        expect(events).toEqual(expected)
      })
    })

    it('should successfully parse events on callee function', () => {
      const options = {
        filecontent: `
          <script>
            export default {
              created () {
                load(() => {
                  /**
                   * Emits when confirmation dialog is closed
                   */
                  this.$emit('close');
                });
              }
            }
          </script>
        `
      }

      const expected = [
        {
          kind: 'event',
          name: 'close',
          description: 'Emits when confirmation dialog is closed',
          arguments: [],
          keywords: [],
          visibility: 'public'
        }
      ]

      return parser.parse(options).then(({ events }) => {
        expect(events).toEqual(expected)
      })
    })

    it('should successfully parse events on Promise.resolve function', () => {
      const options = {
        filecontent: `
          <script>
            export default {
              created () {
                load().then(() => {
                  /**
                   * Emits when confirmation dialog is closed
                   */
                  this.$emit('close');
                });
              }
            }
          </script>
        `
      }

      const expected = [
        {
          kind: 'event',
          name: 'close',
          description: 'Emits when confirmation dialog is closed',
          arguments: [],
          keywords: [],
          visibility: 'public'
        }
      ]

      return parser.parse(options).then(({ events }) => {
        expect(events).toEqual(expected)
      })
    })

    it('should successfully parse events on Promise.reject function', () => {
      const options = {
        filecontent: `
          <script>
            export default {
              created () {
                load().catch(() => {
                  /**
                   * Emits when confirmation dialog is closed
                   */
                  this.$emit('close');
                });
              }
            }
          </script>
        `
      }

      const expected = [
        {
          kind: 'event',
          name: 'close',
          description: 'Emits when confirmation dialog is closed',
          arguments: [],
          keywords: [],
          visibility: 'public'
        }
      ]

      return parser.parse(options).then(({ events }) => {
        expect(events).toEqual(expected)
      })
    })

    it('should successfully parse events on Promise.finally function', () => {
      const options = {
        filecontent: `
          <script>
            export default {
              created () {
                load().finally(() => {
                  /**
                   * Emits when confirmation dialog is closed
                   */
                  this.$emit('close');
                });
              }
            }
          </script>
        `
      }

      const expected = [
        {
          kind: 'event',
          name: 'close',
          description: 'Emits when confirmation dialog is closed',
          arguments: [],
          keywords: [],
          visibility: 'public'
        }
      ]

      return parser.parse(options).then(({ events }) => {
        expect(events).toEqual(expected)
      })
    })
  })

  describe('#41 - Duplicate computed properties dependencies', () => {
    it('should successfully parse dependencies without duplicates', () => {
      const options = {
        filecontent: `
          <script>
            export default {
              computed: {
                bidule () {
                  const doc = this.docs.find(({ name }) => name === this.name)

                  return this.name && doc.published
                }
              }
            }
          </script>
        `
      }

      const expected = [
        {
          kind: 'computed',
          name: 'bidule',
          description: null,
          dependencies: [ 'docs', 'name' ],
          keywords: [],
          visibility: 'public'
        }
      ]

      return parser.parse(options).then(({ computed }) => {
        expect(computed).toEqual(expected)
      })
    })
  })
})
