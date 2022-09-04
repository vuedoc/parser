import { describe, expect, it } from 'vitest';
import { parseComponent } from '../../src/index.ts';
import { Fixture } from '../lib/Fixture.js';

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
        `,
      };

      const expected = [
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          type: 'boolean',
          default: 'undefined',
          name: 'v-model',
          describeModel: true,
          required: false,
        },
      ];

      return parseComponent(options).then(({ props }) => {
        expect(props).toEqual(expected);
      });
    });

    it('should parse missing default value', () => {
      const options = {
        features: ['props'],
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
        `,
      };

      const expected = [
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          type: 'boolean',
          default: undefined,
          name: 'v-model',
          describeModel: true,
          required: false,
        },
      ];

      return parseComponent(options).then(({ props }) => {
        expect(props).toEqual(expected);
      });
    });

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
        `,
      };

      const expected = [
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          type: 'boolean',
          default: 'false',
          name: 'bool',
          describeModel: false,
          required: false,
        },
      ];

      return parseComponent(options).then(({ props }) => {
        expect(props).toEqual(expected);
      });
    });

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
        `,
      };

      const expected = [
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          type: 'string',
          default: '"hello"',
          name: 'str',
          describeModel: false,
          required: false,
        },
      ];

      return parseComponent(options).then(({ props }) => {
        expect(props).toEqual(expected);
      });
    });

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
        `,
      };

      const expected = [
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          type: 'number',
          default: '123',
          name: 'int',
          describeModel: false,
          required: false,
        },
      ];

      return parseComponent(options).then(({ props }) => {
        expect(props).toEqual(expected);
      });
    });

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
        `,
      };

      const expected = [
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          type: 'object',
          default: 'null',
          name: 'null',
          describeModel: false,
          required: false,
        },
      ];

      return parseComponent(options).then(({ props }) => {
        expect(props).toEqual(expected);
      });
    });

    it('should parse bigint default value as it', () => {
      const options = {
        features: ['props'],
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
        `,
      };

      const expected = [
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          type: 'bigint',
          default: '100n',
          name: 'bigint',
          describeModel: false,
          required: false,
        },
      ];

      return parseComponent(options).then(({ props }) => {
        expect(props).toEqual(expected);
      });
    });
  });

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
        `,
      };

      return parseComponent(options);
    });

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
        `,
      };

      return parseComponent(options);
    });
  });

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
        `,
      };
      const expected = 'My beautifull component. Usage:\n\n```\n<my-component\n    v-model=\'foo\'\n/>\n```';

      return parseComponent(options).then(({ description }) => {
        expect(description).toEqual(expected);
      });
    });

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
        `,
      };
      const expectedDescription = 'Description';
      const expectedKeywords = [
        {
          name: 'note',
          description: 'Node one\n- Line 1\n  Line 2' },
        {
          name: 'note',
          description: 'Node two\n- Line 3' },
        {
          name: 'note',
          description: 'Node three' },
      ];

      return parseComponent(options).then(({ description, keywords }) => {
        expect(description).toEqual(expectedDescription);
        expect(keywords).toEqual(expectedKeywords);
      });
    });
  });

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
        `,
      };
      const expected = 'Usage:\n```\n<my-component @input=\'doSomething\' />\n```';

      return parseComponent(options).then(({ description }) => {
        expect(description).toEqual(expected);
      });
    });

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
        `,
      };
      const expectedDescription = 'Description';
      const expectedKeywords = [
        {
          name: 'note',
          description: 'Node one\n- Line 1\n  Line 2' },
        {
          name: 'note',
          description: 'Node two\n- Line 3' },
        {
          name: 'note',
          description: 'Node three' },
      ];

      return parseComponent(options).then(({ description, keywords }) => {
        expect(description).toEqual(expectedDescription);
        expect(keywords).toEqual(expectedKeywords);
      });
    });
  });

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
        `,
      };

      const expected = [
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          description: 'Overrides entire dialog contents',
          keywords: [],
          name: 'content',
          props: [],
        },
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          description: 'Overrides dialog header',
          keywords: [],
          name: 'header',
          props: [],
        },
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          description: 'Overrides dialog header actions, i.e. default close button',
          keywords: [],
          name: 'actions',
          props: [],
        },
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          description: 'Dialog body',
          keywords: [],
          name: 'default',
          props: [],
        },
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          description: 'Dialog footer',
          keywords: [],
          name: 'footer',
          props: [],
        },
      ];

      return parseComponent(options).then(({ slots }) => {
        expect(slots).toEqual(expected);
      });
    });
  });

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
        `,
      };

      const expected = [
        {
          kind: 'event',
          name: 'close',
          category: undefined,
          description: 'Emits when confirmation dialog is closed',
          arguments: [],
          keywords: [],
          visibility: 'public',
        },
      ];

      return parseComponent(options).then(({ events }) => {
        expect(events).toEqual(expected);
      });
    });

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
        `,
      };

      const expected = [
        {
          kind: 'event',
          name: 'close',
          category: undefined,
          description: 'Emits when confirmation dialog is closed',
          arguments: [],
          keywords: [],
          visibility: 'public',
        },
      ];

      return parseComponent(options).then(({ events }) => {
        expect(events).toEqual(expected);
      });
    });

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
        `,
      };

      const expected = [
        {
          kind: 'event',
          name: 'close',
          category: undefined,
          description: 'Emits when confirmation dialog is closed',
          arguments: [],
          keywords: [],
          visibility: 'public',
        },
      ];

      return parseComponent(options).then(({ events }) => {
        expect(events).toEqual(expected);
      });
    });

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
        `,
      };

      const expected = [
        {
          kind: 'event',
          name: 'close',
          category: undefined,
          description: 'Emits when confirmation dialog is closed',
          arguments: [],
          keywords: [],
          visibility: 'public',
        },
      ];

      return parseComponent(options).then(({ events }) => {
        expect(events).toEqual(expected);
      });
    });

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
        `,
      };

      const expected = [
        {
          kind: 'event',
          name: 'close',
          category: undefined,
          description: 'Emits when confirmation dialog is closed',
          arguments: [],
          keywords: [],
          visibility: 'public',
        },
      ];

      return parseComponent(options).then(({ events }) => {
        expect(events).toEqual(expected);
      });
    });

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
        `,
      };

      const expected = [
        {
          kind: 'event',
          name: 'close',
          category: undefined,
          description: 'Emits when confirmation dialog is closed',
          arguments: [],
          keywords: [],
          visibility: 'public',
        },
      ];

      return parseComponent(options).then(({ events }) => {
        expect(events).toEqual(expected);
      });
    });
  });

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
        `,
      };

      const expected = [
        {
          kind: 'computed',
          name: 'bidule',
          type: 'boolean',
          category: undefined,
          description: undefined,
          dependencies: ['docs', 'name'],
          keywords: [],
          visibility: 'public',
        },
      ];

      return parseComponent(options).then(({ computed }) => {
        expect(computed).toEqual(expected);
      });
    });
  });

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
        `,
      };

      const expected = [
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          type: 'boolean',
          default: 'undefined',
          name: 'v-model',
          describeModel: true,
          required: false,
        },
      ];

      return parseComponent(options).then(({ props }) => {
        expect(props).toEqual(expected);
      });
    });

    it('should parse missing default value', () => {
      const options = {
        features: ['props'],
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
        `,
      };

      const expected = [
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          type: 'boolean',
          default: undefined,
          name: 'v-model',
          describeModel: true,
          required: false,
        },
      ];

      return parseComponent(options).then(({ props }) => {
        expect(props).toEqual(expected);
      });
    });

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
        `,
      };

      const expected = [
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          type: 'boolean',
          default: 'false',
          name: 'bool',
          describeModel: false,
          required: false,
        },
      ];

      return parseComponent(options).then(({ props }) => {
        expect(props).toEqual(expected);
      });
    });

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
        `,
      };

      const expected = [
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          type: 'string',
          default: '"hello"',
          name: 'str',
          describeModel: false,
          required: false,
        },
      ];

      return parseComponent(options).then(({ props }) => {
        expect(props).toEqual(expected);
      });
    });

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
        `,
      };

      const expected = [
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          type: 'number',
          default: '123',
          name: 'int',
          describeModel: false,
          required: false,
        },
      ];

      return parseComponent(options).then(({ props }) => {
        expect(props).toEqual(expected);
      });
    });

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
        `,
      };

      const expected = [
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          type: 'object',
          default: 'null',
          name: 'null',
          describeModel: false,
          required: false,
        },
      ];

      return parseComponent(options).then(({ props }) => {
        expect(props).toEqual(expected);
      });
    });

    it('should parse bigint default value as it', () => {
      const options = {
        features: ['props'],
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
        `,
      };

      const expected = [
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          type: 'bigint',
          default: '100n',
          name: 'bigint',
          describeModel: false,
          required: false,
        },
      ];

      return parseComponent(options).then(({ props }) => {
        expect(props).toEqual(expected);
      });
    });
  });

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
        `,
      };

      return parseComponent(options);
    });

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
        `,
      };

      return parseComponent(options);
    });
  });

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
        `,
      };
      const expected = 'My beautifull component. Usage:\n\n```\n<my-component\n    v-model=\'foo\'\n/>\n```';

      return parseComponent(options).then(({ description }) => {
        expect(description).toEqual(expected);
      });
    });

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
        `,
      };
      const expectedDescription = 'Description';
      const expectedKeywords = [
        {
          name: 'note',
          description: 'Node one\n- Line 1\n  Line 2' },
        {
          name: 'note',
          description: 'Node two\n- Line 3' },
        {
          name: 'note',
          description: 'Node three' },
      ];

      return parseComponent(options).then(({ description, keywords }) => {
        expect(description).toEqual(expectedDescription);
        expect(keywords).toEqual(expectedKeywords);
      });
    });
  });

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
        `,
      };
      const expected = 'Usage:\n```\n<my-component @input=\'doSomething\' />\n```';

      return parseComponent(options).then(({ description }) => {
        expect(description).toEqual(expected);
      });
    });

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
        `,
      };
      const expectedDescription = 'Description';
      const expectedKeywords = [
        {
          name: 'note',
          description: 'Node one\n- Line 1\n  Line 2' },
        {
          name: 'note',
          description: 'Node two\n- Line 3' },
        {
          name: 'note',
          description: 'Node three' },
      ];

      return parseComponent(options).then(({ description, keywords }) => {
        expect(description).toEqual(expectedDescription);
        expect(keywords).toEqual(expectedKeywords);
      });
    });
  });

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
        `,
      };

      const expected = [
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          description: 'Overrides entire dialog contents',
          keywords: [],
          name: 'content',
          props: [],
        },
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          description: 'Overrides dialog header',
          keywords: [],
          name: 'header',
          props: [],
        },
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          description: 'Overrides dialog header actions, i.e. default close button',
          keywords: [],
          name: 'actions',
          props: [],
        },
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          description: 'Dialog body',
          keywords: [],
          name: 'default',
          props: [],
        },
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          description: 'Dialog footer',
          keywords: [],
          name: 'footer',
          props: [],
        },
      ];

      return parseComponent(options).then(({ slots }) => {
        expect(slots).toEqual(expected);
      });
    });
  });

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
        `,
      };

      const expected = [
        {
          kind: 'event',
          name: 'close',
          category: undefined,
          description: 'Emits when confirmation dialog is closed',
          arguments: [],
          keywords: [],
          visibility: 'public',
        },
      ];

      return parseComponent(options).then(({ events }) => {
        expect(events).toEqual(expected);
      });
    });

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
        `,
      };

      const expected = [
        {
          kind: 'event',
          name: 'close',
          category: undefined,
          description: 'Emits when confirmation dialog is closed',
          arguments: [],
          keywords: [],
          visibility: 'public',
        },
      ];

      return parseComponent(options).then(({ events }) => {
        expect(events).toEqual(expected);
      });
    });

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
        `,
      };

      const expected = [
        {
          kind: 'event',
          name: 'close',
          category: undefined,
          description: 'Emits when confirmation dialog is closed',
          arguments: [],
          keywords: [],
          visibility: 'public',
        },
      ];

      return parseComponent(options).then(({ events }) => {
        expect(events).toEqual(expected);
      });
    });

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
        `,
      };

      const expected = [
        {
          kind: 'event',
          name: 'close',
          category: undefined,
          description: 'Emits when confirmation dialog is closed',
          arguments: [],
          keywords: [],
          visibility: 'public',
        },
      ];

      return parseComponent(options).then(({ events }) => {
        expect(events).toEqual(expected);
      });
    });

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
        `,
      };

      const expected = [
        {
          kind: 'event',
          name: 'close',
          category: undefined,
          description: 'Emits when confirmation dialog is closed',
          arguments: [],
          keywords: [],
          visibility: 'public',
        },
      ];

      return parseComponent(options).then(({ events }) => {
        expect(events).toEqual(expected);
      });
    });

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
        `,
      };

      const expected = [
        {
          kind: 'event',
          name: 'close',
          category: undefined,
          description: 'Emits when confirmation dialog is closed',
          arguments: [],
          keywords: [],
          visibility: 'public',
        },
      ];

      return parseComponent(options).then(({ events }) => {
        expect(events).toEqual(expected);
      });
    });
  });

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
        `,
      };

      const expected = [
        {
          kind: 'computed',
          name: 'bidule',
          type: 'boolean',
          category: undefined,
          description: undefined,
          dependencies: ['docs', 'name'],
          keywords: [],
          visibility: 'public',
        },
      ];

      return parseComponent(options).then(({ computed }) => {
        expect(computed).toEqual(expected);
      });
    });
  });

  it('#52 - Prop as array type declaration', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      props: [
        {
          describeModel: true,
          description: 'Badge value',
          keywords: [],
          kind: 'prop',
          name: 'v-model',
          required: false,
          type: [
            'string',
            'number',
          ],
          visibility: 'public',
        },
      ],
    });
  });

  it('#53 - Documenting dynamic slots with @slot', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
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
          props: [],
        },
        {
          kind: 'slot',
          visibility: 'public',
          description: 'A default slot',
          keywords: [],
          name: 'default',
          props: [],
        },
      ],
    });
  });

  it('#53 - Documenting dynamic slots with @slot on template', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      slots: [
        {
          kind: 'slot',
          visibility: 'public',
          description: 'A title slot',
          keywords: [],
          name: 'title',
          props: [],
        },
        {
          kind: 'slot',
          visibility: 'public',
          description: 'A default slot',
          keywords: [],
          name: 'default',
          props: [],
        },
      ],
    });
  });

  it("#56 - Cannot read property 'type' of null (UiAutocomplete.vue)", async () => {
    const options = {
      filecontent: await Fixture.get('UiAutocomplete.vue'),
    };

    await expect(options).toParseAs({
      inheritAttrs: true,
      errors: [],
      warnings: [],
      name: 'ui-autocomplete',
      keywords: [],
      slots: [
        {
          kind: 'slot',
          visibility: 'public',
          keywords: [],
          name: 'icon',
          props: [],
        },
        {
          kind: 'slot',
          visibility: 'public',
          keywords: [],
          name: 'default',
          props: [],
        },
        {
          kind: 'slot',
          visibility: 'public',
          keywords: [],
          name: 'suggestion',
          props: [],
        },
        {
          kind: 'slot',
          visibility: 'public',
          keywords: [],
          name: 'error',
          props: [],
        },
        {
          kind: 'slot',
          visibility: 'public',
          keywords: [],
          name: 'help',
          props: [],
        },
      ],
      props: [
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'name',
          type: 'string',
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'placeholder',
          type: 'string',
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'v-model',
          type: [
            'string',
            'number',
          ],
          default: '""',
          required: false,
          describeModel: true,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'icon',
          type: 'string',
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'icon-position',
          type: 'string',
          default: '"left"',
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'label',
          type: 'string',
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'floating-label',
          type: 'boolean',
          default: 'false',
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'help',
          type: 'string',
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'error',
          type: 'string',
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'readonly',
          type: 'boolean',
          default: 'false',
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'disabled',
          type: 'boolean',
          default: 'false',
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'type',
          type: 'string',
          default: '"simple"',
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'suggestions',
          type: 'array',
          default: '[]',
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'limit',
          type: 'number',
          default: '8',
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'append',
          type: 'boolean',
          default: 'false',
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'append-delimiter',
          type: 'string',
          default: '", "',
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'min-chars',
          type: 'number',
          default: '2',
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'show-on-up-down',
          type: 'boolean',
          default: 'true',
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'autofocus',
          type: 'boolean',
          default: 'false',
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'filter',
          type: 'function',
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'highlight-on-first-match',
          type: 'boolean',
          default: 'true',
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'cycle-highlight',
          type: 'boolean',
          default: 'true',
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'keys',
          type: 'object',
          default: '{"label":"label","value":"value","image":"image"}',
          required: false,
          describeModel: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'invalid',
          type: 'boolean',
          default: 'false',
          required: false,
          describeModel: false,
        },
      ],
      data: [
        {
          kind: 'data',
          visibility: 'public',
          keywords: [],
          name: 'initialValue',
          type: 'unknown',
          initialValue: 'this.value',
        },
        {
          kind: 'data',
          visibility: 'public',
          keywords: [],
          name: 'isActive',
          type: 'boolean',
          initialValue: 'false',
        },
        {
          kind: 'data',
          visibility: 'public',
          keywords: [],
          name: 'isTouched',
          type: 'boolean',
          initialValue: 'false',
        },
        {
          kind: 'data',
          visibility: 'public',
          keywords: [],
          name: 'showDropdown',
          type: 'boolean',
          initialValue: 'false',
        },
        {
          kind: 'data',
          visibility: 'public',
          keywords: [],
          name: 'highlightedIndex',
          type: 'number',
          initialValue: '-1',
        },
      ],
      computed: [
        {
          kind: 'computed',
          visibility: 'public',
          type: 'array',
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
            'hasFloatingLabel',
          ],
        },
        {
          kind: 'computed',
          visibility: 'public',
          type: 'object',
          keywords: [],
          name: 'labelClasses',
          dependencies: [
            'hasFloatingLabel',
            'isLabelInline',
          ],
        },
        {
          kind: 'computed',
          visibility: 'public',
          type: 'boolean',
          keywords: [],
          name: 'hasLabel',
          dependencies: [
            'label',
            '$slots',
          ],
        },
        {
          kind: 'computed',
          visibility: 'public',
          type: 'boolean',
          keywords: [],
          name: 'hasFloatingLabel',
          dependencies: [
            'hasLabel',
            'floatingLabel',
          ],
        },
        {
          kind: 'computed',
          visibility: 'public',
          type: 'boolean',
          keywords: [],
          name: 'isLabelInline',
          dependencies: [
            'valueLength',
            'isActive',
          ],
        },
        {
          kind: 'computed',
          visibility: 'public',
          type: 'number',
          keywords: [],
          name: 'valueLength',
          dependencies: [
            'value',
          ],
        },
        {
          kind: 'computed',
          visibility: 'public',
          type: 'boolean',
          keywords: [],
          name: 'hasFeedback',
          dependencies: [
            'help',
            'error',
            '$slots',
          ],
        },
        {
          kind: 'computed',
          visibility: 'public',
          type: 'boolean',
          keywords: [],
          name: 'showError',
          dependencies: [
            'invalid',
            'error',
            '$slots',
          ],
        },
        {
          kind: 'computed',
          visibility: 'public',
          type: 'boolean',
          keywords: [],
          name: 'showHelp',
          dependencies: [
            'showError',
            'help',
            '$slots',
          ],
        },
        {
          kind: 'computed',
          visibility: 'public',
          type: 'unknown',
          keywords: [],
          name: 'matchingSuggestions',
          dependencies: [
            'suggestions',
            'filter',
            'value',
            'defaultFilter',
            'limit',
          ],
        },
      ],
      events: [
        {
          kind: 'event',
          visibility: 'public',
          keywords: [],
          name: 'select',
          arguments: [
            {
              name: 'suggestion',
              type: 'unknown',
              rest: false,
            },
          ],
        },
        {
          kind: 'event',
          visibility: 'public',
          keywords: [],
          name: 'highlight-overflow',
          arguments: [
            {
              name: 'index',
              type: 'number',
              rest: false,
            },
          ],
        },
        {
          kind: 'event',
          visibility: 'public',
          keywords: [],
          name: 'highlight',
          arguments: [
            {
              name: 'suggestion',
              type: 'unknown',
              rest: false,
            },
            {
              name: 'index',
              type: 'number',
              rest: false,
            },
          ],
        },
        {
          kind: 'event',
          visibility: 'public',
          keywords: [],
          name: 'dropdown-open',
          arguments: [],
        },
        {
          kind: 'event',
          visibility: 'public',
          keywords: [],
          name: 'dropdown-close',
          arguments: [],
        },
        {
          kind: 'event',
          visibility: 'public',
          keywords: [],
          name: 'input',
          arguments: [
            {
              name: 'value',
              type: 'unknown',
              rest: false,
            },
          ],
        },
        {
          kind: 'event',
          visibility: 'public',
          keywords: [],
          name: 'focus',
          arguments: [
            {
              name: 'e',
              type: 'unknown',
              rest: false,
            },
          ],
        },
        {
          kind: 'event',
          visibility: 'public',
          keywords: [],
          name: 'change',
          arguments: [
            {
              name: 'value',
              type: [
                'string',
                'number',
              ],
              rest: false,
            },
            {
              name: 'e',
              type: 'unknown',
              rest: false,
            },
          ],
        },
        {
          kind: 'event',
          visibility: 'public',
          keywords: [],
          name: 'blur',
          arguments: [
            {
              name: 'e',
              type: 'unknown',
              rest: false,
            },
          ],
        },
        {
          kind: 'event',
          visibility: 'public',
          keywords: [],
          name: 'touch',
          arguments: [],
        },
      ],
      methods: [
        {
          kind: 'method',
          syntax: [
            'defaultFilter(suggestion: unknown): unknown',
          ],
          visibility: 'public',
          keywords: [],
          name: 'defaultFilter',
          params: [
            {
              name: 'suggestion',
              type: 'unknown',
              rest: false,
            },
          ],
          returns: {
            type: 'unknown',
          },
        },
        {
          kind: 'method',
          syntax: [
            'selectSuggestion(suggestion: unknown): void',
          ],
          visibility: 'public',
          keywords: [],
          name: 'selectSuggestion',
          params: [
            {
              name: 'suggestion',
              type: 'unknown',
              rest: false,
            },
          ],
          returns: {
            type: 'void',
          },
        },
        {
          kind: 'method',
          syntax: [
            'highlightSuggestion(index: unknown): void',
          ],
          visibility: 'public',
          keywords: [],
          name: 'highlightSuggestion',
          params: [
            {
              name: 'index',
              type: 'unknown',
              rest: false,
            },
          ],
          returns: {
            type: 'void',
          },
        },
        {
          kind: 'method',
          syntax: [
            'selectHighlighted(index: unknown, e: unknown): void',
          ],
          visibility: 'public',
          keywords: [],
          name: 'selectHighlighted',
          params: [
            {
              name: 'index',
              type: 'unknown',
              rest: false,
            },
            {
              name: 'e',
              type: 'unknown',
              rest: false,
            },
          ],
          returns: {
            type: 'void',
          },
        },
        {
          kind: 'method',
          syntax: [
            'openDropdown(): void',
          ],
          visibility: 'public',
          keywords: [],
          name: 'openDropdown',
          params: [],
          returns: {
            type: 'void',
          },
        },
        {
          kind: 'method',
          syntax: [
            'closeDropdown(): void',
          ],
          visibility: 'public',
          keywords: [],
          name: 'closeDropdown',
          params: [],
          returns: {
            type: 'void',
          },
        },
        {
          kind: 'method',
          syntax: [
            'updateValue(value: unknown): void',
          ],
          visibility: 'public',
          keywords: [],
          name: 'updateValue',
          params: [
            {
              name: 'value',
              type: 'unknown',
              rest: false,
            },
          ],
          returns: {
            type: 'void',
          },
        },
        {
          kind: 'method',
          syntax: [
            'onFocus(e: unknown): void',
          ],
          visibility: 'public',
          keywords: [],
          name: 'onFocus',
          params: [
            {
              name: 'e',
              type: 'unknown',
              rest: false,
            },
          ],
          returns: {
            type: 'void',
          },
        },
        {
          kind: 'method',
          syntax: [
            'onChange(e: unknown): void',
          ],
          visibility: 'public',
          keywords: [],
          name: 'onChange',
          params: [
            {
              name: 'e',
              type: 'unknown',
              rest: false,
            },
          ],
          returns: {
            type: 'void',
          },
        },
        {
          kind: 'method',
          syntax: [
            'onBlur(e: unknown): void',
          ],
          visibility: 'public',
          keywords: [],
          name: 'onBlur',
          params: [
            {
              name: 'e',
              type: 'unknown',
              rest: false,
            },
          ],
          returns: {
            type: 'void',
          },
        },
        {
          kind: 'method',
          syntax: [
            'onExternalClick(e: unknown): void',
          ],
          visibility: 'public',
          keywords: [],
          name: 'onExternalClick',
          params: [
            {
              name: 'e',
              type: 'unknown',
              rest: false,
            },
          ],
          returns: {
            type: 'void',
          },
        },
        {
          kind: 'method',
          syntax: [
            'reset(): void',
          ],
          visibility: 'public',
          keywords: [],
          name: 'reset',
          params: [],
          returns: {
            type: 'void',
          },
        },
      ],
    });
  });

  it("#56 - Cannot read property 'type' of null (UiAutocompleteMinimal.vue)", async () => {
    const options = {
      filecontent: `
        <template>
            <div>

            </div>
        </template>

        <script>


        export default {
            name: 'ui-autocomplete',
            methods: {
                selectSuggestion(suggestion) {
                    let value;

                    if (this.append) {
                        value += this.appendDelimiter + (suggestion[this.keys.value] || suggestion);
                    } else {
                        value = suggestion[this.keys.value] || suggestion;
                    }

                    this.updateValue(value);
                    this.$emit('select', suggestion);

                    this.$nextTick(() => {
                        this.closeDropdown();
                        this.$refs.input.focus();
                    });
                }
            },
        };
        </script>

      `,
    };

    await expect(options).toParseAs({
      errors: [],
      name: 'ui-autocomplete',
      methods: [
        {
          keywords: [],
          kind: 'method',
          syntax: [
            'selectSuggestion(suggestion: unknown): void',
          ],
          name: 'selectSuggestion',
          params: [
            {
              name: 'suggestion',
              type: 'unknown',
              rest: false,
            },
          ],
          returns: {
            type: 'void',
          },
          visibility: 'public',
        },
      ],
      events: [
        {
          name: 'select',
          keywords: [],
          arguments: [
            {
              name: 'suggestion',
              type: 'unknown',
              rest: false,
            },
          ],
          kind: 'event',
          visibility: 'public',
        },
      ],
    });
  });

  it("#56 - Cannot read property 'type' of null (UiAutocompleteMinimalWorking.vue)", async () => {
    const options = {
      filecontent: `
        <template>
            <div>
                
            </div>
        </template>
        
        <script>
        
        
        export default {
            name: 'ui-autocomplete',
            methods: {
                selectSuggestion(suggestion) {
        
                    if (this.append) {
                        value += this.appendDelimiter + (suggestion[this.keys.value] || suggestion);
                    } else {
                        value = suggestion[this.keys.value] || suggestion;
                    }
        
                    this.updateValue(value);
                    this.$emit('select', suggestion);
        
                    this.$nextTick(() => {
                        this.closeDropdown();
                        this.$refs.input.focus();
                    });
                }
            },
        };
        </script>
      `,
    };

    await expect(options).toParseAs({
      name: 'ui-autocomplete',
      errors: [],
      methods: [
        {
          keywords: [],
          kind: 'method',
          syntax: [
            'selectSuggestion(suggestion: unknown): void',
          ],
          name: 'selectSuggestion',
          params: [
            {
              name: 'suggestion',
              type: 'unknown',
              rest: false,
            },
          ],
          returns: {
            type: 'void',
          },
          visibility: 'public',
        },
      ],
      events: [
        {
          name: 'select',
          keywords: [],
          arguments: [
            {
              name: 'suggestion',
              type: 'unknown',
              rest: false,
            },
          ],
          kind: 'event',
          visibility: 'public',
        },
      ],
    });
  });

  it('#59 - Parser fails when props have an empty validator block', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      props: [
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          name: 'my-prop',
          type: 'unknown',
          required: false,
          describeModel: false,
        },
      ],
    });
  });

  it('#60 - Parser fails when passing an arrow function with no body brackets to another function', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'example(): void',
          ],
          name: 'example',
          visibility: 'public',
          keywords: [],
          params: [],
          returns: {
            type: 'void',
          },
        },
      ],
    });
  });

  it('#61 - Parsing event fails when event name is non-primitive value', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'close(): void',
          ],
          name: 'close',
          visibility: 'public',
          description: 'Close modal',
          keywords: [],
          params: [],
          returns: {
            type: 'void',
          },
        },
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
              name: 'true',
              rest: false,
            },
          ],
        },
      ],
    });
  });

  it('#62 - @ symbol breaks comment parsing', async () => {
    const options = {
      filecontent: `
        <script>
          /**
           * Defines if \`bleed@small\` class should be added to component for mobile view
           */
          export default {}
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      description: 'Defines if `bleed@small` class should be added to component for mobile view',
    });
  });

  it('#66 - @returns with type', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'sum(a: number, b: number): number',
          ],
          name: 'sum',
          visibility: 'public',
          description: 'Returns the sum of a and b',
          keywords: [],
          params: [
            {
              name: 'a',
              type: 'number',
              rest: false,
            },
            {
              name: 'b',
              type: 'number',
              rest: false,
            },
          ],
          returns: {
            type: 'number',
          },
        },
      ],
    });
  });

  it('#76 - Support for @link params', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'myFunction(): void',
          ],
          name: 'myFunction',
          keywords: [],
          category: undefined,
          description: 'See {@link MyClass} and [MyClass\'s foo property]{@link MyClass#foo}.\nAlso, check out {@link http://www.google.com|Google} and\n{@link https://github.com GitHub}.',
          params: [],
          returns: {
            type: 'void',
            description: undefined,
          },
          visibility: 'public' },
      ],
    });
  });

  it("#77 - Parsing TypeScript methods doesn't work correctly", async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      name: 'TestMixinFactory',
      errors: [],
      props: [],
      computed: [],
      events: [],
      methods: [
        {
          description: 'Testing',
          keywords: [],
          kind: 'method',
          syntax: [
            'myFunction(test: Record<string, any>): Record<string, any>',
          ],
          name: 'myFunction',
          params: [
            {
              name: 'test',
              type: 'Record<string, any>',
              description: '<-- Parser stops with error',
              rest: false,
            },
          ],
          returns: {
            description: '<-- Gets parsed as description',
            type: 'Record<string, any>',
          },
          visibility: 'public',
        },
      ],
    });
  });

  it('#80 - Parser issue with !(...)', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      data: [
        {
          kind: 'data',
          visibility: 'public',
          keywords: [],
          name: 'a',
          type: 'unknown',
          initialValue: 'undefined',
        },
        {
          kind: 'data',
          visibility: 'public',
          keywords: [],
          name: 'b',
          type: 'unknown',
          initialValue: 'undefined',
        },
        {
          kind: 'data',
          visibility: 'public',
          keywords: [],
          name: 'c',
          type: 'number',
          initialValue: '0',
        },
        {
          kind: 'data',
          visibility: 'public',
          keywords: [],
          name: 'd',
          type: 'unknown',
          initialValue: '!(a || b || c)',
        },
        {
          kind: 'data',
          visibility: 'public',
          keywords: [],
          name: 'e',
          type: 'boolean',
          initialValue: 'false',
        },
        {
          kind: 'data',
          visibility: 'public',
          keywords: [],
          name: 'f',
          type: 'boolean',
          initialValue: '!!d',
        },
      ],
    });
  });

  it('#83 - Parser issue with !(...)', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'myFunction(test: Promise<string>): number',
          ],
          name: 'myFunction',
          description: 'Testing',
          visibility: 'public',
          keywords: [],
          params: [
            {
              name: 'test',
              type: 'Promise<string>',
              rest: false,
            },
          ],
          returns: {
            type: 'number',
          },
        },
      ],
    });
  });

  it('#83 - Issue with arrow function', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      name: 'TestComponent',
      errors: [],
      methods: [
        {
          kind: 'method',
          syntax: [
            'test(): void',
          ],
          name: 'test',
          visibility: 'public',
          keywords: [],
          params: [],
          returns: {
            type: 'void',
          },
        },
      ],
    });
  });

  it('vuedoc/md#19 - does not render default param values for function', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      methods: [
        {
          kind: 'method',
          syntax: [
            'load(schema: object, model: Number | String | Array | Object | Boolean = "hello"): void',
          ],
          name: 'load',
          visibility: 'public',
          category: undefined,
          description: 'Load the given `schema` with initial filled `value`\nUse this to load async schema.',
          keywords: [
            {
              name: 'Note',
              description: '`model` is not a two-way data bindings.\nTo get the form data, use the `v-model` directive.',
            },
          ],
          params: [
            {
              name: 'schema',
              type: 'object',
              description: 'The JSON Schema object to load',
              defaultValue: undefined,
              rest: false,
            },
            {
              name: 'model',
              type: ['number', 'string', 'array', 'object', 'boolean'],
              description: 'The initial data for the schema.',
              defaultValue: '"hello"',
              rest: false,
            },
          ],
          returns: {
            type: 'void',
            description: undefined,
          },
        },
        {
          kind: 'method',
          syntax: [
            'number(model: number = 123): void',
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
              rest: false,
            },
          ],
          returns: {
            type: 'void',
            description: undefined,
          },
        },
        {
          kind: 'method',
          syntax: [
            'withImplicitUndefinedReturn(schema: object): unknown',
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
              rest: false,
            },
          ],
          returns: {
            type: 'unknown',
            description: undefined,
          },
        },
        {
          kind: 'method',
          syntax: [
            'withExplicitUndefinedReturn(schema: object): void',
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
              rest: false,
            },
          ],
          returns: {
            type: 'void',
            description: 'undefined',
          },
        },
        {
          kind: 'method',
          syntax: [
            'withExplicitReturn(): int',
          ],
          name: 'withExplicitReturn',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          params: [],
          returns: {
            type: 'int',
            description: '123',
          },
        },
      ],
    });
  });

  it('#84 - Method parameters not parsed correctly (typescript)', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      name: 'TestComponent',
      methods: [
        {
          kind: 'method',
          syntax: [
            'test(a: string): boolean',
          ],
          name: 'test',
          visibility: 'public',
          keywords: [],
          params: [
            {
              name: 'a',
              type: 'string',
              rest: false,
            },
          ],
          returns: {
            type: 'boolean',
          },
        },
      ],
    });
  });

  it('vuedoc/md#84 - Multiline default breaks table', async () => {
    const options = {
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
                        type: Object as PropOptions<Record<string, any>>,
                        default: () => ({
                            a: 1,
                            b: 2,
                        })
                    },
                    testProp2: String,
                }
            })
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      name: 'TestComponent',
      props: [
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          type: 'Record<string, any>',
          default: '{"a":1,"b":2}',
          name: 'test-prop',
          describeModel: false,
          required: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          type: 'string',
          name: 'test-prop2',
          describeModel: false,
          required: false,
        },
      ],
    });
  });

  it('#87 - Typescript Parser Error', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      name: 'TestComponent',
      props: [],
      data: [],
      computed: [],
      events: [],
      methods: [],
      slots: [],
    });
  });

  it('#91 - crash when parsing event with anonymous object as value', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      warnings: [
        "Invalid JSDoc syntax: '{Object} {name, val} - foo event param description'",
      ],
      errors: [],
      props: [],
      data: [],
      computed: [],
      events: [
        {
          arguments: [
            {
              name: '{ name: "foo-name", val: "voo-val" }',
              rest: false,
              type: 'object',
            },
          ],
          description: 'Foo event description',
          keywords: [],
          kind: 'event',
          name: 'foo-event',
          visibility: 'public',
        },
      ],
      methods: [],
      slots: [],
    });
  });

  it('#97 - @vuedoc/parser parse class component with error', async () => {
    const options = {
      filecontent: `
        <template>
          <div>test code</div>
        </template>
        <script lang="ts">
        import { Component, Vue, Prop } from 'vue-property-decorator';
        import { State } from 'vuex-class';
        @Component({
          name: 'create-menu-list',
          components: {
          },
        })
        export default class createMenuList extends Vue {

          @State('pageItemList') pageItemList!: any;

          @State('pageTreeList') pageTreeList!: any;

          @Prop() groups!: any;
          
          token: any = localStorage.getItem('devToken');
        }
        </script>
      `,
    };

    await expect(options).toParseAs({
      warnings: [],
      errors: [],
      name: 'create-menu-list',
      props: [
        {
          describeModel: false,
          keywords: [],
          kind: 'prop',
          name: 'groups',
          required: false,
          type: 'any',
          visibility: 'public',
        },
      ],
      data: [
        {
          initialValue: 'null',
          keywords: [],
          kind: 'data',
          name: 'pageItemList',
          type: 'any',
          visibility: 'public',
        },
        {
          initialValue: 'null',
          keywords: [],
          kind: 'data',
          name: 'pageTreeList',
          type: 'any',
          visibility: 'public',
        },
        {
          initialValue: "localStorage.getItem('devToken')",
          keywords: [],
          kind: 'data',
          name: 'token',
          type: 'any',
          visibility: 'public',
        },
      ],
      computed: [],
      events: [],
      methods: [],
      slots: [],
    });
  });

  it('#101 - rest operator is not supported?', async () => {
    const options = {
      filecontent: `
        <script>
          export default {
            data() {
              return {
                test: "123",
                cWidth: "200px"
              };
            },
            created() {
              const { test, ...rest } = this;
            },
          };
        </script>
      `,
    };

    await expect(options).toParseAs({
      warnings: [],
      errors: [],
      events: [],
      data: [
        {
          initialValue: '"123"',
          keywords: [],
          kind: 'data',
          name: 'test',
          type: 'string',
          visibility: 'public',
        },
        {
          initialValue: '"200px"',
          keywords: [],
          kind: 'data',
          name: 'cWidth',
          type: 'string',
          visibility: 'public',
        },
      ],
      props: [],
      methods: [],
      slots: [],
    });
  });

  it("#102 - EventParser.js:33 Uncaught TypeError: Cannot read property 'raw' of undefined", async () => {
    const options = {
      filecontent: `
        <template>
          <div class="input-div">
            <div class="input-title" v-if="title" :style="{width: labelWidth + 'px'}">{{ title }}:</div>
            <!-- <label :width="labelWidth">{{ title }}:</label> -->
            <div class="ant-input-class">
              <a-input
                class="hm-ant-input"
                :addonAfter="addonAfter"
                :addonBefore="addonBefore"
                v-model:value="cValue"
                allowClear
                @change="onChange"
                @pressEnter="onPressEnter"
              >
              <template #prefix>
                  <i :class="prefixicon"></i>
                <!-- <user-outlined type="user" /> -->
              </template>
              <template #suffix>
                <i :class="suffixicon"></i>
              </template>
              </a-input>
            </div>
          </div>
        </template>

        <script>
          export default {
            name: "HmAntInput",
            props: {
              /**
               * 值
               * @v-model
               */
              value: {
                type: String,
              },
              /**
               * 前缀图标
               * @type Icon
               */
              prefixicon: {
                type: String,
              },
              /**
               * 后缀图标
               * @type Icon
               *
               */
              suffixicon: {
                type: String,
              },

              /**
               * 标题
               */
              title: {
                type: String,
                default: "输入框",
              },

              /**
               * 输入框宽度
               */
              width: {
                type: String,
                default: "200",
              },
              /**
               * 标题宽度
               */
              labelWidth:{
                type:Number
              }
            },
            watch: {
              value(value) {
                this.cValue = value;
              },
              width(value) {
                this.cWidth = this.getCssUnit(value);
              },
            },
            mounted() {
              this.cValue = this.value;
              this.cWidth = this.getCssUnit(this.width);
            },
            data() {
              return {
                cValue: "",
                cWidth: "200px"
              };
            },
            methods: {
              onChange: function (e) {
                console.log('onChange: ', e);

                this.$emit("update:valuex", cValue);
                this.$emit("update:value", this.cValue);
                this.$emit("change", e);
              },
              onPressEnter: function (e) {
                this.$emit("pressEnter",e);
              },
              getCssUnit(value) {
                if (isNaN(Number(value))) {
                  return value;
                }
                return \`\${value}px\`;
              },
            },
          };
        </script>
      `,
    };

    await expect(options).toParseAs({
      warnings: [],
      errors: [],
      name: 'HmAntInput',
      events: [
        {
          arguments: [
            {
              name: 'cValue',
              rest: false,
              type: 'unknown',
            },
          ],
          keywords: [],
          kind: 'event',
          name: 'update:valuex',
          visibility: 'public',
        },
        {
          arguments: [
            {
              name: 'cValue',
              rest: false,
              type: 'string',
            },
          ],
          keywords: [],
          kind: 'event',
          name: 'update:value',
          visibility: 'public',
        },
        {
          arguments: [
            {
              name: 'e',
              rest: false,
              type: 'unknown',
            },
          ],
          keywords: [],
          kind: 'event',
          name: 'change',
          visibility: 'public',
        },
        {
          arguments: [
            {
              name: 'e',
              rest: false,
              type: 'unknown',
            },
          ],
          keywords: [],
          kind: 'event',
          name: 'press-enter',
          visibility: 'public',
        },
      ],
      data: [
        {
          initialValue: '""',
          keywords: [],
          kind: 'data',
          name: 'cValue',
          type: 'string',
          visibility: 'public',
        },
        {
          initialValue: '"200px"',
          keywords: [],
          kind: 'data',
          name: 'cWidth',
          type: 'string',
          visibility: 'public',
        },
      ],
      props: [
        {
          describeModel: true,
          description: '值',
          keywords: [
            {
              name: 'v-model',
            },
          ],
          kind: 'prop',
          name: 'v-model',
          required: false,
          type: 'string',
          visibility: 'public',
        },
        {
          describeModel: false,
          description: '前缀图标',
          keywords: [],
          kind: 'prop',
          name: 'prefixicon',
          required: false,
          type: 'Icon',
          visibility: 'public',
        },
        {
          describeModel: false,
          description: '后缀图标',
          keywords: [],
          kind: 'prop',
          name: 'suffixicon',
          required: false,
          type: 'Icon',
          visibility: 'public',
        },
        {
          default: '"输入框"',
          describeModel: false,
          description: '标题',
          keywords: [],
          kind: 'prop',
          name: 'title',
          required: false,
          type: 'string',
          visibility: 'public',
        },
        {
          default: '"200"',
          describeModel: false,
          description: '输入框宽度',
          keywords: [],
          kind: 'prop',
          name: 'width',
          required: false,
          type: 'string',
          visibility: 'public',
        },
        {
          describeModel: false,
          description: '标题宽度',
          keywords: [],
          kind: 'prop',
          name: 'label-width',
          required: false,
          type: 'number',
          visibility: 'public',
        },
      ],
      methods: [
        {
          keywords: [],
          kind: 'method',
          name: 'onChange',
          params: [
            {
              name: 'e',
              rest: false,
              type: 'unknown',
            },
          ],
          returns: {
            type: 'void',
          },
          syntax: [
            'onChange(e: unknown): void',
          ],
          visibility: 'public',
        },
        {
          keywords: [],
          kind: 'method',
          name: 'onPressEnter',
          params: [
            {
              name: 'e',
              rest: false,
              type: 'unknown',
            },
          ],
          returns: {
            type: 'void',
          },
          syntax: [
            'onPressEnter(e: unknown): void',
          ],
          visibility: 'public',
        },
        {
          keywords: [],
          kind: 'method',
          name: 'getCssUnit',
          params: [
            {
              name: 'value',
              rest: false,
              type: 'unknown',
            },
          ],
          returns: {
            type: 'string',
          },
          syntax: [
            'getCssUnit(value: unknown): string',
          ],
          visibility: 'public',
        },
      ],
      slots: [],
    });
  });

  it('#103 - "...rest" as return value causes error', async () => {
    const options = {
      filecontent: `
        <script>
          export default {
            data: () => ({
              something: '',
              name: '',
              city: '',
            }),
            computed: {
              test() {
                const { something, ...rest } = this;
                return { something, ...rest };
              },
              test2() {
                const { something: hello, name, ...rest } = this;
                return { hello, name, ...rest };
              },
              test3() {
                const { something = 'hello', name, ...rest } = this;
                return { hello, name, ...rest };
              },
              test4() {
                const { something = 'hello', name, ...rest } = this;
                return { hello, [name]: 'hello', ...rest };
              },
              test5() {
                const { something = 'hello', name = something, ...rest } = this;
                return { hello, name, ...rest };
              },
            },
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      warnings: [],
      errors: [],
      computed: [
        {
          dependencies: [
            'something',
          ],
          keywords: [],
          kind: 'computed',
          name: 'test',
          type: 'object',
          visibility: 'public',
        },
        {
          dependencies: [
            'something',
            'name',
          ],
          keywords: [],
          kind: 'computed',
          name: 'test2',
          type: 'object',
          visibility: 'public',
        },
        {
          dependencies: [
            'something',
            'name',
          ],
          keywords: [],
          kind: 'computed',
          name: 'test3',
          type: 'object',
          visibility: 'public',
        },
        {
          dependencies: [
            'something',
            'name',
          ],
          keywords: [],
          kind: 'computed',
          name: 'test4',
          type: 'object',
          visibility: 'public',
        },
        {
          dependencies: [
            'something',
            'name',
          ],
          keywords: [],
          kind: 'computed',
          name: 'test5',
          type: 'object',
          visibility: 'public',
        },
      ],
    });
  });

  it('#104 - error if $emit param has the same name as a prop', async () => {
    const options = {
      filecontent: `
        <script>
          export default {
            props: {
              something: {
                type: String,
                required: true,
              },
            },
            methods: {
              test(something) {
                this.$emit('update:test', something);
              },
              test2() {
                this.$emit('update:test2', this.something);
              },
              test3(something = 'hello') {
                this.$emit('update:test3', something);
              },
            },
          };
        </script>
      `,
    };

    await expect(options).toParseAs({
      warnings: [],
      errors: [],
      props: [
        {
          describeModel: false,
          keywords: [],
          kind: 'prop',
          name: 'something',
          required: true,
          type: 'string',
          visibility: 'public',
        },
      ],
      events: [
        {
          arguments: [
            {
              name: 'something',
              rest: false,
              type: 'unknown',
            },
          ],
          keywords: [],
          kind: 'event',
          name: 'update:test',
          visibility: 'public',
        },
        {
          arguments: [
            {
              name: 'something',
              rest: false,
              type: 'string',
            },
          ],
          keywords: [],
          kind: 'event',
          name: 'update:test2',
          visibility: 'public',
        },
        {
          arguments: [
            {
              name: 'something',
              rest: false,
              type: 'string',
            },
          ],
          keywords: [],
          kind: 'event',
          name: 'update:test3',
          visibility: 'public',
        },
      ],
    });
  });

  it('#107 - Arguments length for event is wrong', async () => {
    const options = {
      filecontent: `
        <script>
          export default {
            mounted() {
              /**
               * Wrong arguments length
               *
               * @arg {string} 'accepts' Hello
               */
              this.$emit('work', 'accepts');


              const complicatedCondition = !this.wrong && this.correct || this.okay;
              
              /**
               * Weird name && too much arguments
               *
               * @arg {boolean} complicatedCondition
               */
              this.$emit('work2', complicatedCondition);
              
              /**
               * Weird name && too much arguments
               */
              this.$emit('work3', !this.wrong && this.correct || this.okay);
            },
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      warnings: [],
      errors: [],
      events: [
        {
          arguments: [
            {
              description: 'Hello',
              name: '"accepts"',
              rest: false,
              type: 'string',
            },
          ],
          description: 'Wrong arguments length',
          keywords: [],
          kind: 'event',
          name: 'work',
          visibility: 'public',
        },
        {
          arguments: [
            {
              name: 'complicatedCondition',
              rest: false,
              type: 'boolean',
            },
          ],
          description: 'Weird name && too much arguments',
          keywords: [],
          kind: 'event',
          name: 'work2',
          visibility: 'public',
        },
        {
          arguments: [
            {
              name: '!this.wrong && this.correct || this.okay',
              rest: false,
              type: 'boolean',
            },
          ],
          description: 'Weird name && too much arguments',
          keywords: [],
          kind: 'event',
          name: 'work3',
          visibility: 'public',
        },
      ],
    });
  });

  it('#106 - $emit is ignored if it is inside an else statement', async () => {
    const options = {
      filecontent: `
        <script>
          export default {
            mounted() {
              if (true) {
                this.$emit('work'); // work
              } else {
                this.$emit('nope'); // only one event is in the events array
              }
            },
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      warnings: [],
      errors: [],
      events: [
        {
          arguments: [],
          keywords: [],
          kind: 'event',
          name: 'work',
          visibility: 'public',
        },
        {
          arguments: [],
          keywords: [],
          kind: 'event',
          name: 'nope',
          visibility: 'public',
        },
      ],
    });
  });

  it("#105 - $emit inside an arrow function don't show up in events array", async () => {
    const options = {
      filecontent: `
        <script>
          export default {
            mounted() {
              this.$emit('work');
              setTimeout(() => {
                this.$emit('nope');
              }, 5000);
            },
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      warnings: [],
      errors: [],
      events: [
        {
          arguments: [],
          keywords: [],
          kind: 'event',
          name: 'work',
          visibility: 'public',
        },
        {
          arguments: [],
          keywords: [],
          kind: 'event',
          name: 'nope',
          visibility: 'public',
        },
      ],
    });
  });

  it('md#50 - Destructuring an object property with the same name as a data property causes parsing to fail', async () => {
    const options = {
      filecontent: `
        <script>
          export default {
            data() {
              return {
                myProp: null,
              };
            },
            methods: {
              getMyProp() {
                  const { myProp } = { myProp: null };
  
                  return myProp;
              },
            },  
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      warnings: [],
      errors: [],
      data: [
        {
          kind: 'data',
          name: 'myProp',
          initialValue: 'null',
          keywords: [],
          type: 'unknown',
          visibility: 'public',
        },
      ],
      methods: [
        {
          kind: 'method',
          name: 'getMyProp',
          keywords: [],
          visibility: 'public',
          params: [],
          returns: {
            type: 'unknown',
          },
          syntax: [
            'getMyProp(): unknown',
          ],
        },
      ],
    });
  });
});
