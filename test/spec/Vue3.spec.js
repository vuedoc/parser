import { describe } from '@jest/globals';
import { ComponentTestCase } from '../lib/TestUtils.js';

describe('Vue 3', () => {
  describe('General Usage', () => {
    ComponentTestCase({
      name: 'defineComponent()',
      options: {
        filecontent: `
          <script>
            import { defineComponent } from 'vue'

            export default defineComponent({
              // type inference enabled
              props: {
                name: String,
                msg: { type: String, required: true }
              },
              data() {
                return {
                  count: 1
                }
              },
              mounted() {
                this.name // type: string | undefined
                this.msg // type: string
                this.count // type: number
              }
            })
          </script>
        `,
      },
      expected: {
        errors: [],
        warnings: [],
        data: [
          {
            kind: 'data',
            name: 'count',
            type: 'number',
            category: undefined,
            version: undefined,
            description: undefined,
            initialValue: '1',
            keywords: [],
            visibility: 'public' },
        ],
        props: [
          {
            kind: 'prop',
            name: 'name',
            type: 'string',
            category: undefined,
            version: undefined,
            description: undefined,
            default: undefined,
            describeModel: false,
            required: false,
            keywords: [],
            visibility: 'public' },
          {
            kind: 'prop',
            name: 'msg',
            type: 'string',
            category: undefined,
            version: undefined,
            description: undefined,
            default: undefined,
            describeModel: false,
            required: true,
            keywords: [],
            visibility: 'public' },
        ],
      },
    });

    ComponentTestCase({
      name: 'defineCustomElement()',
      options: {
        filecontent: `
          <script>
            import { defineCustomElement } from 'vue'

            export default defineCustomElement({
              // type inference enabled
              props: {
                name: String,
                msg: { type: String, required: true }
              },
              data() {
                return {
                  count: 1
                }
              },
              mounted() {
                this.name // type: string | undefined
                this.msg // type: string
                this.count // type: number
              }
            })
          </script>
        `,
      },
      expected: {
        errors: [],
        warnings: [],
        data: [
          {
            kind: 'data',
            name: 'count',
            type: 'number',
            category: undefined,
            version: undefined,
            description: undefined,
            initialValue: '1',
            keywords: [],
            visibility: 'public' },
        ],
        props: [
          {
            kind: 'prop',
            name: 'name',
            type: 'string',
            category: undefined,
            version: undefined,
            description: undefined,
            default: undefined,
            describeModel: false,
            required: false,
            keywords: [],
            visibility: 'public' },
          {
            kind: 'prop',
            name: 'msg',
            type: 'string',
            category: undefined,
            version: undefined,
            description: undefined,
            default: undefined,
            describeModel: false,
            required: true,
            keywords: [],
            visibility: 'public' },
        ],
      },
    });

    ComponentTestCase({
      name: 'defineAsyncComponent()',
      options: {
        filecontent: `
          <script>
            import { defineAsyncComponent } from 'vue'

            export default defineAsyncComponent(() => Promise.resolve({
              props: {
                name: String,
                msg: { type: String, required: true }
              },
              data() {
                return {
                  count: 1
                }
              },
              mounted() {
                this.name // type: string | undefined
                this.msg // type: string
                this.count // type: number
              }
            }))
          </script>
        `,
      },
      expected: {
        errors: [],
        warnings: [],
        data: [
          {
            kind: 'data',
            name: 'count',
            type: 'number',
            category: undefined,
            version: undefined,
            description: undefined,
            initialValue: '1',
            keywords: [],
            visibility: 'public' },
        ],
        props: [
          {
            kind: 'prop',
            name: 'name',
            type: 'string',
            category: undefined,
            version: undefined,
            description: undefined,
            default: undefined,
            describeModel: false,
            required: false,
            keywords: [],
            visibility: 'public' },
          {
            kind: 'prop',
            name: 'msg',
            type: 'string',
            category: undefined,
            version: undefined,
            description: undefined,
            default: undefined,
            describeModel: false,
            required: true,
            keywords: [],
            visibility: 'public' },
        ],
      },
    });

    ComponentTestCase({
      name: 'defineComponent() with setup',
      options: {
        filecontent: `
          <script setup>
            import { defineComponent } from 'vue'

            export default defineComponent({
              // type inference enabled
              props: {
                message: String
              },
              setup(props) {
                props.message // type: string | undefined
              }
            })
          </script>
        `,
      },
      expected: {
        errors: [],
        warnings: [],
        data: [],
        props: [
          {
            kind: 'prop',
            name: 'message',
            type: 'string',
            category: undefined,
            version: undefined,
            description: undefined,
            default: undefined,
            describeModel: false,
            required: false,
            keywords: [],
            visibility: 'public' },
        ],
      },
    });

    ComponentTestCase({
      name: 'createApp()',
      options: {
        filecontent: `
          <script>
            import { createApp } from 'vue'

            export default createApp({
              data() {
                return {
                  count: 0
                }
              }
            })
          </script>
        `,
      },
      expected: {
        errors: [],
        warnings: [],
        data: [
          {
            kind: 'data',
            name: 'count',
            type: 'number',
            category: undefined,
            version: undefined,
            description: undefined,
            initialValue: '0',
            keywords: [],
            visibility: 'public' },
        ],
      },
    });

    ComponentTestCase({
      name: 'createApp() with setup',
      options: {
        filecontent: `
          <script setup>
            import { createApp } from 'vue'

            const app = createApp({
              setup() {
                return {
                  count: 0
                }
              }
            })

            export default app
          </script>
        `,
      },
      expected: {
        errors: [],
        warnings: [],
        data: [
          {
            kind: 'data',
            name: 'count',
            type: 'number',
            category: undefined,
            version: undefined,
            description: undefined,
            initialValue: '0',
            keywords: [],
            visibility: 'public' },
        ],
      },
    });

    ComponentTestCase({
      name: 'useAttrs()',
      options: {
        filecontent: `
          <script setup>
            import { useAttrs } from 'vue'

            const attrs = useAttrs()
          </script>
        `,
      },
      expected: {
        errors: [],
        warnings: [],
        data: [],
      },
    });

    ComponentTestCase({
      name: 'useSlots()',
      options: {
        filecontent: `
          <script setup>
            import { useSlots } from 'vue'

            const slots = useSlots()
          </script>
        `,
      },
      expected: {
        errors: [],
        warnings: [],
        data: [],
      },
    });

    ComponentTestCase({
      name: 'Composition API - State: Handle expose',
      options: {
        ignoredVisibilities: [],
        filecontent: `
          <script setup>
            export default {
              // only publicMethod will be available on the public instance
              expose: ['publicMethod'],
              data: () => ({ x: 1}),
              computed: {
                y() { return 2; },
              },
              methods: {
                publicMethod() {
                  // ...
                },
                /**
                 * @public
                 */
                publicMethod2() {
                  // ...
                },
                privateMethod() {
                  // ...
                }
              }
            }
          </script>
        `,
      },
      expected: {
        errors: [],
        warnings: [],
        data: [
          {
            kind: 'data',
            name: 'x',
            type: 'number',
            category: undefined,
            version: undefined,
            description: undefined,
            initialValue: '1',
            keywords: [],
            visibility: 'private' },
        ],
        computed: [
          {
            kind: 'computed',
            name: 'y',
            type: 'number',
            category: undefined,
            version: undefined,
            description: undefined,
            dependencies: [],
            keywords: [],
            visibility: 'private' },
        ],
        methods: [
          {
            kind: 'method',
            name: 'publicMethod',
            params: [],
            keywords: [],
            syntax: [
              'publicMethod(): void',
            ],
            returns: {
              type: 'void',
            },
            visibility: 'public',
          },
          {
            kind: 'method',
            name: 'publicMethod2',
            params: [],
            keywords: [],
            syntax: [
              'publicMethod2(): void',
            ],
            returns: {
              type: 'void',
            },
            visibility: 'private',
          },
          {
            kind: 'method',
            name: 'privateMethod',
            params: [],
            keywords: [],
            syntax: [
              'privateMethod(): void',
            ],
            returns: {
              type: 'void',
            },
            visibility: 'private',
          },
        ],
      },
    });

    ComponentTestCase({
      name: 'setup()',
      options: {
        ignoredVisibilities: [],
        filecontent: `
          <script setup>
            import { reactive } from 'vue'

            export default {
              // \`setup\` is a special hook dedicated for composition API.
              setup() {
                const state = reactive({ count: 0 })

                // expose the state to the template
                return {
                  state
                }
              }
            }
          </script>
        `,
      },
      expected: {
        errors: [],
        warnings: [],
        data: [
          {
            kind: 'data',
            name: 'state',
            type: 'object',
            category: undefined,
            version: undefined,
            description: undefined,
            initialValue: '{"count":0}',
            keywords: [],
            visibility: 'public' },
        ],
      },
    });

    ComponentTestCase({
      name: 'setup() with Render Functions',
      options: {
        ignoredVisibilities: [],
        filecontent: `
          <script setup>
            import { h, ref } from 'vue'

            export default {
              setup() {
                const count = ref(0)
                return () => h('div', count.value)
              }
            }
          </script>
        `,
      },
      expected: {
        errors: [],
        warnings: [],
        data: [],
      },
    });

    ComponentTestCase({
      name: 'defineExpose()',
      options: {
        ignoredVisibilities: [],
        filecontent: `
          <script setup>
            import { h, ref } from 'vue'

            const count = ref(0)
            const increment = () => ++count.value

            defineExpose({
              increment,
            })
          </script>
        `,
      },
      expected: {
        errors: [],
        warnings: [],
        data: [],
        props: [],
        events: [],
        methods: [
          {
            kind: 'method',
            keywords: [],
            name: 'increment',
            params: [],
            returns: {
              type: 'number',
            },
            syntax: [
              'increment(): number',
            ],
            visibility: 'public',
          },
        ],
      },
    });

    ComponentTestCase({
      name: 'export default defineComponent() with external data',
      options: {
        ignoredVisibilities: [],
        filecontent: `
          <script>
            import { h, ref } from 'vue'

            const count = ref(0)
            const increment = () => ++count.value

            export default defineComponent({
              setup() {
                return {}
              }
            })
          </script>
        `,
      },
      expected: {
        errors: [],
        warnings: [],
        data: [],
        props: [],
        events: [],
        methods: [],
      },
    });

    ComponentTestCase({
      name: 'export default defineComponent() data defined inside setup() and no return expose',
      options: {
        ignoredVisibilities: [],
        filecontent: `
          <script>
            import { h, ref } from 'vue'

            export default defineComponent({
              setup() {
                const count = ref(0)
                const increment = () => ++count.value
                
                return {}
              }
            })
          </script>
        `,
      },
      expected: {
        errors: [],
        warnings: [],
        data: [],
        props: [],
        events: [],
        methods: [],
      },
    });

    ComponentTestCase({
      name: 'export default defineComponent() data defined inside setup() and return expose',
      options: {
        ignoredVisibilities: [],
        filecontent: `
          <script>
            import { h, ref } from 'vue'

            export default defineComponent({
              setup() {
                const index = ref(0)
                const count = ref(0)
                const increment = () => (++count.value + index.value)
                
                return {
                  count,
                  increment,
                }
              }
            })
          </script>
        `,
      },
      expected: {
        errors: [],
        warnings: [],
        data: [
          {
            kind: 'data',
            name: 'count',
            type: 'number',
            keywords: [],
            visibility: 'public',
            initialValue: '0',
          },
        ],
        props: [],
        events: [],
        methods: [
          {
            kind: 'method',
            keywords: [],
            name: 'increment',
            params: [],
            returns: {
              type: 'unknown',
            },
            syntax: [
              'increment(): unknown',
            ],
            visibility: 'public',
          },
        ],
      },
    });

    ComponentTestCase({
      name: 'setup() with empty expose()',
      options: {
        ignoredVisibilities: [],
        filecontent: `
          <script setup>
            import { h, ref } from 'vue'

            export default {
              setup(props, { expose }) {
                const count = ref(0)
                const increment = () => ++count.value

                // make the instance "closed" -
                // i.e. do not expose anything to the parent
                expose()
              }
            }
          </script>
        `,
      },
      expected: {
        errors: [],
        warnings: [],
        data: [],
      },
    });

    ComponentTestCase({
      name: 'setup() with selectively expose local state',
      options: {
        ignoredVisibilities: [],
        filecontent: `
          <script setup>
            import { h, ref } from 'vue'

            export default {
              setup(props, { expose }) {
                const publicCount = ref(0)
                const privateCount = ref(0)
                // selectively expose local state
                expose({ count: publicCount })
              }
            }
          </script>
        `,
      },
      expected: {
        errors: [],
        warnings: [],
        data: [
          {
            kind: 'data',
            name: 'count',
            type: 'number',
            category: undefined,
            version: undefined,
            description: undefined,
            initialValue: '0',
            keywords: [],
            visibility: 'public' },
        ],
      },
    });

    ComponentTestCase({
      name: 'extends',
      options: {
        ignoredVisibilities: [],
        filecontent: `
          <script>
            import { h, ref } from 'vue'

            const CompA = {
              props: {
                age: Number,
                name: {
                  type: ExtendedString,
                  required: true,
                }
              }
            }

            export default {
              extends: CompA,
              props: {
                name: String
              }
            }
          </script>
        `,
      },
      expected: {
        errors: [],
        warnings: [],
        props: [
          {
            kind: 'prop',
            visibility: 'public',
            category: undefined,
            version: undefined,
            description: undefined,
            keywords: [],
            type: 'number',
            default: undefined,
            name: 'age',
            describeModel: false,
            required: false,
          },
          {
            kind: 'prop',
            visibility: 'public',
            category: undefined,
            version: undefined,
            description: undefined,
            keywords: [],
            type: 'string',
            default: undefined,
            name: 'name',
            describeModel: false,
            required: false,
          },
        ],
      },
    });

    ComponentTestCase({
      name: 'complexe example',
      options: {
        filecontent: `
          <script>
            import { ref, reactive, computed, watch } from 'vue';

            export default {
              setup() {
                const names = reactive(['Emil, Hans', 'Mustermann, Max', 'Tisch, Roman']);
                const selected = ref('');
                const prefix = ref('');
                const first = ref('');
                const last = ref('');
            
                const filteredNames = computed(() => names.filter((n) => n.toLowerCase().startsWith(prefix.value.toLowerCase())));
            
                watch(selected, (name) => {
                  [last.value, first.value] = name.split(', ');
                });
            
                function create() {
                  if (hasValidInput()) {
                    const fullName = \`\${last.value}, \${first.value}\`;
            
                    if (!names.includes(fullName)) {
                      names.push(fullName);
                      first.value = last.value = '';
                    }
                  }
                }
            
                function update() {
                  if (hasValidInput() && selected.value) {
                    const i = names.indexOf(selected.value);
            
                    names[i] = selected.value = \`\${last.value}, \${first.value}\`;
                  }
                }
            
                function del() {
                  if (selected.value) {
                    const i = names.indexOf(selected.value);
            
                    names.splice(i, 1);
                    selected.value = first.value = last.value = '';
                  }
                }
            
                function hasValidInput() {
                  return first.value.trim() && last.value.trim();
                }
            
                return {
                  filteredNames,
                  selected,
                  prefix,
                  first,
                  last,
                  create,
                  update,
                  del,
                  hasValidInput,
                };
              },
            };          
          </script>
        `,
      },
      expected: {
        errors: [],
        warnings: [],
        props: [],
        data: [
          {
            category: undefined,
            initialValue: '""',
            keywords: [],
            kind: 'data',
            name: 'selected',
            type: 'string',
            version: undefined,
            visibility: 'public',
          },
          {
            category: undefined,
            initialValue: '""',
            keywords: [],
            kind: 'data',
            name: 'prefix',
            type: 'string',
            version: undefined,
            visibility: 'public',
          },
          {
            category: undefined,
            initialValue: '""',
            keywords: [],
            kind: 'data',
            name: 'first',
            type: 'string',
            version: undefined,
            visibility: 'public',
          },
          {
            category: undefined,
            initialValue: '""',
            keywords: [],
            kind: 'data',
            name: 'last',
            type: 'string',
            version: undefined,
            visibility: 'public',
          },
        ],
        computed: [
          {
            category: undefined,
            keywords: [],
            dependencies: [],
            kind: 'computed',
            name: 'filteredNames',
            type: 'unknown',
            version: undefined,
            visibility: 'public',
          },
        ],
        methods: [
          {
            category: undefined,
            keywords: [],
            kind: 'method',
            name: 'create',
            params: [],
            returns: {
              description: undefined,
              type: 'void',
            },
            syntax: [
              'create(): void',
            ],
            version: undefined,
            visibility: 'public',
          },
          {
            category: undefined,
            keywords: [],
            kind: 'method',
            name: 'update',
            params: [],
            returns: {
              description: undefined,
              type: 'void',
            },
            syntax: [
              'update(): void',
            ],
            version: undefined,
            visibility: 'public',
          },
          {
            category: undefined,
            keywords: [],
            kind: 'method',
            name: 'del',
            params: [],
            returns: {
              description: undefined,
              type: 'void',
            },
            syntax: [
              'del(): void',
            ],
            version: undefined,
            visibility: 'public',
          },
          {
            category: undefined,
            keywords: [],
            kind: 'method',
            name: 'hasValidInput',
            params: [],
            returns: {
              description: undefined,
              type: 'boolean',
            },
            syntax: [
              'hasValidInput(): boolean',
            ],
            version: undefined,
            visibility: 'public',
          },
        ],
      },
    });

    ComponentTestCase({
      name: 'complexe example with global variables',
      options: {
        filecontent: `
          <script>
            import { ref, watchEffect } from 'vue';

            const API_URL = 'https://api.github.com/repos/vuejs/core/commits?per_page=3&sha=';
            const branches = ['main', 'v2-compat'];
            
            export default {
              setup() {
                const currentBranch = ref(branches[0]);
                const commits = ref(null);
            
                watchEffect(async () => {
                  // this effect will run immediately and then
                  // re-run whenever currentBranch.value changes
                  const url = \`\${API_URL}\${currentBranch.value}\`;
            
                  commits.value = await (await fetch(url)).json();
                });
            
                function truncate(v) {
                  const newline = v.indexOf('\\n');
            
                  return newline > 0 ? v.slice(0, newline) : v;
                }
            
                function formatDate(v) {
                  return v.replace(/T|Z/g, ' ');
                }
            
                return {
                  branches,
                  currentBranch,
                  commits,
                  truncate,
                  formatDate,
                };
              },
            };          
          </script>
        `,
      },
      expected: {
        errors: [],
        warnings: [],
        props: [],
        data: [
          {
            category: undefined,
            initialValue: '["main","v2-compat"]',
            keywords: [],
            kind: 'data',
            name: 'branches',
            type: 'array',
            version: undefined,
            visibility: 'public',
          },
          {
            category: undefined,
            initialValue: '"main"',
            keywords: [],
            kind: 'data',
            name: 'currentBranch',
            type: 'string',
            version: undefined,
            visibility: 'public',
          },
          {
            category: undefined,
            initialValue: 'null',
            keywords: [],
            kind: 'data',
            name: 'commits',
            type: 'unknown',
            version: undefined,
            visibility: 'public',
          },
        ],
        computed: [],
        methods: [
          {
            category: undefined,
            keywords: [],
            kind: 'method',
            name: 'truncate',
            params: [
              {
                name: 'v',
                type: 'unknown',
                rest: false,
              },
            ],
            returns: {
              description: undefined,
              type: 'unknown',
            },
            syntax: [
              'truncate(v: unknown): unknown',
            ],
            version: undefined,
            visibility: 'public',
          },
          {
            category: undefined,
            keywords: [],
            kind: 'method',
            name: 'formatDate',
            params: [
              {
                name: 'v',
                type: 'unknown',
                rest: false,
              },
            ],
            returns: {
              description: undefined,
              type: 'unknown',
            },
            syntax: [
              'formatDate(v: unknown): unknown',
            ],
            version: undefined,
            visibility: 'public',
          },
        ],
      },
    });

    ComponentTestCase({
      name: 'complexe example with global variables with irelevant properties model and watch which will be ignored on parsing',
      options: {
        filecontent: `
          <script>
            import { ref, watchEffect } from 'vue';

            const API_URL = 'https://api.github.com/repos/vuejs/core/commits?per_page=3&sha=';
            const branches = ['main', 'v2-compat'];
            
            export default {
              model: {
                prop: 'branches',
                event: 'input',
              },
              setup() {
                const currentBranch = ref(branches[0]);
                const commits = ref(null);
            
                watchEffect(async () => {
                  // this effect will run immediately and then
                  // re-run whenever currentBranch.value changes
                  const url = \`\${API_URL}\${currentBranch.value}\`;
            
                  commits.value = await (await fetch(url)).json();
                });
            
                function truncate(v) {
                  const newline = v.indexOf('\\n');
            
                  return newline > 0 ? v.slice(0, newline) : v;
                }
            
                function formatDate(v) {
                  return v.replace(/T|Z/g, ' ');
                }
            
                return {
                  branches,
                  currentBranch,
                  commits,
                  truncate,
                  formatDate,
                };
              },
              watch: {
                branches(newVal) {
                  /**
                   * Emitted when fooProp changes
                   *
                   * @arg {Boolean} newVal - The new value
                   */
                  this.$emit("foo-changed", newVal)
                },
              },
            };          
          </script>
        `,
      },
      expected: {
        errors: [],
        warnings: [],
        props: [],
        data: [
          {
            category: undefined,
            initialValue: '["main","v2-compat"]',
            keywords: [],
            kind: 'data',
            name: 'branches',
            type: 'array',
            version: undefined,
            visibility: 'public',
          },
          {
            category: undefined,
            initialValue: '"main"',
            keywords: [],
            kind: 'data',
            name: 'currentBranch',
            type: 'string',
            version: undefined,
            visibility: 'public',
          },
          {
            category: undefined,
            initialValue: 'null',
            keywords: [],
            kind: 'data',
            name: 'commits',
            type: 'unknown',
            version: undefined,
            visibility: 'public',
          },
        ],
        computed: [],
        methods: [
          {
            category: undefined,
            keywords: [],
            kind: 'method',
            name: 'truncate',
            params: [
              {
                name: 'v',
                type: 'unknown',
                rest: false,
              },
            ],
            returns: {
              description: undefined,
              type: 'unknown',
            },
            syntax: [
              'truncate(v: unknown): unknown',
            ],
            version: undefined,
            visibility: 'public',
          },
          {
            category: undefined,
            keywords: [],
            kind: 'method',
            name: 'formatDate',
            params: [
              {
                name: 'v',
                type: 'unknown',
                rest: false,
              },
            ],
            returns: {
              description: undefined,
              type: 'unknown',
            },
            syntax: [
              'formatDate(v: unknown): unknown',
            ],
            version: undefined,
            visibility: 'public',
          },
        ],
      },
    });
  });

  describe('Composition API', () => {
    describe('data', () => {
      // ComponentTestCase({
      //   name: 'simple declaration',
      //   options: {
      //     filecontent: `
      //       <script setup>
      //         import { ref } from 'vue'

      //         /**
      //          * Message value
      //          */
      //         const message = 'Hello World!';
      //       </script>
      //     `,
      //   },
      //   expected: {
      //     errors: [],
      //     warnings: [],
      //     computed: [],
      //     data: [
      //       {
      //         kind: 'data',
      //         name: 'message',
      //         type: 'string',
      //         category: undefined,
      //         version: undefined,
      //         description: 'Message value',
      //         initialValue: '"Hello World!"',
      //         keywords: [],
      //         visibility: 'public' },
      //     ],
      //     props: [],
      //   },
      // });

      ComponentTestCase({
        name: 'simple declaration with typing',
        options: {
          filecontent: `
            <script lang="ts" setup>
              import { ref } from 'vue'

              /**
               * Message value
               */
              const message: CustomString = 'Hello World!';

              /**
               * Message value
               */
              const message2: bool.Custom = 'Hello World!';

              let x: string | number = 1
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [],
          data: [
            {
              kind: 'data',
              name: 'message',
              type: 'CustomString',
              category: undefined,
              version: undefined,
              description: 'Message value',
              initialValue: '"Hello World!"',
              keywords: [],
              visibility: 'public' },
            {
              kind: 'data',
              name: 'message2',
              type: 'bool.Custom',
              category: undefined,
              version: undefined,
              description: 'Message value',
              initialValue: '"Hello World!"',
              keywords: [],
              visibility: 'public' },
            {
              kind: 'data',
              name: 'x',
              type: ['string', 'number'],
              category: undefined,
              version: undefined,
              description: undefined,
              initialValue: '1',
              keywords: [],
              visibility: 'public' },
          ],
          props: [],
        },
      });

      ComponentTestCase({
        name: 'multiple declarations',
        options: {
          filecontent: `
            <script setup>
              import { ref } from 'vue'

              const
                /**
                 * Message value
                 */
                message = 'Hello World!',
                /**
                 * Message value 2
                 */
                message2 = 'Hello World!2';
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [],
          data: [
            {
              kind: 'data',
              name: 'message',
              type: 'string',
              category: undefined,
              version: undefined,
              description: 'Message value',
              initialValue: '"Hello World!"',
              keywords: [],
              visibility: 'public' },
            {
              kind: 'data',
              name: 'message2',
              type: 'string',
              category: undefined,
              version: undefined,
              description: 'Message value 2',
              initialValue: '"Hello World!2"',
              keywords: [],
              visibility: 'public' },
          ],
          props: [],
        },
      });

      ComponentTestCase({
        name: 'ref declaration',
        options: {
          filecontent: `
            <script setup>
              import { ref } from 'vue'

              /**
               * Message value
               */
              const message = ref('Hello World!');
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [],
          data: [
            {
              kind: 'data',
              name: 'message',
              type: 'string',
              category: undefined,
              version: undefined,
              description: 'Message value',
              initialValue: '"Hello World!"',
              keywords: [],
              visibility: 'public' },
          ],
          props: [],
        },
      });

      ComponentTestCase({
        name: 'multiple ref declarations',
        options: {
          filecontent: `
            <script setup>
              import { ref } from 'vue'

              const
                /**
                 * Message value
                 */
                message = ref('Hello World!'),
                /**
                 * Message value 2
                 */
                message2 = ref('Hello World!2');
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [],
          data: [
            {
              kind: 'data',
              name: 'message',
              type: 'string',
              category: undefined,
              version: undefined,
              description: 'Message value',
              initialValue: '"Hello World!"',
              keywords: [],
              visibility: 'public' },
            {
              kind: 'data',
              name: 'message2',
              type: 'string',
              category: undefined,
              version: undefined,
              description: 'Message value 2',
              initialValue: '"Hello World!2"',
              keywords: [],
              visibility: 'public' },
          ],
          props: [],
        },
      });

      ComponentTestCase({
        name: 'ref declaration with typing',
        options: {
          filecontent: `
            <script lang="ts" setup>
              import { ref } from 'vue'

              /**
               * Message value
               */
              const message = ref<CustomString>('Hello World!');
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [],
          data: [
            {
              kind: 'data',
              name: 'message',
              type: 'CustomString',
              category: undefined,
              version: undefined,
              description: 'Message value',
              initialValue: '"Hello World!"',
              keywords: [],
              visibility: 'public' },
          ],
          props: [],
        },
      });

      ComponentTestCase({
        name: 'reactive declaration',
        options: {
          filecontent: `
            <script setup>
              import { reactive } from 'vue'

              /**
               * Message value
               */
              const obj = reactive({ count: 0 })
              const map = reactive(new Map([['count', ref(0)]]))
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [],
          data: [
            {
              kind: 'data',
              name: 'obj',
              type: 'object',
              category: undefined,
              version: undefined,
              description: 'Message value',
              initialValue: '{"count":0}',
              keywords: [],
              visibility: 'public' },
            {
              kind: 'data',
              name: 'map',
              type: 'Map',
              category: undefined,
              version: undefined,
              description: undefined,
              initialValue: 'new Map([[\'count\', ref(0)]])',
              keywords: [],
              visibility: 'public' },
          ],
          props: [],
        },
      });

      ComponentTestCase({
        name: 'readonly() declaration',
        options: {
          filecontent: `
            <script setup>
              import { reactive, readonly } from 'vue'

              const original = reactive({ count: 0 })
              const copy = readonly(original)
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [],
          data: [
            {
              kind: 'data',
              name: 'original',
              type: 'object',
              category: undefined,
              version: undefined,
              description: undefined,
              initialValue: '{"count":0}',
              keywords: [],
              visibility: 'public' },
            {
              kind: 'data',
              name: 'copy',
              type: 'object',
              category: undefined,
              version: undefined,
              description: undefined,
              initialValue: '{"count":0}',
              keywords: [],
              visibility: 'public' },
          ],
          props: [],
        },
      });

      ComponentTestCase({
        name: 'shallowRef() declaration',
        options: {
          filecontent: `
            <script setup>
              import { shallowRef } from 'vue'

              const state = shallowRef({ count: 1 })
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [],
          data: [
            {
              kind: 'data',
              name: 'state',
              type: 'object',
              category: undefined,
              version: undefined,
              description: undefined,
              initialValue: '{"count":1}',
              keywords: [],
              visibility: 'public' },
          ],
          props: [],
        },
      });

      ComponentTestCase({
        name: 'shallowReactive() declaration',
        options: {
          filecontent: `
            <script setup>
              import { shallowReactive } from 'vue'

              const state = shallowReactive({
                foo: 1,
                nested: {
                  bar: 2
                }
              })
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [],
          data: [
            {
              kind: 'data',
              name: 'state',
              type: 'object',
              category: undefined,
              version: undefined,
              description: undefined,
              initialValue: '{"foo":1,"nested":{"bar":2}}',
              keywords: [],
              visibility: 'public' },
          ],
          props: [],
        },
      });

      ComponentTestCase({
        name: 'shallowReadonly() declaration',
        options: {
          filecontent: `
            <script setup>
              import { shallowReadonly } from 'vue'

              const state = shallowReadonly({
                foo: 1,
                nested: {
                  bar: 2
                }
              })
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [],
          data: [
            {
              kind: 'data',
              name: 'state',
              type: 'object',
              category: undefined,
              version: undefined,
              description: undefined,
              initialValue: '{"foo":1,"nested":{"bar":2}}',
              keywords: [],
              visibility: 'public' },
          ],
          props: [],
        },
      });

      ComponentTestCase({
        name: 'triggerRef() declaration',
        options: {
          filecontent: `
            <script setup>
              import { triggerRef } from 'vue'

              const shallow = triggerRef({
                greet: 'Hello, world'
              })
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [],
          data: [
            {
              kind: 'data',
              name: 'shallow',
              type: 'object',
              category: undefined,
              version: undefined,
              description: undefined,
              initialValue: '{"greet":"Hello, world"}',
              keywords: [],
              visibility: 'public' },
          ],
          props: [],
        },
      });

      ComponentTestCase({
        name: 'toRaw() declaration',
        options: {
          filecontent: `
            <script setup>
              import { toRaw } from 'vue'

              const foo = {}
              const reactiveFoo = reactive(foo)
              const rawFoo = toRaw(reactiveFoo)
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [],
          data: [
            {
              kind: 'data',
              name: 'foo',
              type: 'object',
              category: undefined,
              version: undefined,
              description: undefined,
              initialValue: '{}',
              keywords: [],
              visibility: 'public' },
            {
              kind: 'data',
              name: 'reactiveFoo',
              type: 'object',
              category: undefined,
              version: undefined,
              description: undefined,
              initialValue: '{}',
              keywords: [],
              visibility: 'public' },
            {
              kind: 'data',
              name: 'rawFoo',
              type: 'object',
              category: undefined,
              version: undefined,
              description: undefined,
              initialValue: '{}',
              keywords: [],
              visibility: 'public' },
          ],
          props: [],
        },
      });

      ComponentTestCase({
        name: 'markRaw() declaration',
        options: {
          filecontent: `
            <script setup>
              import { markRaw } from 'vue'

              const foo = markRaw({
                nested: {}
              })

              const bar = reactive({
                // although \`foo\` is marked as raw, foo.nested is not.
                nested: foo.nested
              })
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [],
          data: [
            {
              kind: 'data',
              name: 'foo',
              type: 'object',
              category: undefined,
              version: undefined,
              description: undefined,
              initialValue: '{"nested":{}}',
              keywords: [],
              visibility: 'public' },
            {
              kind: 'data',
              name: 'bar',
              type: 'object',
              category: undefined,
              version: undefined,
              description: undefined,
              initialValue: '{"nested":{}}',
              keywords: [],
              visibility: 'public' },
          ],
          props: [],
        },
      });

      ComponentTestCase({
        name: 'unref() declaration',
        options: {
          filecontent: `
            <script setup>
              import { ref, unref } from 'vue'

              const foo = ref({
                nested: {}
              })

              const bar = unref(foo)
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [],
          data: [
            {
              kind: 'data',
              name: 'foo',
              type: 'object',
              category: undefined,
              version: undefined,
              description: undefined,
              initialValue: '{"nested":{}}',
              keywords: [],
              visibility: 'public' },
            {
              kind: 'data',
              name: 'bar',
              type: 'object',
              category: undefined,
              version: undefined,
              description: undefined,
              initialValue: '{"nested":{}}',
              keywords: [],
              visibility: 'public' },
          ],
          props: [],
        },
      });

      ComponentTestCase({
        name: 'unref() declaration',
        options: {
          filecontent: `
            <script setup>
              import { ref, unref } from 'vue'

              const state = reactive({
                foo: 1,
                bar: 2
              })

              const fooRef = toRef(state, 'foo')
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [],
          data: [
            {
              kind: 'data',
              name: 'state',
              type: 'object',
              category: undefined,
              version: undefined,
              description: undefined,
              initialValue: '{"foo":1,"bar":2}',
              keywords: [],
              visibility: 'public' },
            {
              kind: 'data',
              name: 'fooRef',
              type: 'number',
              category: undefined,
              version: undefined,
              description: undefined,
              initialValue: '1',
              keywords: [],
              visibility: 'public' },
          ],
          props: [],
        },
      });

      ComponentTestCase({
        name: 'unref() declaration',
        options: {
          filecontent: `
            <script>
              import { ref } from 'vue';

              export default {
                setup() {
                  const message = ref('Hello World!');
                  const isRed = ref(true);
                  const color = ref('green');

                  function toggleRed() {
                    isRed.value = !isRed.value;
                  }

                  function toggleColor() {
                    color.value = color.value === 'green' ? 'blue' : 'green';
                  }

                  return {
                    message,
                    isRed,
                    color,
                    toggleRed,
                    toggleColor,
                  };
                },
              };

            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [],
          data: [
            {
              kind: 'data',
              name: 'message',
              type: 'string',
              category: undefined,
              version: undefined,
              description: undefined,
              initialValue: '"Hello World!"',
              keywords: [],
              visibility: 'public' },
            {
              kind: 'data',
              name: 'isRed',
              type: 'boolean',
              category: undefined,
              version: undefined,
              description: undefined,
              initialValue: 'true',
              keywords: [],
              visibility: 'public' },
            {
              kind: 'data',
              name: 'color',
              type: 'string',
              category: undefined,
              version: undefined,
              description: undefined,
              initialValue: '"green"',
              keywords: [],
              visibility: 'public' },
          ],
          props: [],
        },
      });
    });

    describe('computed', () => {
      ComponentTestCase({
        name: 'simple declaration',
        options: {
          filecontent: `
            <script setup>
              import { computed } from 'vue'

              const messagex = 'Hello World!';

              /**
               * Message value
               */
              const message = computed(() => messagex);
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [
            {
              kind: 'computed',
              name: 'message',
              type: 'string',
              category: undefined,
              version: undefined,
              description: 'Message value',
              dependencies: [],
              keywords: [],
              visibility: 'public' },
          ],
          props: [],
        },
      });

      ComponentTestCase({
        name: 'simple declaration with typing',
        options: {
          filecontent: `
            <script lang="ts" setup>
              import { computed } from 'vue'

              const messagex = 'Hello World!';

              /**
               * Message value
               */
              const message = computed((): number => messagex);

              /**
               * Message value
               */
              const message2: bool.custom = computed((): number => messagex);

              /**
               * Message value
               */
              const message3 = computed<custom>((): number => messagex);
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [
            {
              kind: 'computed',
              name: 'message',
              type: 'number',
              category: undefined,
              version: undefined,
              description: 'Message value',
              dependencies: [],
              keywords: [],
              visibility: 'public' },
            {
              kind: 'computed',
              name: 'message2',
              type: 'bool.custom',
              category: undefined,
              version: undefined,
              description: 'Message value',
              dependencies: [],
              keywords: [],
              visibility: 'public' },
            {
              kind: 'computed',
              name: 'message3',
              type: 'custom',
              category: undefined,
              version: undefined,
              description: 'Message value',
              dependencies: [],
              keywords: [],
              visibility: 'public' },
          ],
          props: [],
        },
      });

      ComponentTestCase({
        name: 'writable computed',
        options: {
          filecontent: `
            <script lang="ts" setup>
              import { ref, computed } from 'vue'

              const firstName = ref('John')
              const lastName = ref('Doe')

              /**
               * Message value
               */
              const fullName = computed({
                // getter
                get() {
                  return firstName.value + ' ' + lastName.value
                },
                // setter
                set(newValue) {
                  // Note: we are using destructuring assignment syntax here.
                  [firstName.value, lastName.value] = newValue.split(' ')
                }
              })

              /**
               * Message value
               */
              const fullName2 = computed({
                // getter
                get(): kakarot {
                  return firstName.value + ' ' + lastName.value
                },
                // setter
                set(newValue) {
                  // Note: we are using destructuring assignment syntax here.
                  [firstName.value, lastName.value] = newValue.split(' ')
                }
              })
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [
            {
              kind: 'computed',
              name: 'fullName',
              type: 'unknown',
              category: undefined,
              version: undefined,
              description: 'Message value',
              dependencies: [],
              keywords: [],
              visibility: 'public' },
            {
              kind: 'computed',
              name: 'fullName2',
              type: 'kakarot',
              category: undefined,
              version: undefined,
              description: 'Message value',
              dependencies: [],
              keywords: [],
              visibility: 'public' },
          ],
          props: [],
        },
      });

      ComponentTestCase({
        name: 'effectScope() declaration',
        options: {
          filecontent: `
            <script setup>
              import { effectScope } from 'vue'

              const scope = effectScope()

              scope.run(() => {
                /**
                 * @type number
                 */
                const doubled = computed(() => counter.value * 2)

                watch(doubled, () => console.log(doubled.value))

                watchEffect(() => console.log('Count: ', doubled.value))
              })

              // to dispose all effects in the scope
              scope.stop()
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [
            {
              kind: 'computed',
              name: 'doubled',
              type: 'number',
              category: undefined,
              version: undefined,
              description: undefined,
              dependencies: [],
              keywords: [],
              visibility: 'public' },
          ],
          data: [],
          props: [],
        },
      });
    });

    describe('props', () => {
      ComponentTestCase({
        name: 'simple declaration',
        options: {
          filecontent: `
            <script setup>
              const props = defineProps(['foo'])

              console.log(props.foo)
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          props: [
            {
              kind: 'prop',
              name: 'foo',
              type: 'unknown',
              category: undefined,
              version: undefined,
              description: undefined,
              default: undefined,
              describeModel: false,
              required: true,
              keywords: [],
              visibility: 'public' },
          ],
        },
      });

      ComponentTestCase({
        name: 'object declaration',
        options: {
          filecontent: `
            <script setup>
              defineProps({
                /**
                 * Title description
                 */
                title: String,
                likes: Number
              })
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          props: [
            {
              kind: 'prop',
              name: 'title',
              type: 'string',
              category: undefined,
              version: undefined,
              description: 'Title description',
              default: undefined,
              describeModel: false,
              required: false,
              keywords: [],
              visibility: 'public' },
            {
              kind: 'prop',
              name: 'likes',
              type: 'number',
              category: undefined,
              version: undefined,
              description: undefined,
              default: undefined,
              describeModel: false,
              required: false,
              keywords: [],
              visibility: 'public' },
          ],
        },
      });

      ComponentTestCase({
        name: 'declaration with TSTypeLiteral',
        options: {
          filecontent: `
            <script setup lang="ts">
              defineProps<{
                /**
                 * Title description
                 */
                title?: string
                likes?: number
                modelValue: number
              }>()
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [],
          props: [
            {
              kind: 'prop',
              name: 'title',
              type: 'string',
              category: undefined,
              version: undefined,
              description: 'Title description',
              default: undefined,
              describeModel: false,
              required: false,
              keywords: [],
              visibility: 'public' },
            {
              kind: 'prop',
              name: 'likes',
              type: 'number',
              category: undefined,
              version: undefined,
              description: undefined,
              default: undefined,
              describeModel: false,
              required: false,
              keywords: [],
              visibility: 'public' },
            {
              kind: 'prop',
              name: 'v-model',
              type: 'number',
              category: undefined,
              version: undefined,
              description: undefined,
              default: undefined,
              describeModel: true,
              required: true,
              keywords: [],
              visibility: 'public' },
          ],
        },
      });

      ComponentTestCase({
        name: 'declaration with TSTypeLiteral #2',
        options: {
          filecontent: `
            <script setup lang="ts">
              defineProps<{
                /**
                 * Title description
                 */
                title?: string
                likes?: number
                modelValue: number
              }>()

              defineEmits(['update:modelValue'])
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [],
          props: [
            {
              kind: 'prop',
              name: 'title',
              type: 'string',
              category: undefined,
              version: undefined,
              description: 'Title description',
              default: undefined,
              describeModel: false,
              required: false,
              keywords: [],
              visibility: 'public' },
            {
              kind: 'prop',
              name: 'likes',
              type: 'number',
              category: undefined,
              version: undefined,
              description: undefined,
              default: undefined,
              describeModel: false,
              required: false,
              keywords: [],
              visibility: 'public' },
            {
              kind: 'prop',
              name: 'v-model',
              type: 'number',
              category: undefined,
              version: undefined,
              description: undefined,
              default: undefined,
              describeModel: true,
              required: true,
              keywords: [],
              visibility: 'public' },
          ],
        },
      });

      ComponentTestCase({
        name: 'declaration with external TSTypeLiteral',
        options: {
          filecontent: `
            <script setup lang="ts">
              type Props = {
                /**
                 * Title description
                 */
                title?: string
                likes: number
                modelValue: number
              };

              defineProps<Props>()
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [],
          props: [
            {
              kind: 'prop',
              name: 'title',
              type: 'string',
              category: undefined,
              version: undefined,
              description: 'Title description',
              default: undefined,
              describeModel: false,
              required: false,
              keywords: [],
              visibility: 'public' },
            {
              kind: 'prop',
              name: 'likes',
              type: 'number',
              category: undefined,
              version: undefined,
              description: undefined,
              default: undefined,
              describeModel: false,
              required: true,
              keywords: [],
              visibility: 'public' },
            {
              kind: 'prop',
              name: 'v-model',
              type: 'number',
              category: undefined,
              version: undefined,
              description: undefined,
              default: undefined,
              describeModel: true,
              required: true,
              keywords: [],
              visibility: 'public' },
          ],
        },
      });

      ComponentTestCase({
        name: 'declaration with class',
        options: {
          filecontent: `
            <script setup lang="ts">
              declare class Props {
                /**
                 * Title description
                 */
                title?: string
                likes: number
                modelValue: number
                get getter() { return this.title }
              };

              defineProps<Props>()
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [],
          props: [
            {
              kind: 'prop',
              name: 'title',
              type: 'string',
              category: undefined,
              version: undefined,
              description: 'Title description',
              default: undefined,
              describeModel: false,
              required: false,
              keywords: [],
              visibility: 'public' },
            {
              kind: 'prop',
              name: 'likes',
              type: 'number',
              category: undefined,
              version: undefined,
              description: undefined,
              default: undefined,
              describeModel: false,
              required: true,
              keywords: [],
              visibility: 'public' },
            {
              kind: 'prop',
              name: 'v-model',
              type: 'number',
              category: undefined,
              version: undefined,
              description: undefined,
              default: undefined,
              describeModel: true,
              required: true,
              keywords: [],
              visibility: 'public' },
            {
              kind: 'prop',
              name: 'getter',
              type: 'unknown',
              category: undefined,
              version: undefined,
              description: undefined,
              default: undefined,
              describeModel: false,
              required: true,
              keywords: [],
              visibility: 'public' },
          ],
        },
      });

      ComponentTestCase({
        name: 'declaration with empty TSTypeLiteral',
        options: {
          filecontent: `
            <script setup lang="ts">
              defineProps<string>()
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [],
          props: [],
        },
      });

      ComponentTestCase({
        name: 'declaration with missing type declaration',
        options: {
          filecontent: `
            <script setup lang="ts">
              defineProps<MissingTyping>()
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          props: [],
        },
      });

      ComponentTestCase({
        name: 'declaration with modelValue',
        options: {
          filecontent: `
            <script setup lang="ts">
              defineProps(['modelValue'])
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          props: [
            {
              kind: 'prop',
              name: 'v-model',
              type: 'unknown',
              category: undefined,
              version: undefined,
              description: undefined,
              default: undefined,
              describeModel: true,
              required: true,
              keywords: [],
              visibility: 'public' },
          ],
        },
      });

      ComponentTestCase({
        name: 'Reactive Props Destructure',
        options: {
          filecontent: `
            <script setup lang="ts">
              interface Props {
                msg: string
                // default value just works
                count?: number
                // local aliasing also just works
                // here we are aliasing \`props.foo\` to \`bar\`
                foo?: string
              }

              const {
                msg,
                count = 1,
                foo: bar
              } = defineProps<Props>()

              watchEffect(() => {
                // will log whenever the props change
                console.log(msg, count, bar)
              })
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          props: [
            {
              kind: 'prop',
              name: 'msg',
              type: 'string',
              category: undefined,
              version: undefined,
              description: undefined,
              default: undefined,
              describeModel: false,
              required: true,
              keywords: [],
              visibility: 'public' },
            {
              kind: 'prop',
              name: 'count',
              type: 'number',
              category: undefined,
              version: undefined,
              description: 'default value just works',
              default: '1',
              describeModel: false,
              required: false,
              keywords: [],
              visibility: 'public' },
            {
              kind: 'prop',
              name: 'foo',
              type: 'string',
              category: undefined,
              version: undefined,
              description: 'here we are aliasing `props.foo` to `bar`',
              default: undefined,
              describeModel: false,
              required: false,
              keywords: [],
              visibility: 'public' },
          ],
        },
      });

      ComponentTestCase({
        name: 'declaration with withDefaults()',
        options: {
          filecontent: `
            <script setup lang="ts">
              enum Bool {
                oui = 1,
                non
              }

              interface Iface {}

              type Name = string;

              interface Props {
                msg: string
                labels: string[]
                enum?: Bool
                iface?: Iface
                /**
                 * type description
                 */
                type?: Name
              }

              const props = withDefaults(defineProps<Props>(), {
                msg: 'hello',
                labels: () => ['one', 'two']
              })
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          computed: [],
          props: [
            {
              kind: 'prop',
              name: 'msg',
              type: 'string',
              category: undefined,
              version: undefined,
              description: undefined,
              default: '"hello"',
              describeModel: false,
              required: true,
              keywords: [],
              visibility: 'public' },
            {
              kind: 'prop',
              name: 'labels',
              type: 'string[]',
              category: undefined,
              version: undefined,
              description: undefined,
              default: '["one","two"]',
              describeModel: false,
              required: true,
              keywords: [],
              visibility: 'public' },
            {
              kind: 'prop',
              name: 'enum',
              type: 'Bool',
              category: undefined,
              version: undefined,
              description: undefined,
              default: undefined,
              describeModel: false,
              required: false,
              keywords: [],
              visibility: 'public' },
            {
              kind: 'prop',
              name: 'iface',
              type: 'Iface',
              category: undefined,
              version: undefined,
              description: undefined,
              default: undefined,
              describeModel: false,
              required: false,
              keywords: [],
              visibility: 'public' },
            {
              kind: 'prop',
              name: 'type',
              type: 'Name',
              category: undefined,
              version: undefined,
              description: 'type description',
              default: undefined,
              describeModel: false,
              required: false,
              keywords: [],
              visibility: 'public' },
          ],
        },
      });
    });

    describe('events', () => {
      ComponentTestCase({
        name: 'emits as array',
        options: {
          filecontent: `
            <script>
              export default {
                emits: ['change'],
                setup(props, { emit }) {
                  emit('change') // <-- type check / auto-completion
                }
              }
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          events: [
            {
              kind: 'event',
              name: 'change',
              keywords: [],
              category: undefined,
              description: undefined,
              visibility: 'public',
              arguments: [],
            },
          ],
        },
      });

      ComponentTestCase({
        name: 'with defineComponent()',
        options: {
          filecontent: `
            <script>
              import { defineComponent } from 'vue'

              export default defineComponent({
                emits: ['change'],
                setup(props, { emit }) {
                  emit('change') // <-- type check / auto-completion
                }
              })
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          events: [
            {
              kind: 'event',
              name: 'change',
              keywords: [],
              category: undefined,
              description: undefined,
              visibility: 'public',
              arguments: [],
            },
          ],
        },
      });

      ComponentTestCase({
        name: 'simple declaration',
        options: {
          filecontent: `
            <script setup>
              const emit = defineEmits(['change', 'delete'])
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          events: [
            {
              kind: 'event',
              name: 'change',
              keywords: [],
              category: undefined,
              description: undefined,
              visibility: 'public',
              arguments: [],
            },
            {
              kind: 'event',
              name: 'delete',
              keywords: [],
              category: undefined,
              description: undefined,
              visibility: 'public',
              arguments: [],
            },
          ],
        },
      });

      ComponentTestCase({
        name: 'Type-only emit declarations',
        options: {
          filecontent: `
            <script setup>
              const emit = defineEmits<{
                (e: 'change', id: number): void
                (e: 'update', value: string): void
              }>()
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          events: [
            {
              kind: 'event',
              name: 'change',
              keywords: [],
              category: undefined,
              description: undefined,
              visibility: 'public',
              arguments: [
                {
                  description: undefined,
                  name: 'id',
                  rest: false,
                  type: 'number',
                },
              ],
            },
            {
              kind: 'event',
              name: 'update',
              keywords: [],
              category: undefined,
              description: undefined,
              visibility: 'public',
              arguments: [
                {
                  description: undefined,
                  name: 'value',
                  rest: false,
                  type: 'string',
                },
              ],
            },
          ],
        },
      });

      ComponentTestCase({
        name: 'Events Validation',
        options: {
          filecontent: `
            <script setup>
              const emit = defineEmits({
                // No validation
                click: null,

                // Validate submit event
                submit: ({ email, password }) => {
                  if (email && password) {
                    return true
                  } else {
                    console.warn('Invalid submit event payload!')
                    return false
                  }
                }
              })

              function submitForm(email, password) {
                emit('submit', { email, password })
              }
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          events: [
            {
              kind: 'event',
              name: 'click',
              keywords: [],
              category: undefined,
              description: 'No validation',
              visibility: 'public',
              arguments: [],
            },
            {
              kind: 'event',
              name: 'submit',
              keywords: [],
              category: undefined,
              description: 'Validate submit event',
              visibility: 'public',
              arguments: [
                {
                  description: undefined,
                  name: '{ email, password }',
                  rest: false,
                  type: 'object',
                },
              ],
            },
          ],
        },
      });

      ComponentTestCase({
        name: 'Usage with v-model',
        options: {
          filecontent: `
            <script setup>
              defineProps(['modelValue'])
              defineEmits(['update:modelValue'])
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          events: [],
        },
      });

      ComponentTestCase({
        name: 'Multiple v-model bindings',
        options: {
          filecontent: `
            <script setup>
              defineProps({
                firstName: String,
                lastName: String
              })

              defineEmits(['update:firstName', 'update:lastName'])
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          props: [
            {
              category: undefined,
              default: undefined,
              describeModel: true,
              keywords: [],
              kind: 'prop',
              name: 'v-model:first-name',
              required: false,
              type: 'string',
              version: undefined,
              visibility: 'public',
            },
            {
              category: undefined,
              default: undefined,
              describeModel: true,
              keywords: [],
              kind: 'prop',
              name: 'v-model:last-name',
              required: false,
              type: 'string',
              version: undefined,
              visibility: 'public',
            },
          ],
          events: [
            {
              kind: 'event',
              name: 'update:first-name',
              keywords: [],
              category: undefined,
              description: undefined,
              visibility: 'public',
              arguments: [],
            },
            {
              kind: 'event',
              name: 'update:last-name',
              keywords: [],
              category: undefined,
              description: undefined,
              visibility: 'public',
              arguments: [],
            },
          ],
        },
      });
    });

    describe('methods', () => {
      ComponentTestCase({
        name: 'method as a function definition',
        options: {
          filecontent: `
            <script setup>
              /**
               * Name only
               * @syntax nameOnly(somebody: string) => void
               */
              function nameOnly(somebody) {
                this.$emit('input', somebody)
              }
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          data: [],
          methods: [
            {
              kind: 'method',
              syntax: [
                'nameOnly(somebody: string) => void',
              ],
              visibility: 'public',
              category: undefined,
              description: 'Name only',
              keywords: [],
              name: 'nameOnly',
              params: [
                {
                  type: 'unknown',
                  name: 'somebody',
                  description: undefined,
                  defaultValue: undefined,
                  rest: false,
                },
              ],
              returns: {
                type: 'void',
                description: undefined,
              },
            },
          ],
        },
      });

      ComponentTestCase({
        name: 'method as a variable declaration',
        options: {
          filecontent: `
            <script setup>
              /**
               * Name only
               */
              const nameOnly = (somebody) => {
                alert('Hello ' + somebody);
              }
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          data: [],
          methods: [
            {
              kind: 'method',
              syntax: [
                'nameOnly(somebody: unknown): void',
              ],
              visibility: 'public',
              category: undefined,
              description: 'Name only',
              keywords: [],
              name: 'nameOnly',
              params: [
                {
                  type: 'unknown',
                  name: 'somebody',
                  description: undefined,
                  defaultValue: undefined,
                  rest: false,
                },
              ],
              returns: {
                type: 'void',
                description: undefined,
              },
            },
          ],
        },
      });

      ComponentTestCase({
        name: 'method with setup property as declaration',
        options: {
          filecontent: `
            <script>
              export default {
                setup() {
                  /**
                   * Name only
                   */
                  const nameOnly = (somebody) => {
                    alert('Hello ' + somebody);
                  }

                  return { nameOnly }
                }
              }
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          data: [],
          methods: [
            {
              kind: 'method',
              syntax: [
                'nameOnly(somebody: unknown): void',
              ],
              visibility: 'public',
              category: undefined,
              description: 'Name only',
              keywords: [],
              name: 'nameOnly',
              params: [
                {
                  type: 'unknown',
                  name: 'somebody',
                  description: undefined,
                  defaultValue: undefined,
                  rest: false,
                },
              ],
              returns: {
                type: 'void',
                description: undefined,
              },
            },
          ],
        },
      });

      ComponentTestCase({
        name: 'method with setup property',
        options: {
          filecontent: `
            <script>
              export default {
                setup() {
                  return {
                    /**
                     * Name only
                     */
                    nameOnly: (somebody) => {
                      alert('Hello ' + somebody);
                    },
                    /**
                     * Name only
                     */
                    nameOnly2(somebody) {
                      alert('Hello ' + somebody);
                    }
                  }
                }
              }
            </script>
          `,
        },
        expected: {
          errors: [],
          warnings: [],
          data: [],
          methods: [
            {
              kind: 'method',
              syntax: [
                'nameOnly(somebody: unknown): void',
              ],
              visibility: 'public',
              category: undefined,
              description: 'Name only',
              keywords: [],
              name: 'nameOnly',
              params: [
                {
                  type: 'unknown',
                  name: 'somebody',
                  description: undefined,
                  defaultValue: undefined,
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
                'nameOnly2(somebody: unknown): void',
              ],
              visibility: 'public',
              category: undefined,
              description: 'Name only',
              keywords: [],
              name: 'nameOnly2',
              params: [
                {
                  type: 'unknown',
                  name: 'somebody',
                  description: undefined,
                  defaultValue: undefined,
                  rest: false,
                },
              ],
              returns: {
                type: 'void',
                description: undefined,
              },
            },
          ],
        },
      });
    });
  });
});
