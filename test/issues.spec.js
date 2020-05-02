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
      props: [
        {
          default: '__undefined__',
          describeModel: false,
          description: 'Badge value',
          keywords: [],
          kind: 'prop',
          name: 'value',
          nativeType: '__undefined__',
          required: false,
          type: '[String, Number]',
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
      description: null,
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
          description: null,
          keywords: [],
          name: 'name',
          type: 'String',
          nativeType: 'string',
          default: '__undefined__',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'placeholder',
          type: 'String',
          nativeType: 'string',
          default: '__undefined__',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'value',
          type: '[String, Number]',
          nativeType: 'string',
          default: '',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'icon',
          type: 'String',
          nativeType: 'string',
          default: '__undefined__',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: null,
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
          description: null,
          keywords: [],
          name: 'label',
          type: 'String',
          nativeType: 'string',
          default: '__undefined__',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: null,
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
          description: null,
          keywords: [],
          name: 'help',
          type: 'String',
          nativeType: 'string',
          default: '__undefined__',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'error',
          type: 'String',
          nativeType: 'string',
          default: '__undefined__',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: null,
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
          description: null,
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
          description: null,
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
          description: null,
          keywords: [],
          name: 'suggestions',
          type: 'Array',
          nativeType: 'FunctionExpression',
          default: 'function() {\n                return [];\n            }',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: null,
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
          description: null,
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
          description: null,
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
          description: null,
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
          description: null,
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
          description: null,
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
          description: null,
          keywords: [],
          name: 'filter',
          type: 'Function',
          nativeType: '__undefined__',
          default: '__undefined__',
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: null,
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
          description: null,
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
          description: null,
          keywords: [],
          name: 'keys',
          type: 'Object',
          nativeType: 'FunctionExpression',
          default: "function() {\n                return {\n                    label: 'label',\n                    value: 'value',\n                    image: 'image'\n                };\n            }",
          required: false,
          describeModel: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          description: null,
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
          description: null,
          keywords: [],
          name: 'initialValue',
          type: 'MemberExpression',
          initial: 'this.value'
        },
        {
          kind: 'data',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'isActive',
          type: 'boolean',
          initial: false
        },
        {
          kind: 'data',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'isTouched',
          type: 'boolean',
          initial: false
        },
        {
          kind: 'data',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'showDropdown',
          type: 'boolean',
          initial: false
        },
        {
          kind: 'data',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'highlightedIndex',
          type: 'UnaryExpression',
          initial: '-1'
        }
      ],
      computed: [
        {
          kind: 'computed',
          visibility: 'public',
          description: null,
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
          description: null,
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
          description: null,
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
          description: null,
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
          description: null,
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
          description: null,
          keywords: [],
          name: 'valueLength',
          dependencies: [
            'value'
          ]
        },
        {
          kind: 'computed',
          visibility: 'public',
          description: null,
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
          description: null,
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
          description: null,
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
          description: null,
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
          description: null,
          keywords: [],
          name: 'select',
          arguments: [
            {
              name: 'suggestion',
              type: null,
              description: null,
              declaration: null
            }
          ]
        },
        {
          kind: 'event',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'highlight-overflow',
          arguments: [
            {
              name: 'index',
              type: null,
              description: null,
              declaration: null
            }
          ]
        },
        {
          kind: 'event',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'dropdown-open',
          arguments: []
        },
        {
          kind: 'event',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'dropdown-close',
          arguments: []
        },
        {
          kind: 'event',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'input',
          arguments: [
            {
              name: 'value',
              type: null,
              description: null,
              declaration: null
            }
          ]
        },
        {
          kind: 'event',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'focus',
          arguments: [
            {
              name: 'e',
              type: null,
              description: null,
              declaration: null
            }
          ]
        },
        {
          kind: 'event',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'change',
          arguments: [
            {
              name: 'value',
              type: null,
              description: null,
              declaration: 'this.value'
            },
            {
              name: 'e',
              type: null,
              description: null,
              declaration: null
            }
          ]
        },
        {
          kind: 'event',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'blur',
          arguments: [
            {
              name: 'e',
              type: null,
              description: null,
              declaration: null
            }
          ]
        },
        {
          kind: 'event',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'touch',
          arguments: []
        }
      ],
      methods: [
        {
          kind: 'method',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'defaultFilter',
          params: [
            {
              name: 'suggestion',
              type: null,
              defaultValue: '__undefined__',
              description: null,
              declaration: null
            }
          ],
          return: {
            type: 'void',
            description: null
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'selectSuggestion',
          params: [
            {
              name: 'suggestion',
              type: null,
              defaultValue: '__undefined__',
              description: null,
              declaration: null
            }
          ],
          return: {
            type: 'void',
            description: null
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'highlightSuggestion',
          params: [
            {
              name: 'index',
              type: null,
              defaultValue: '__undefined__',
              description: null,
              declaration: null
            }
          ],
          return: {
            type: 'void',
            description: null
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'selectHighlighted',
          params: [
            {
              name: 'index',
              type: null,
              defaultValue: '__undefined__',
              description: null,
              declaration: null
            },
            {
              name: 'e',
              type: null,
              defaultValue: '__undefined__',
              description: null,
              declaration: null
            }
          ],
          return: {
            type: 'void',
            description: null
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'openDropdown',
          params: [],
          return: {
            type: 'void',
            description: null
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'closeDropdown',
          params: [],
          return: {
            type: 'void',
            description: null
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'updateValue',
          params: [
            {
              name: 'value',
              type: null,
              defaultValue: '__undefined__',
              description: null,
              declaration: null
            }
          ],
          return: {
            type: 'void',
            description: null
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'onFocus',
          params: [
            {
              name: 'e',
              type: null,
              defaultValue: '__undefined__',
              description: null,
              declaration: null
            }
          ],
          return: {
            type: 'void',
            description: null
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'onChange',
          params: [
            {
              name: 'e',
              type: null,
              defaultValue: '__undefined__',
              description: null,
              declaration: null
            }
          ],
          return: {
            type: 'void',
            description: null
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'onBlur',
          params: [
            {
              name: 'e',
              type: null,
              defaultValue: '__undefined__',
              description: null,
              declaration: null
            }
          ],
          return: {
            type: 'void',
            description: null
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'onExternalClick',
          params: [
            {
              name: 'e',
              type: null,
              defaultValue: '__undefined__',
              description: null,
              declaration: null
            }
          ],
          return: {
            type: 'void',
            description: null
          }
        },
        {
          kind: 'method',
          visibility: 'public',
          description: null,
          keywords: [],
          name: 'reset',
          params: [],
          return: {
            type: 'void',
            description: null
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
      name: 'ui-autocomplete',
      methods: [
        {
          description: null,
          keywords: [],
          kind: 'method',
          name: 'selectSuggestion',
          params: [
            {
              name: 'suggestion',
              type: null,
              defaultValue: '__undefined__',
              description: null,
              declaration: null
            }
          ],
          return: {
            type: 'void',
            description: null
          },
          visibility: 'public' }
      ],
      events: [
        {
          name: 'select',
          description: null,
          keywords: [],
          arguments: [
            {
              name: 'suggestion',
              type: null,
              description: null,
              declaration: null
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
      methods: [
        {
          description: null,
          keywords: [],
          kind: 'method',
          name: 'selectSuggestion',
          params: [
            {
              name: 'suggestion',
              type: null,
              defaultValue: '__undefined__',
              description: null,
              declaration: null
            }
          ],
          return: {
            type: 'void',
            description: null
          },
          visibility: 'public' }
      ],
      events: [
        {
          name: 'select',
          description: null,
          keywords: [],
          arguments: [
            {
              name: 'suggestion',
              type: null,
              description: null,
              declaration: null
            }
          ],
          kind: 'event',
          visibility: 'public'
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
      methods: [
        {
          kind: 'method',
          name: 'close',
          visibility: 'public',
          description: 'Close modal',
          keywords: [
            {
              name: 'method',
              description: 'close'
            }
          ],
          params: [],
          return: {
            type: 'void',
            description: null
          }
        }
      ],
      events: [
        {
          kind: 'event',
          name: 'close',
          visibility: 'public',
          description: 'Emit the `close` event on click',
          keywords: [
            {
              name: 'event',
              description: 'close'
            }
          ],
          arguments: [
            {
              type: 'boolean',
              declaration: null,
              description: null,
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
      description: 'Defines if `bleed@small` class should be added to component for mobile view'
    }
  })
})
