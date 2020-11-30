/* global describe it expect */
/* eslint-disable max-len */
/* eslint-disable indent */

const parser = require('..')

const { ComponentTestCase } = require('./lib/TestUtils')
const { Fixture } = require('./lib/Fixture')

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
          category: undefined,
          description: undefined,
          keywords: [],
          type: 'Boolean',
          default: 'undefined',
          name: 'value',
          describeModel: true,
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
          category: undefined,
          description: undefined,
          keywords: [],
          type: 'Boolean',
          default: undefined,
          name: 'value',
          describeModel: true,
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
          category: undefined,
          description: undefined,
          keywords: [],
          type: 'Boolean',
          default: 'false',
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
          category: undefined,
          description: undefined,
          keywords: [],
          type: 'String',
          default: '"hello"',
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
          category: undefined,
          description: undefined,
          keywords: [],
          type: 'Number',
          default: '123',
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
          category: undefined,
          description: undefined,
          keywords: [],
          type: 'Object',
          default: 'null',
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
          category: undefined,
          description: undefined,
          keywords: [],
          type: 'BigInt',
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
          category: undefined,
          description: 'Overrides entire dialog contents',
          keywords: [],
          name: 'content',
          props: []
        },
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          description: 'Overrides dialog header',
          keywords: [],
          name: 'header',
          props: []
        },
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          description: 'Overrides dialog header actions, i.e. default close button',
          keywords: [],
          name: 'actions',
          props: []
        },
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          description: 'Dialog body',
          keywords: [],
          name: 'default',
          props: []
        },
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
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
          category: undefined,
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
          category: undefined,
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
          category: undefined,
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
          category: undefined,
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
          category: undefined,
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
          category: undefined,
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
          category: undefined,
          description: undefined,
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

  ComponentTestCase({
    name: '#52 - Prop as array type declaration',
    options: {
      filecontent: `
        <script>
          export default {
            props: {
              /**
               * Badge value
               */
              value: [String, Number]
            },
          }
        </script>
      `
    },
    expected: {
      errors: [],
      props: [
        {
          default: undefined,
          describeModel: true,
          category: undefined,
          description: 'Badge value',
          keywords: [],
          kind: 'prop',
          name: 'value',
          required: false,
          type: [ 'String', 'Number' ],
          visibility: 'public' }
      ]
    }
  })

  ComponentTestCase({
    name: '#53 - Documenting dynamic slots with @slot',
    options: {
      filecontent: `
        <script>
          /**
           * A functional component with a default slot using render function
           * @slot title - A title slot
           * @slot default - A default slot
           */
          export default {
            functional: true,
            render(h, { slots }) {
              return h('div', [
                h('h1', slots().title),
                h('p', slots().default)
              ])
            }
          }
        </script>
      `
    },
    expected: {
      errors: [],
      description: 'A functional component with a default slot using render function',
      keywords: [],
      slots: [
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          description: 'A title slot',
          keywords: [],
          name: 'title',
          props: []
        },
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          description: 'A default slot',
          keywords: [],
          name: 'default',
          props: []
        }
      ]
    }
  })

  ComponentTestCase({
    name: '#53 - Documenting dynamic slots with @slot on template',
    options: {
      filecontent: `
        <template>
          <div>
            <template v-for="name in ['title', 'default']">
              <!--
                @slot title - A title slot
                @slot default - A default slot
              -->
              <slot :name="name" :slot="name"></slot>
            </template>
          </div>
        </template>
      `
    },
    expected: {
      errors: [],
      slots: [
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          description: 'A title slot',
          keywords: [],
          name: 'title',
          props: []
        },
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          description: 'A default slot',
          keywords: [],
          name: 'default',
          props: []
        }
      ]
    }
  })

  ComponentTestCase({
    name: '#56 - Cannot read property \'type\' of null (UiAutocomplete.vue)',
    options: {
      filecontent: Fixture.get('UiAutocomplete.vue')
    },
    expected: {
      inheritAttrs: true,
      errors: [
        'tag <input> has no matching end tag.'
      ],
      name: 'ui-autocomplete',
      description: undefined,
      keywords: [],
      slots: [
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'icon',
          props: []
        },
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'default',
          props: []
        },
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'suggestion',
          props: []
        },
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'error',
          props: []
        },
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'help',
          props: []
        }
      ],
      props: [
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'name',
          type: 'String',
          default: undefined,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'placeholder',
          type: 'String',
          default: undefined,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'value',
          type: [ 'String', 'Number' ],
          default: '""',
          required: false,
          describeModel: true
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'icon',
          type: 'String',
          default: undefined,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'icon-position',
          type: 'String',
          default: '"left"',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'label',
          type: 'String',
          default: undefined,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'floating-label',
          type: 'Boolean',
          default: 'false',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'help',
          type: 'String',
          default: undefined,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'error',
          type: 'String',
          default: undefined,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'readonly',
          type: 'Boolean',
          default: 'false',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'disabled',
          type: 'Boolean',
          default: 'false',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'type',
          type: 'String',
          default: '"simple"',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'suggestions',
          type: 'Array',
          default: 'function() {\n                return [];\n            }',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'limit',
          type: 'Number',
          default: '8',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'append',
          type: 'Boolean',
          default: 'false',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'append-delimiter',
          type: 'String',
          default: '", "',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'min-chars',
          type: 'Number',
          default: '2',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'show-on-up-down',
          type: 'Boolean',
          default: 'true',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'autofocus',
          type: 'Boolean',
          default: 'false',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'filter',
          type: 'Function',
          default: undefined,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'highlight-on-first-match',
          type: 'Boolean',
          default: 'true',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'cycle-highlight',
          type: 'Boolean',
          default: 'true',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'keys',
          type: 'Object',
          default: "function() {\n                return {\n                    label: 'label',\n                    value: 'value',\n                    image: 'image'\n                };\n            }",
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'invalid',
          type: 'Boolean',
          default: 'false',
          required: false,
          describeModel: false
        }
      ],
      data: [
        {
          kind: 'data',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'initialValue',
          type: 'object',
          initialValue: 'this.value'
        },
        {
          kind: 'data',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'isActive',
          type: 'boolean',
          initialValue: 'false'
        },
        {
          kind: 'data',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'isTouched',
          type: 'boolean',
          initialValue: 'false'
        },
        {
          kind: 'data',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'showDropdown',
          type: 'boolean',
          initialValue: 'false'
        },
        {
          kind: 'data',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'highlightedIndex',
          type: 'number',
          initialValue: '-1'
        }
      ],
      computed: [
        {
          kind: 'computed',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'classes',
          dependencies: [
            'type',
            'iconPosition',
            'isActive',
            'invalid',
            'isTouched',
            'disabled',
            'hasLabel',
            'hasFloatingLabel'
          ]
        },
        {
          kind: 'computed',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'labelClasses',
          dependencies: [
            'hasFloatingLabel',
            'isLabelInline'
          ]
        },
        {
          kind: 'computed',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'hasLabel',
          dependencies: [
            'label',
            '$slots'
          ]
        },
        {
          kind: 'computed',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'hasFloatingLabel',
          dependencies: [
            'hasLabel',
            'floatingLabel'
          ]
        },
        {
          kind: 'computed',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'isLabelInline',
          dependencies: [
            'valueLength',
            'isActive'
          ]
        },
        {
          kind: 'computed',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'valueLength',
          dependencies: [
            'value'
          ]
        },
        {
          kind: 'computed',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'hasFeedback',
          dependencies: [
            'help',
            'error',
            '$slots'
          ]
        },
        {
          kind: 'computed',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'showError',
          dependencies: [
            'invalid',
            'error',
            '$slots'
          ]
        },
        {
          kind: 'computed',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'showHelp',
          dependencies: [
            'showError',
            'help',
            '$slots'
          ]
        },
        {
          kind: 'computed',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'matchingSuggestions',
          dependencies: [
            'suggestions',
            'filter',
            'value',
            'defaultFilter',
            'limit'
          ]
        }
      ],
      events: [
        {
          kind: 'event',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'select',
          arguments: [
            {
              name: 'suggestion',
              type: 'any',
              description: undefined,
              rest: false
            }
          ]
        },
        {
          kind: 'event',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'highlight-overflow',
          arguments: [
            {
              name: 'index',
              type: 'any',
              description: undefined,
              rest: false
            }
          ]
        },
        {
          kind: 'event',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'dropdown-open',
          arguments: []
        },
        {
          kind: 'event',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'dropdown-close',
          arguments: []
        },
        {
          kind: 'event',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'input',
          arguments: [
            {
              name: 'value',
              type: 'any',
              description: undefined,
              rest: false
            }
          ]
        },
        {
          kind: 'event',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'focus',
          arguments: [
            {
              name: 'e',
              type: 'any',
              description: undefined,
              rest: false
            }
          ]
        },
        {
          kind: 'event',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'change',
          arguments: [
            {
              name: 'value',
              type: 'any',
              description: undefined,
              rest: false
            },
            {
              name: 'e',
              type: 'any',
              description: undefined,
              rest: false
            }
          ]
        },
        {
          kind: 'event',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'blur',
          arguments: [
            {
              name: 'e',
              type: 'any',
              description: undefined,
              rest: false
            }
          ]
        },
        {
          kind: 'event',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'touch',
          arguments: []
        }
      ],
      methods: [
        {
          kind: 'method',
          syntax: [
            'defaultFilter(suggestion: unknow): unknow'
          ],
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'defaultFilter',
          params: [
            {
              name: 'suggestion',
              type: 'unknow',
              defaultValue: undefined,
              description: undefined,
              rest: false
            }
          ],
          returns: {
            type: 'unknow',
            description: undefined
          }
        },
        {
          kind: 'method',
          syntax: [
            'selectSuggestion(suggestion: unknow): void'
          ],
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'selectSuggestion',
          params: [
            {
              name: 'suggestion',
              type: 'unknow',
              defaultValue: undefined,
              description: undefined,
              rest: false
            }
          ],
          returns: {
            type: 'void',
            description: undefined
          }
        },
        {
          kind: 'method',
          syntax: [
            'highlightSuggestion(index: unknow): void'
          ],
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'highlightSuggestion',
          params: [
            {
              name: 'index',
              type: 'unknow',
              defaultValue: undefined,
              description: undefined,
              rest: false
            }
          ],
          returns: {
            type: 'void',
            description: undefined
          }
        },
        {
          kind: 'method',
          syntax: [
            'selectHighlighted(index: unknow, e: unknow): void'
          ],
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'selectHighlighted',
          params: [
            {
              name: 'index',
              type: 'unknow',
              defaultValue: undefined,
              description: undefined,
              rest: false
            },
            {
              name: 'e',
              type: 'unknow',
              defaultValue: undefined,
              description: undefined,
              rest: false
            }
          ],
          returns: {
            type: 'void',
            description: undefined
          }
        },
        {
          kind: 'method',
          syntax: [
            'openDropdown(): void'
          ],
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'openDropdown',
          params: [],
          returns: {
            type: 'void',
            description: undefined
          }
        },
        {
          kind: 'method',
          syntax: [
            'closeDropdown(): void'
          ],
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'closeDropdown',
          params: [],
          returns: {
            type: 'void',
            description: undefined
          }
        },
        {
          kind: 'method',
          syntax: [
            'updateValue(value: unknow): void'
          ],
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'updateValue',
          params: [
            {
              name: 'value',
              type: 'unknow',
              defaultValue: undefined,
              description: undefined,
              rest: false
            }
          ],
          returns: {
            type: 'void',
            description: undefined
          }
        },
        {
          kind: 'method',
          syntax: [
            'onFocus(e: unknow): void'
          ],
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'onFocus',
          params: [
            {
              name: 'e',
              type: 'unknow',
              defaultValue: undefined,
              description: undefined,
              rest: false
            }
          ],
          returns: {
            type: 'void',
            description: undefined
          }
        },
        {
          kind: 'method',
          syntax: [
            'onChange(e: unknow): void'
          ],
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'onChange',
          params: [
            {
              name: 'e',
              type: 'unknow',
              defaultValue: undefined,
              description: undefined,
              rest: false
            }
          ],
          returns: {
            type: 'void',
            description: undefined
          }
        },
        {
          kind: 'method',
          syntax: [
            'onBlur(e: unknow): void'
          ],
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'onBlur',
          params: [
            {
              name: 'e',
              type: 'unknow',
              defaultValue: undefined,
              description: undefined,
              rest: false
            }
          ],
          returns: {
            type: 'void',
            description: undefined
          }
        },
        {
          kind: 'method',
          syntax: [
            'onExternalClick(e: unknow): void'
          ],
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'onExternalClick',
          params: [
            {
              name: 'e',
              type: 'unknow',
              defaultValue: undefined,
              description: undefined,
              rest: false
            }
          ],
          returns: {
            type: 'void',
            description: undefined
          }
        },
        {
          kind: 'method',
          syntax: [
            'reset(): void'
          ],
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'reset',
          params: [],
          returns: {
            type: 'void',
            description: undefined
          }
        }
      ]
    }
  })

  ComponentTestCase({
    name: '#56 - Cannot read property \'type\' of null (UiAutocompleteMinimal.vue)',
    options: {
      filecontent: Fixture.get('UiAutocompleteMinimal.vue')
    },
    expected: {
      errors: [],
      name: 'ui-autocomplete',
      methods: [
        {
          category: undefined,
          description: undefined,
          keywords: [],
          kind: 'method',
          syntax: [
            'selectSuggestion(suggestion: unknow): void'
          ],
          name: 'selectSuggestion',
          params: [
            {
              name: 'suggestion',
              type: 'unknow',
              defaultValue: undefined,
              description: undefined,
              rest: false
            }
          ],
          returns: {
            type: 'void',
            description: undefined
          },
          visibility: 'public' }
      ],
      events: [
        {
          name: 'select',
          category: undefined,
          description: undefined,
          keywords: [],
          arguments: [
            {
              name: 'suggestion',
              type: 'any',
              description: undefined,
              rest: false
            }
          ],
          kind: 'event',
          visibility: 'public'
        }
      ]
    }
  })

  ComponentTestCase({
    name: '#56 - Cannot read property \'type\' of null (UiAutocompleteMinimalWorking.vue)',
    options: {
      filecontent: Fixture.get('UiAutocompleteMinimalWorking.vue')
    },
    expected: {
      name: 'ui-autocomplete',
      errors: [],
      methods: [
        {
          category: undefined,
          description: undefined,
          keywords: [],
          kind: 'method',
          syntax: [
            'selectSuggestion(suggestion: unknow): void'
          ],
          name: 'selectSuggestion',
          params: [
            {
              name: 'suggestion',
              type: 'unknow',
              defaultValue: undefined,
              description: undefined,
              rest: false
            }
          ],
          returns: {
            type: 'void',
            description: undefined
          },
          visibility: 'public' }
      ],
      events: [
        {
          name: 'select',
          category: undefined,
          description: undefined,
          keywords: [],
          arguments: [
            {
              name: 'suggestion',
              type: 'any',
              description: undefined,
              rest: false
            }
          ],
          kind: 'event',
          visibility: 'public'
        }
      ]
    }
  })

  ComponentTestCase({
    name: '#59 - Parser fails when props have an empty validator block',
    options: {
      filecontent: `
        <template>
          <div></div>
        </template>
        <script>
          export default {
            props: {
              myProp: {}
            }
          }
        </script>
      `
    },
    expected: {
      errors: [],
      props: [
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'my-prop',
          type: 'any',
          default: undefined,
          required: false,
          describeModel: false
        }
      ]
    }
  })

  ComponentTestCase({
    name: '#60 - Parser fails when passing an arrow function with no body brackets to another function',
    options: {
      filecontent: `
        <template>
          <div></div>
        </template>
        <script>
          export default {
            methods: {
              example() {
                setTimeout(() => console.log('notify'), 100);
              }
            }
          }
        </script>
      `
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'example(): void'
          ],
          name: 'example',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [],
          returns: {
            type: 'void',
            description: undefined
          }
        }
      ]
    }
  })

  ComponentTestCase({
    name: '#61 - Parsing event fails when event name is non-primitive value',
    options: {
      filecontent: `
        <script>
          const METHODS = {
            CLOSE: 'close'
          }

          const EVENTS = {
            CLOSE: 'close'
          }

          export default {
            methods: {
              /**
               * Close modal
               * @method close
               */
              [METHODS.CLOSE] () {
                /**
                 * Emit the \`close\` event on click
                 * @event close
                 */
                this.$emit(EVENTS.CLOSE, true)
              }
            }
          }
        </script>
      `
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'close(): void'
          ],
          name: 'close',
          visibility: 'public',
          category: undefined,
          description: 'Close modal',
          keywords: [],
          params: [],
          returns: {
            type: 'void',
            description: undefined
          }
        }
      ],
      events: [
        {
          kind: 'event',
          name: 'close',
          visibility: 'public',
          category: undefined,
          description: 'Emit the `close` event on click',
          keywords: [],
          arguments: [
            {
              type: 'boolean',
              description: undefined,
              name: 'true',
              rest: false
            }
          ]
        }
      ]
    }
  })

  ComponentTestCase({
    name: '#62 - @ symbol breaks comment parsing',
    options: {
      filecontent: `
        <script>
          /**
           * Defines if \`bleed@small\` class should be added to component for mobile view
           */
          export default {}
        </script>
      `
    },
    expected: {
      errors: [],
      description: 'Defines if `bleed@small` class should be added to component for mobile view'
    }
  })

  ComponentTestCase({
    name: '#66 - @returns with type',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * Returns the sum of a and b
               * @param {number} a
               * @param {number} b
               * @returns {number}
               */
              sum: (a, b) => a + b
            }
          }
        </script>
      `
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'sum(a: number, b: number): number'
          ],
          name: 'sum',
          visibility: 'public',
          category: undefined,
          description: 'Returns the sum of a and b',
          keywords: [],
          params: [
            {
              name: 'a',
              type: 'number',
              defaultValue: undefined,
              description: undefined,
              rest: false
            },
            {
              name: 'b',
              type: 'number',
              defaultValue: undefined,
              description: undefined,
              rest: false
            }
          ],
          returns: {
            type: 'number',
            description: undefined
          }
        }
      ]
    }
  })

  ComponentTestCase({
    name: '#76 - Support for @link params',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * See {@link MyClass} and [MyClass's foo property]{@link MyClass#foo}.
               * Also, check out {@link http://www.google.com|Google} and
               * {@link https://github.com GitHub}.
               */
              myFunction() {}
            }
          }
        </script>
      `
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'myFunction(): void'
          ],
          name: 'myFunction',
          keywords: [],
          category: undefined,
          description: 'See {@link MyClass} and [MyClass\'s foo property]{@link MyClass#foo}.\nAlso, check out {@link http://www.google.com|Google} and\n{@link https://github.com GitHub}.',
          params: [],
          returns: {
            type: 'void',
            description: undefined
          },
          visibility: 'public' }
      ]
    }
  })

  ComponentTestCase({
    name: '#77 - Parsing TypeScript methods doesn\'t work correctly',
    options: {
      filecontent: `
        <script>
          import Vue from 'vue'

          /**
           * @mixin
           */
          export function TestMixinFactory(boundValue: Record<string, any>) {
            return Vue.extend({
              methods: {
                /**
                 * Testing
                 *
                 * @param {Record<string, any>} test <-- Parser stops with error
                 * @return {Record<string, any>} <-- Gets parsed as description
                 * @public
                 */
                myFunction(test: Record<string, any>): Record<string, any> {
                  return boundValue
                },
              },
            })
          }
        </script>
      `
    },
    expected: {
      name: 'TestMixinFactory',
      description: undefined,
      errors: [],
      props: [],
      model: undefined,
      computed: [],
      events: [],
      methods: [
        {
          category: undefined,
          description: 'Testing',
          keywords: [],
          kind: 'method',
          syntax: [
            'myFunction(test: Record<string, any>): Record<string, any>'
          ],
          name: 'myFunction',
          params: [
            {
              name: 'test',
              type: 'Record<string, any>',
              description: '<-- Parser stops with error',
              rest: false
            }
          ],
          returns: {
            description: '<-- Gets parsed as description',
            type: 'Record<string, any>',
          },
          visibility: 'public',
        }
      ]
    }
  })

  ComponentTestCase({
    name: '#80 - Parser issue with !(...)',
    options: {
      filecontent: `
        <script>
          export default {
            data() {
              let a, b, c = 0
              let d = !(a || b || c)
              let e = !d

              return {
                a,
                b,
                c,
                d,
                /**
                 * @type boolean
                 * @initialValue false
                 */
                e,
                f: !!d,
              }
            }
          }
        </script>
      `
    },
    expected: {
      errors: [],
      data: [
        {
          kind: 'data',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'a',
          type: 'any',
          initialValue: 'undefined'
        },
        {
          kind: 'data',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'b',
          type: 'any',
          initialValue: 'undefined'
        },
        {
          kind: 'data',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'c',
          type: 'number',
          initialValue: '0'
        },
        {
          kind: 'data',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'd',
          type: 'any',
          initialValue: '!(a || b || c)'
        },
        {
          kind: 'data',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'e',
          type: 'boolean',
          initialValue: 'false'
        },
        {
          kind: 'data',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'f',
          type: 'any',
          initialValue: '!!d'
        }
      ]
    }
  })

  ComponentTestCase({
    name: '#83 - Parser issue with !(...)',
    options: {
      filecontent: `
        <script>
          import Vue from 'vue'

          /**
           * @mixin
           */
          export function TestMixinFactory(boundValue: number) {
              return Vue.extend({
                  methods: {
                      /**
                       * Testing
                       *
                       * @public
                       */
                      myFunction(test: Promise<string>): number {
                          let a, b, c = 0
                          let d = !(a || b || c)
                          return boundValue
                      },
                  },
              })
          }
        </script>
      `
    },
    expected: {
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'myFunction(test: Promise<string>): number'
          ],
          name: 'myFunction',
          category: undefined,
          description: 'Testing',
          visibility: 'public',
          keywords: [],
          params: [
            {
              name: 'test',
              type: 'Promise<string>',
              defaultValue: undefined,
              description: undefined,
              rest: false
            }
          ],
          returns: {
            type: 'number',
            description: undefined
          }
        }
      ]
    }
  })

  ComponentTestCase({
    name: '#83 - Issue with arrow function',
    options: {
      filecontent: `
        <template>
          <div>

          </div>
        </template>

        <script lang='ts'>
          import {extend, pick} from 'lodash'
          import mixins   from 'vue-typed-mixins'

          const Vue = mixins()
          export default Vue.extend({
            name: "TestComponent",
            methods: {
              test() {
                function pickOpts({sortBy, sortDesc, page, itemsPerPage}) {
                  return {sortBy, sortDesc, page, itemsPerPage}
                }

                const params: any = (({sortBy, sortDesc, page, itemsPerPage}) => ({sortBy, sortDesc, page, itemsPerPage}))(this.options)
                //const params: any = pick(this.options, ['sortBy', 'sortDesc', 'page', 'itemsPerPage'])
                //const params: any = pickOpts(this.options)
                params.search     = this.dSearch
                extend(params, this.fetchParams) // <--- error here I think
              }
            }
          })
        </script>
      `
    },
    expected: {
      name: 'TestComponent',
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'test(): void'
          ],
          name: 'test',
          category: undefined,
          description: undefined,
          visibility: 'public',
          keywords: [],
          params: [],
          returns: {
            type: 'void',
            description: undefined
          }
        }
      ]
    }
  })

  ComponentTestCase({
    name: 'vuedoc/md#19 - does not render default param values for function',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * Load the given \`schema\` with initial filled \`value\`
               * Use this to load async schema.
               *
               * @param {object} schema - The JSON Schema object to load
               * @param {Number|String|Array|Object|Boolean} model - The initial data for the schema.
               *
               * @Note \`model\` is not a two-way data bindings.
               * To get the form data, use the \`v-model\` directive.
               */
              load(schema, model = 'hello') {},
              number(model = 123) {},
              /**
               * @param {object} schema - The JSON Schema object to load
               */
              withImplicitUndefinedReturn(schema) {
                return undefined;
              },
              /**
               * @param {object} schema - The JSON Schema object to load
               * @return undefined
               */
              withExplicitUndefinedReturn(schema) {},
              /**
               * @return {int} 123
               */
              withExplicitReturn() {}
            }
          };
        </script>
      `
    },
    expected: {
      methods: [
        {
          kind: 'method',
          syntax: [
            'load(schema: object, model: Number | String | Array | Object | Boolean = "hello"): void'
          ],
          name: 'load',
          visibility: 'public',
          category: undefined,
          description: 'Load the given `schema` with initial filled `value`\nUse this to load async schema.',
          keywords: [
            {
              name: 'Note',
              description: '`model` is not a two-way data bindings.\nTo get the form data, use the `v-model` directive.'
            }
          ],
          params: [
            {
              name: 'schema',
              type: 'object',
              description: 'The JSON Schema object to load',
              defaultValue: undefined,
              rest: false
            },
            {
              name: 'model',
              type: [ 'Number', 'String', 'Array', 'Object', 'Boolean' ],
              description: 'The initial data for the schema.',
              defaultValue: undefined,
              defaultValue: '"hello"',
              rest: false
            }
          ],
          returns: {
            type: 'void',
            description: undefined
          }
        },
        {
          kind: 'method',
          syntax: [
            'number(model: number = 123): void'
          ],
          name: 'number',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [
            {
              name: 'model',
              type: 'number',
              description: undefined,
              defaultValue: '123',
              rest: false
            }
          ],
          returns: {
            type: 'void',
            description: undefined
          }
        },
        {
          kind: 'method',
          syntax: [
            'withImplicitUndefinedReturn(schema: object): unknow'
          ],
          name: 'withImplicitUndefinedReturn',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [
            {
              name: 'schema',
              type: 'object',
              description: 'The JSON Schema object to load',
              defaultValue: undefined,
              rest: false
            }
          ],
          returns: {
            type: 'unknow',
            description: undefined
          }
        },
        {
          kind: 'method',
          syntax: [
            'withExplicitUndefinedReturn(schema: object): void'
          ],
          name: 'withExplicitUndefinedReturn',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [
            {
              name: 'schema',
              type: 'object',
              description: 'The JSON Schema object to load',
              defaultValue: undefined,
              rest: false
            }
          ],
          returns: {
            type: 'void',
            description: 'undefined'
          }
        },
        {
          kind: 'method',
          syntax: [
            'withExplicitReturn(): int'
          ],
          name: 'withExplicitReturn',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [],
          returns: {
            type: 'int',
            description: '123'
          }
        }
      ]
    }
  })

  ComponentTestCase({
    name: '#84 - Method parameters not parsed correctly (typescript)',
    options: {
      filecontent: `
        <template>
            <div>

            </div>
        </template>

        <script lang='ts'>
            import {extend, pick} from 'lodash'
            import mixins   from 'vue-typed-mixins'

            const Vue = mixins()
            export default Vue.extend({
                name: "TestComponent",
                methods: {
                    test(a: string): boolean {
                        return true
                    }
                }
            })
        </script>
      `
    },
    expected: {
      errors: [],
      name: 'TestComponent',
      methods: [
        {
          kind: 'method',
          syntax: [
            'test(a: string): boolean'
          ],
          name: 'test',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [
            {
              name: 'a',
              type: 'string',
              description: undefined,
              defaultValue: undefined,
              rest: false
            },
          ],
          returns: {
            type: 'boolean',
            description: undefined
          }
        },
      ]
    }
  })

  ComponentTestCase({
    name: 'vuedoc/md#84 - Multiline default breaks table',
    options: {
      filecontent: `
        <template>
            <div>

            </div>
        </template>

        <script lang='ts'>
            import mixins         from 'vue-typed-mixins'
            import {PropOptions}  from 'vue'

            const Vue = mixins()
            export default Vue.extend({
                name: "TestComponent",
                props: {
                    testProp: {
                        type: Object,
                        default: () => ({
                            a: 1,
                            b: 2,
                        })
                    } as PropOptions<Record<string, any>>,
                    testProp2: String,
                }
            })
        </script>
      `
    },
    expected: {
      errors: [],
      name: 'TestComponent',
      props: [
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          version: undefined,
          description: undefined,
          keywords: [],
          type: 'Record<string, any>',
          default: '() => ({ a: 1, b: 2, })',
          name: 'test-prop',
          describeModel: false,
          required: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          version: undefined,
          description: undefined,
          keywords: [],
          type: 'String',
          default: undefined,
          name: 'test-prop2',
          describeModel: false,
          required: false
        },
      ]
    }
  })

  ComponentTestCase({
    name: '#87 - Typescript Parser Error',
    options: {
      filecontent: `
        <template>
            <div>

            </div>
        </template>

        <script lang='ts'>
          interface test {
              a: string
          }

          let x = <test>{
              a: 'a',
          }

          import mixins             from 'vue-typed-mixins'
          //import {ComponentOptions} from 'vue'

          interface ComponentOptions<T> {
              render(e: (a: any, b: any) => void): void
          }

          const Vue = mixins()
          export default Vue.extend({
              name: "TestComponent",
              components: {
                  "css-style": <ComponentOptions<any>>{
                      render: function (createElement) {
                          return createElement("style", (this as any).$slots.default)
                      },
                  } as any,
              },
          })
        </script>
      `
    },
    expected: {
      errors: [],
      name: 'TestComponent',
      props: [],
      data: [],
      computed: [],
      events: [],
      methods: [],
      slots: [],
    }
  })

  ComponentTestCase({
    name: '#91 - crash when parsing event with anonymous object as value',
    options: {
      filecontent: `
        <template>
          <i>foo</i>
        </template>

        <script>
          /**
           * Test component
           */
          export default {
            methods: {
              /**
               * @private
               */
              sendEvent2() {
                /**
                 * Foo event description
                 *
                 * @arg {Object} {name, val} - foo event param description
                 */
                this.$emit("foo-event", { name: "foo-name", val: "voo-val" })
              }
            }
          }
        </script>
      `
    },
    expected: {
      warnings: [
        "Invalid JSDoc syntax: '{Object} {name, val} - foo event param description'",
      ],
      errors: [],
      name: undefined,
      props: [],
      data: [],
      computed: [],
      events: [
        {
          arguments: [
            {
              description: undefined,
              name: '{ name: "foo-name", val: "voo-val" }',
              rest: false,
              type: 'object',
            },
          ],
          category: undefined,
          description: 'Foo event description',
          keywords: [],
          kind: 'event',
          name: 'foo-event',
          version: undefined,
          visibility: 'public',
        },
      ],
      methods: [],
      slots: [],
    }
  });
})
