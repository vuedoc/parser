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
          description: '',
          keywords: [],
          type: 'Boolean',
          nativeType: 'boolean',
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
          description: '',
          keywords: [],
          type: 'Boolean',
          nativeType: 'boolean',
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
          description: '',
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
          description: '',
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
          description: '',
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
          description: '',
          keywords: [],
          type: 'Object',
          nativeType: 'object',
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
          description: '',
          keywords: [],
          type: 'BigInt',
          nativeType: 'bigint',
          default: 100n,
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
          description: '',
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
          description: 'Badge value',
          keywords: [],
          kind: 'prop',
          name: 'value',
          nativeType: 'any',
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
          description: 'A title slot',
          keywords: [],
          name: 'title',
          props: []
        },
        {
          kind: 'slot',
          visibility: 'public',
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
          description: 'A title slot',
          keywords: [],
          name: 'title',
          props: []
        },
        {
          kind: 'slot',
          visibility: 'public',
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
      description: '',
      keywords: [],
      slots: [
        {
          kind: 'slot',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'icon',
          props: []
        },
        {
          kind: 'slot',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'default',
          props: []
        },
        {
          kind: 'slot',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'suggestion',
          props: []
        },
        {
          kind: 'slot',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'error',
          props: []
        },
        {
          kind: 'slot',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'help',
          props: []
        }
      ],
      props: [
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'name',
          type: 'String',
          nativeType: 'string',
          default: undefined,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'placeholder',
          type: 'String',
          nativeType: 'string',
          default: undefined,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'value',
          type: [ 'String', 'Number' ],
          nativeType: 'any',
          default: '',
          required: false,
          describeModel: true
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'icon',
          type: 'String',
          nativeType: 'string',
          default: undefined,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'icon-position',
          type: 'String',
          nativeType: 'string',
          default: 'left',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'label',
          type: 'String',
          nativeType: 'string',
          default: undefined,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'floating-label',
          type: 'Boolean',
          nativeType: 'boolean',
          default: false,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'help',
          type: 'String',
          nativeType: 'string',
          default: undefined,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'error',
          type: 'String',
          nativeType: 'string',
          default: undefined,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'readonly',
          type: 'Boolean',
          nativeType: 'boolean',
          default: false,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'disabled',
          type: 'Boolean',
          nativeType: 'boolean',
          default: false,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'type',
          type: 'String',
          nativeType: 'string',
          default: 'simple',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'suggestions',
          type: 'Array',
          nativeType: 'array',
          default: 'function() {\n                return [];\n            }',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'limit',
          type: 'Number',
          nativeType: 'number',
          default: 8,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'append',
          type: 'Boolean',
          nativeType: 'boolean',
          default: false,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'append-delimiter',
          type: 'String',
          nativeType: 'string',
          default: ', ',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'min-chars',
          type: 'Number',
          nativeType: 'number',
          default: 2,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'show-on-up-down',
          type: 'Boolean',
          nativeType: 'boolean',
          default: true,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'autofocus',
          type: 'Boolean',
          nativeType: 'boolean',
          default: false,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'filter',
          type: 'Function',
          nativeType: 'any',
          default: undefined,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'highlight-on-first-match',
          type: 'Boolean',
          nativeType: 'boolean',
          default: true,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'cycle-highlight',
          type: 'Boolean',
          nativeType: 'boolean',
          default: true,
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'keys',
          type: 'Object',
          nativeType: 'object',
          default: "function() {\n                return {\n                    label: 'label',\n                    value: 'value',\n                    image: 'image'\n                };\n            }",
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'invalid',
          type: 'Boolean',
          nativeType: 'boolean',
          default: false,
          required: false,
          describeModel: false
        }
      ],
      data: [
        {
          kind: 'data',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'initialValue',
          type: 'object',
          initial: 'this.value'
        },
        {
          kind: 'data',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'isActive',
          type: 'boolean',
          initial: false
        },
        {
          kind: 'data',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'isTouched',
          type: 'boolean',
          initial: false
        },
        {
          kind: 'data',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'showDropdown',
          type: 'boolean',
          initial: false
        },
        {
          kind: 'data',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'highlightedIndex',
          type: 'number',
          initial: -1
        }
      ],
      computed: [
        {
          kind: 'computed',
          visibility: 'public',
          description: '',
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
          description: '',
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
          description: '',
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
          description: '',
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
          description: '',
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
          description: '',
          keywords: [],
          name: 'valueLength',
          dependencies: [
            'value'
          ]
        },
        {
          kind: 'computed',
          visibility: 'public',
          description: '',
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
          description: '',
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
          description: '',
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
          description: '',
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
          description: '',
          keywords: [],
          name: 'select',
          arguments: [
            {
              name: 'suggestion',
              type: 'any',
              description: '',
              declaration: ''
            }
          ]
        },
        {
          kind: 'event',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'highlight-overflow',
          arguments: [
            {
              name: 'index',
              type: 'any',
              description: '',
              declaration: ''
            }
          ]
        },
        {
          kind: 'event',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'dropdown-open',
          arguments: []
        },
        {
          kind: 'event',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'dropdown-close',
          arguments: []
        },
        {
          kind: 'event',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'input',
          arguments: [
            {
              name: 'value',
              type: 'any',
              description: '',
              declaration: ''
            }
          ]
        },
        {
          kind: 'event',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'focus',
          arguments: [
            {
              name: 'e',
              type: 'any',
              description: '',
              declaration: ''
            }
          ]
        },
        {
          kind: 'event',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'change',
          arguments: [
            {
              name: 'value',
              type: 'any',
              description: '',
              declaration: 'this.value'
            },
            {
              name: 'e',
              type: 'any',
              description: '',
              declaration: ''
            }
          ]
        },
        {
          kind: 'event',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'blur',
          arguments: [
            {
              name: 'e',
              type: 'any',
              description: '',
              declaration: ''
            }
          ]
        },
        {
          kind: 'event',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'touch',
          arguments: []
        }
      ],
      methods: [
        {
          kind: 'method',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'defaultFilter',
          params: [
            {
              name: 'suggestion',
              type: 'any',
              defaultValue: undefined,
              description: '',
              declaration: ''
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'selectSuggestion',
          params: [
            {
              name: 'suggestion',
              type: 'any',
              defaultValue: undefined,
              description: '',
              declaration: ''
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'highlightSuggestion',
          params: [
            {
              name: 'index',
              type: 'any',
              defaultValue: undefined,
              description: '',
              declaration: ''
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'selectHighlighted',
          params: [
            {
              name: 'index',
              type: 'any',
              defaultValue: undefined,
              description: '',
              declaration: ''
            },
            {
              name: 'e',
              type: 'any',
              defaultValue: undefined,
              description: '',
              declaration: ''
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'openDropdown',
          params: [],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'closeDropdown',
          params: [],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'updateValue',
          params: [
            {
              name: 'value',
              type: 'any',
              defaultValue: undefined,
              description: '',
              declaration: ''
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'onFocus',
          params: [
            {
              name: 'e',
              type: 'any',
              defaultValue: undefined,
              description: '',
              declaration: ''
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'onChange',
          params: [
            {
              name: 'e',
              type: 'any',
              defaultValue: undefined,
              description: '',
              declaration: ''
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'onBlur',
          params: [
            {
              name: 'e',
              type: 'any',
              defaultValue: undefined,
              description: '',
              declaration: ''
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'onExternalClick',
          params: [
            {
              name: 'e',
              type: 'any',
              defaultValue: undefined,
              description: '',
              declaration: ''
            }
          ],
          return: {
            type: 'void',
            description: ''
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'reset',
          params: [],
          return: {
            type: 'void',
            description: ''
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
          description: '',
          keywords: [],
          kind: 'method',
          name: 'selectSuggestion',
          params: [
            {
              name: 'suggestion',
              type: 'any',
              defaultValue: undefined,
              description: '',
              declaration: ''
            }
          ],
          return: {
            type: 'void',
            description: ''
          },
          visibility: 'public' }
      ],
      events: [
        {
          name: 'select',
          description: '',
          keywords: [],
          arguments: [
            {
              name: 'suggestion',
              type: 'any',
              description: '',
              declaration: ''
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
          description: '',
          keywords: [],
          kind: 'method',
          name: 'selectSuggestion',
          params: [
            {
              name: 'suggestion',
              type: 'any',
              defaultValue: undefined,
              description: '',
              declaration: ''
            }
          ],
          return: {
            type: 'void',
            description: ''
          },
          visibility: 'public' }
      ],
      events: [
        {
          name: 'select',
          description: '',
          keywords: [],
          arguments: [
            {
              name: 'suggestion',
              type: 'any',
              description: '',
              declaration: ''
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
          description: '',
          keywords: [],
          name: 'my-prop',
          type: 'any',
          nativeType: 'any',
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
          name: 'example',
          visibility: 'public',
          description: '',
          keywords: [],
          params: [],
          return: {
            type: 'void',
            description: ''
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
          name: 'close',
          visibility: 'public',
          description: 'Close modal',
          keywords: [],
          params: [],
          return: {
            type: 'void',
            description: ''
          }
        }
      ],
      events: [
        {
          kind: 'event',
          name: 'close',
          visibility: 'public',
          description: 'Emit the `close` event on click',
          keywords: [],
          arguments: [
            {
              type: 'boolean',
              declaration: '',
              description: '',
              name: true
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
          name: 'sum',
          visibility: 'public',
          description: 'Returns the sum of a and b',
          keywords: [],
          params: [
            {
              name: 'a',
              type: 'number',
              description: undefined
            },
            {
              name: 'b',
              type: 'number',
              description: undefined
            }
          ],
          return: {
            type: 'number',
            description: ''
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
      methods: [
        {
          kind: 'method',
          name: 'myFunction',
          keywords: [],
          description: 'See {@link MyClass} and [MyClass\'s foo property]{@link MyClass#foo}.\nAlso, check out {@link http://www.google.com|Google} and\n{@link https://github.com GitHub}.',
          params: [],
          return: {
            type: 'void',
            description: ''
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
      description: '',
      errors: [],
      props: [],
      model: undefined,
      computed: [],
      events: [],
      methods: [
        {
          description: 'Testing',
          keywords: [],
          kind: 'method',
          name: 'myFunction',
          params: [
            {
              name: 'test',
              type: 'Record<string, any>',
              description: '<-- Parser stops with error'
            }
          ],
          return: {
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
                 * @initial false
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
          description: '',
          keywords: [],
          name: 'a',
          type: 'any',
          initial: undefined
        },
        {
          kind: 'data',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'b',
          type: 'any',
          initial: undefined
        },
        {
          kind: 'data',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'c',
          type: 'number',
          initial: 0
        },
        {
          kind: 'data',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'd',
          type: 'any',
          initial: '!(a || b || c)'
        },
        {
          kind: 'data',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'e',
          type: 'boolean',
          initial: 'false'
        },
        {
          kind: 'data',
          visibility: 'public',
          description: '',
          keywords: [],
          name: 'f',
          type: 'any',
          initial: '!!d'
        }
      ]
    }
  })
})
