import { join } from 'path';
import { describe, expect, it } from 'vitest';

describe('Vue3', () => {
  it('name & description', async () => {
    const options = {
      filecontent: `
        <script setup>
          /**
           * My custom component
           * @name MyCustomComponent
           */

          import { ref } from 'vue'

          /**
           * Message value
           */
          const message = 'Hello World!';
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      name: 'MyCustomComponent',
      description: 'My custom component',
      computed: [],
      data: [
        {
          kind: 'data',
          name: 'message',
          type: 'string',
          description: 'Message value',
          initialValue: '"Hello World!"',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('vue-router', async () => {
    const options = {
      composition: {
        data: [
          {
            fname: 'useRoute',
            returningType: 'RouteLocationNormalized',
            returningValue: '',
          },
        ],
      },
      filecontent: `
        <script setup>
          import { useRouter, useRoute } from 'vue-router'

          export default {
            setup() {
              const router = useRouter()
              const route = useRoute()
          
              function pushWithQuery(query) {
                router.push({
                  name: 'search',
                  query: {
                    ...route.query,
                  },
                })
              }

              return { route }
            },
          }          
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [],
      data: [
        {
          kind: 'data',
          name: 'route',
          type: 'RouteLocationNormalized',
          initialValue: '',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('defineComponent()', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      data: [
        {
          kind: 'data',
          name: 'count',
          type: 'number',
          initialValue: '1',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [
        {
          kind: 'prop',
          name: 'name',
          type: 'string',
          describeModel: false,
          required: false,
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'prop',
          name: 'msg',
          type: 'string',
          describeModel: false,
          required: true,
          keywords: [],
          visibility: 'public',
        },
      ],
    });
  });

  it('defineCustomElement()', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      data: [
        {
          kind: 'data',
          name: 'count',
          type: 'number',
          initialValue: '1',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [
        {
          kind: 'prop',
          name: 'name',
          type: 'string',
          describeModel: false,
          required: false,
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'prop',
          name: 'msg',
          type: 'string',
          describeModel: false,
          required: true,
          keywords: [],
          visibility: 'public',
        },
      ],
    });
  });

  it('defineAsyncComponent()', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      data: [
        {
          kind: 'data',
          name: 'count',
          type: 'number',
          initialValue: '1',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [
        {
          kind: 'prop',
          name: 'name',
          type: 'string',
          describeModel: false,
          required: false,
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'prop',
          name: 'msg',
          type: 'string',
          describeModel: false,
          required: true,
          keywords: [],
          visibility: 'public',
        },
      ],
    });
  });

  it('defineComponent() with setup', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      data: [],
      props: [
        {
          kind: 'prop',
          name: 'message',
          type: 'string',
          describeModel: false,
          required: false,
          keywords: [],
          visibility: 'public',
        },
      ],
    });
  });

  it('createApp()', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      data: [
        {
          kind: 'data',
          name: 'count',
          type: 'number',
          initialValue: '0',
          keywords: [],
          visibility: 'public',
        },
      ],
    });
  });

  it('createApp() with setup', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      data: [
        {
          kind: 'data',
          name: 'count',
          type: 'number',
          initialValue: '0',
          keywords: [],
          visibility: 'public',
        },
      ],
    });
  });

  it('useAttrs()', async () => {
    const options = {
      filecontent: `
        <script setup>
          import { useAttrs } from 'vue'

          const attrs = useAttrs()
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      data: [],
    });
  });

  it('should handle explicit import for composition fname', async () => {
    const options = {
      filecontent: `
        <script setup>
          import { ref as renamedRef } from 'vue'

          /**
           * Message value
           */
          const message = renamedRef('Hello World!');
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      data: [
        {
          kind: 'data',
          name: 'message',
          type: 'string',
          description: 'Message value',
          initialValue: '"Hello World!"',
          keywords: [],
          visibility: 'public',
        },
      ],
    });
  });

  it('PropType<T>', async () => {
    const options = {
      filecontent: `
        <script setup>
          import { PropType } from 'vue'

          interface Book {
            title: string
            author: string
            year: number
          }
          
          export default {
            props: {
              book: {
                // provide more specific type to \`Object\`
                type: Object as PropType<Book>,
                required: true
              }
            }
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      props: [
        {
          kind: 'prop',
          name: 'book',
          type: 'Book',
          required: true,
          describeModel: false,
          keywords: [],
          visibility: 'public',
        },
      ],
    });
  });

  it('should handle custom composition useMouse() and destructuring variable declaration', async () => {
    const options = {
      filecontent: `
        <script lang="ts">
          import { defineComponent } from 'vue';
          import useMouse from './useMouse';
          
          export default defineComponent({
            setup() {
              const {
                /**
                 * The state of the mouse
                 * @type object
                 * @initialValue {"x":0,"y":0,"buttonHeld":false}
                 */
                mouseState,
                /**
                 * Get scalar distance of mouse position from (0,0)
                 * @type function
                 */
                mouseDistance
              } = useMouse();
          
              return {
                mouseState,
                mouseDistance,
              }
            }
          })
        </script>        
      `,
    };

    await expect(options).toParseAs({
      warnings: [],
      errors: [
        "Cannot find module './useMouse'. Make sure to define options.resolver",
      ],
      data: [
        {
          kind: 'data',
          name: 'mouseState',
          type: 'object',
          description: 'The state of the mouse',
          initialValue: '{"x":0,"y":0,"buttonHeld":false}',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'data',
          name: 'mouseDistance',
          type: 'function',
          description: 'Get scalar distance of mouse position from (0,0)',
          initialValue: '',
          keywords: [],
          visibility: 'public',
        },
      ],
    });
  });

  it('should handle custom composition useMouse() using function declaration useMouse()', async () => {
    const options = {
      filecontent: `
        <script lang="ts">
          import { defineComponent } from 'vue';

          function useMouse() {
            /**
             * The state of the mouse
             */
            const mouseState: IMouseState = reactive({ x: 0, y: 0, buttonHeld: false });
          
            function update(event: MouseEvent) {
              mouseState.x = event.pageX;
              mouseState.y = event.pageY;
              mouseState.buttonHeld = (event.buttons & 0x1) !== 0;
            }
          
            /**
             * Get scalar distance of mouse position from (0,0)
             * @returns {number} Distance of pointer from (0,0)
             */
            const mouseDistance = () => Math.sqrt(mouseState.x ** 2 + mouseState.y ** 2);
          
            onMounted(() => {
              window.addEventListener('mousemove', update);
              window.addEventListener('mousedown', update);
              window.addEventListener('mouseup', update);
            })
            onUnmounted(() => {
              window.removeEventListener('mousemove', update);
              window.removeEventListener('mousedown', update);
              window.removeEventListener('mouseup', update);
            })
          
            return {
              mouseState,
              mouseDistance,
            }
          }            
          
          export default defineComponent({
            setup() {
              const { mouseState, mouseDistance } = useMouse();
          
              return {
                mouseState,
                mouseDistance,
              }
            }
          })
        </script>        
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      data: [
        {
          kind: 'data',
          name: 'mouseState',
          type: 'IMouseState',
          description: 'The state of the mouse',
          initialValue: '{"x":0,"y":0,"buttonHeld":false}',
          keywords: [],
          visibility: 'public',
        },
      ],
      methods: [
        {
          kind: 'method',
          description: 'Get scalar distance of mouse position from (0,0)',
          keywords: [],
          visibility: 'public',
          name: 'mouseDistance',
          params: [],
          syntax: [
            'mouseDistance(): number',
          ],
          returns: {
            type: 'number',
            description: 'Distance of pointer from (0,0)',
          },
        },
      ],
    });
  });

  it('should handle custom composition useMouse() defined on another imported file and missing options.resolver', async () => {
    const options = {
      filecontent: `
        <script lang="ts">
          import { defineComponent } from 'vue.js';
          import useMouse from './useMouse';       
          
          export default defineComponent({
            setup() {
              const { mouseState, mouseDistance } = useMouse();
          
              return {
                mouseState,
                mouseDistance,
              }
            }
          })
        </script>        
      `,
    };

    await expect(options).toParseAs({
      warnings: [],
      errors: [
        "Cannot find module './useMouse'. Make sure to define options.resolver",
      ],
      data: [
        {
          kind: 'data',
          name: 'mouseState',
          type: 'unknown',
          initialValue: '',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'data',
          name: 'mouseDistance',
          type: 'unknown',
          initialValue: '',
          keywords: [],
          visibility: 'public',
        },
      ],
      methods: [],
    });
  });

  it('should handle custom composition useMouse() defined on another imported file and options.resolver', async () => {
    const options = {
      resolver: {
        basedir: join(__dirname, '../fixtures'),
      },
      filecontent: `
        <script lang="ts">
          import { defineComponent } from 'vue';
          import useMouse from './useMouse';       
          
          export default defineComponent({
            setup() {
              const { mouseState, mouseDistance } = useMouse();
          
              return {
                mouseState,
                mouseDistance,
              }
            }
          })
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      data: [
        {
          kind: 'data',
          name: 'mouseState',
          type: 'IMouseState',
          description: 'The state of the mouse',
          initialValue: '{"x":0,"y":0,"buttonHeld":false}',
          keywords: [],
          visibility: 'public',
        },
      ],
      methods: [
        {
          kind: 'method',
          description: 'Get scalar distance of mouse position from (0,0)',
          keywords: [],
          visibility: 'public',
          name: 'mouseDistance',
          params: [],
          syntax: [
            'mouseDistance(): number',
          ],
          returns: {
            type: 'number',
            description: 'Distance of pointer from (0,0)',
          },
        },
      ],
    });
  });

  it('useSlots()', async () => {
    const options = {
      filecontent: `
        <script setup>
          import { useSlots } from 'vue'

          const slots = useSlots()
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      data: [],
    });
  });

  it('undefined third library vueuse with useStorage()', async () => {
    const options = {
      filecontent: `
        <script setup>
          import { useStorage } from 'vueuse';

          const store = useStorage()
        </script>
      `,
    };

    await expect(options).toParseAs({
      warnings: [],
      errors: [
        "Cannot find module 'vueuse'. Make sure to define options.resolver",
      ],
      data: [
        {
          kind: 'data',
          name: 'store',
          type: 'unknown',
          initialValue: 'useStorage()',
          visibility: 'public',
          keywords: [],
        },
      ],
    });
  });

  it('third library vueuse with useStorage() with defined options.composition', async () => {
    const options = {
      composition: {
        data: [
          {
            fname: 'useStorage',
            typeParameterIndex: 0,
            valueIndex: 1,
          },
        ],
      },
      filecontent: `
        <script setup>
          import { useSlots } from 'vue'
          import { useStorage } from 'vueuse';

          type Store = {
            /**
             * The user name
             */
            username: string;
            /**
             * The user session token
             */
            token?: string;
          };

          const { username, token } = useStorage<Store>('my-store', {
            username: 'demouser',
          });
        </script>
      `,
    };

    await expect(options).toParseAs({
      warnings: [],
      errors: [
        "Cannot find module 'vueuse'. Make sure to define options.resolver",
      ],
      data: [
        {
          kind: 'data',
          name: 'username',
          type: 'string',
          description: 'The user name',
          keywords: [],
          visibility: 'public',
          initialValue: '"demouser"',
        },
        {
          kind: 'data',
          name: 'token',
          type: 'string | undefined',
          description: 'The user session token',
          initialValue: 'undefined',
          keywords: [],
          visibility: 'public',
        },
      ],
    });
  });

  it('Composition API - State: Handle expose', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      data: [
        {
          kind: 'data',
          name: 'x',
          type: 'number',
          initialValue: '1',
          keywords: [],
          visibility: 'private',
        },
      ],
      computed: [
        {
          kind: 'computed',
          name: 'y',
          type: 'number',
          dependencies: [],
          keywords: [],
          visibility: 'private',
        },
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
    });
  });

  it('setup()', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      data: [
        {
          kind: 'data',
          name: 'state',
          type: '{ count: number; }',
          initialValue: '{"count":0}',
          keywords: [],
          visibility: 'public',
        },
      ],
    });
  });

  it('setup() with Render Functions', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      data: [],
    });
  });

  it('defineExpose()', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
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
    });
  });

  it('export default defineComponent() with external data', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      data: [],
      props: [],
      events: [],
      methods: [],
    });
  });

  it('export default defineComponent() data defined inside setup() and no return expose', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      data: [],
      props: [],
      events: [],
      methods: [],
    });
  });

  it('export default defineComponent() data defined inside setup() and return expose', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
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
            type: 'number',
          },
          syntax: [
            'increment(): number',
          ],
          visibility: 'public',
        },
      ],
    });
  });

  it('setup() with empty expose()', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      data: [],
    });
  });

  it('setup() with selectively expose local state', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      data: [
        {
          kind: 'data',
          name: 'count',
          type: 'number',
          initialValue: '0',
          keywords: [],
          visibility: 'public',
        },
      ],
    });
  });

  it('extends', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      props: [
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          type: 'number',
          name: 'age',
          describeModel: false,
          required: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          type: 'string',
          name: 'name',
          describeModel: false,
          required: false,
        },
      ],
    });
  });

  it('complexe example', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      props: [],
      data: [
        {
          initialValue: '""',
          keywords: [],
          kind: 'data',
          name: 'selected',
          type: 'string',
          visibility: 'public',
        },
        {
          initialValue: '""',
          keywords: [],
          kind: 'data',
          name: 'prefix',
          type: 'string',
          visibility: 'public',
        },
        {
          initialValue: '""',
          keywords: [],
          kind: 'data',
          name: 'first',
          type: 'string',
          visibility: 'public',
        },
        {
          initialValue: '""',
          keywords: [],
          kind: 'data',
          name: 'last',
          type: 'string',
          visibility: 'public',
        },
      ],
      computed: [
        {
          keywords: [],
          dependencies: [],
          kind: 'computed',
          name: 'filteredNames',
          type: 'unknown',
          visibility: 'public',
        },
      ],
      methods: [
        {
          keywords: [],
          kind: 'method',
          name: 'create',
          params: [],
          returns: {
            type: 'void',
          },
          syntax: [
            'create(): void',
          ],
          visibility: 'public',
        },
        {
          keywords: [],
          kind: 'method',
          name: 'update',
          params: [],
          returns: {
            type: 'void',
          },
          syntax: [
            'update(): void',
          ],
          visibility: 'public',
        },
        {
          keywords: [],
          kind: 'method',
          name: 'del',
          params: [],
          returns: {
            type: 'void',
          },
          syntax: [
            'del(): void',
          ],
          visibility: 'public',
        },
        {
          keywords: [],
          kind: 'method',
          name: 'hasValidInput',
          params: [],
          returns: {
            type: 'boolean',
          },
          syntax: [
            'hasValidInput(): boolean',
          ],
          visibility: 'public',
        },
      ],
    });
  });

  it('complexe example with global variables', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      props: [],
      data: [
        {
          initialValue: '["main","v2-compat"]',
          keywords: [],
          kind: 'data',
          name: 'branches',
          type: 'string[]',
          visibility: 'public',
        },
        {
          initialValue: '"main"',
          keywords: [],
          kind: 'data',
          name: 'currentBranch',
          type: 'string',
          visibility: 'public',
        },
        {
          initialValue: 'null',
          keywords: [],
          kind: 'data',
          name: 'commits',
          type: 'unknown',
          visibility: 'public',
        },
      ],
      computed: [],
      methods: [
        {
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
            type: 'unknown',
          },
          syntax: [
            'truncate(v: unknown): unknown',
          ],
          visibility: 'public',
        },
        {
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
            type: 'unknown',
          },
          syntax: [
            'formatDate(v: unknown): unknown',
          ],
          visibility: 'public',
        },
      ],
    });
  });

  it('complexe example with global variables with irelevant properties model and watch which will be ignored on parsing', async () => {
    const options = {
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
                this.$emit(\`foo-changed\`, newVal)
              },
            },
          };          
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      props: [],
      data: [
        {
          initialValue: '["main","v2-compat"]',
          keywords: [],
          kind: 'data',
          name: 'branches',
          type: 'string[]',
          visibility: 'public',
        },
        {
          initialValue: '"main"',
          keywords: [],
          kind: 'data',
          name: 'currentBranch',
          type: 'string',
          visibility: 'public',
        },
        {
          initialValue: 'null',
          keywords: [],
          kind: 'data',
          name: 'commits',
          type: 'unknown',
          visibility: 'public',
        },
      ],
      computed: [],
      methods: [
        {
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
            type: 'unknown',
          },
          syntax: [
            'truncate(v: unknown): unknown',
          ],
          visibility: 'public',
        },
        {
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
            type: 'unknown',
          },
          syntax: [
            'formatDate(v: unknown): unknown',
          ],
          visibility: 'public',
        },
      ],
    });
  });

  it('complexe todo example with composition api', async () => {
    const options = {
      filecontent: `
        <script>
          import { ref, computed, watchEffect } from 'vue';
          
          const STORAGE_KEY = 'vue-todomvc';
          
          const filters = {
            all: (todos) => todos,
            active: (todos) => todos.filter((todo) => !todo.completed),
            completed: (todos) => todos.filter((todo) => todo.completed),
          };
          
          export default {
            setup() {
              // state
              const todos = ref(JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]'));
              const visibility = ref('all');
              const editedTodo = ref(null);
          
              // derived state
              const filteredTodos = computed(() => filters[visibility.value](todos.value));
              const remaining = computed(() => Math.sqr(2));
          
              // handle routing
              window.addEventListener('hashchange', onHashChange);
              onHashChange();
          
              // persist state
              watchEffect(() => {
                localStorage.setItem(STORAGE_KEY, JSON.stringify(todos.value));
              });
          
              function toggleAll(e) {
                todos.value.forEach((todo) => (todo.completed = e.target.checked));
              }
          
              function addTodo(e) {
                const value = e.target.value.trim();
          
                if (value) {
                  todos.value.push({
                    id: Date.now(),
                    title: value,
                    completed: false,
                  });
                  e.target.value = '';
                }
              }
          
              function removeTodo(todo) {
                todos.value.splice(todos.value.indexOf(todo), 1);
              }
          
              let beforeEditCache = '';
          
              function editTodo(todo) {
                beforeEditCache = todo.title;
                editedTodo.value = todo;
              }
          
              function cancelEdit(todo) {
                editedTodo.value = null;
                todo.title = beforeEditCache;
              }
          
              function doneEdit(todo) {
                if (editedTodo.value) {
                  editedTodo.value = null;
                  todo.title = todo.title.trim();
                  if (!todo.title) removeTodo(todo);
                }
              }
          
              function removeCompleted() {
                todos.value = filters.active(todos.value);
              }
          
              function onHashChange() {
                const route = window.location.hash.replace(/#\\/?/, '');
          
                if (filters[route]) {
                  visibility.value = route;
                } else {
                  window.location.hash = '';
                  visibility.value = 'all';
                }
              }
          
              return {
                todos,
                editedTodo,
                visibility,
                filteredTodos,
                remaining,
                toggleAll,
                addTodo,
                removeTodo,
                editTodo,
                doneEdit,
                cancelEdit,
                removeCompleted,
              };
            },
          };
        </script>
      `,
    };

    await expect(options).toParseAs({
      inheritAttrs: true,
      errors: [],
      warnings: [],
      keywords: [],
      props: [],
      data: [
        {
          kind: 'data',
          description: 'state',
          keywords: [],
          visibility: 'public',
          name: 'todos',
          type: 'unknown',
          initialValue: "JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]')",
        },
        {
          kind: 'data',
          keywords: [],
          visibility: 'public',
          name: 'editedTodo',
          type: 'unknown',
          initialValue: 'null',
        },
        {
          kind: 'data',
          keywords: [],
          visibility: 'public',
          name: 'visibility',
          type: 'string',
          initialValue: '"all"',
        },
      ],
      computed: [
        {
          kind: 'computed',
          description: 'derived state',
          keywords: [],
          visibility: 'public',
          name: 'filteredTodos',
          type: 'unknown',
          dependencies: [],
        },
        {
          kind: 'computed',
          keywords: [],
          visibility: 'public',
          name: 'remaining',
          type: 'number',
          dependencies: [],
        },
      ],
      methods: [
        {
          kind: 'method',
          keywords: [],
          visibility: 'public',
          name: 'toggleAll',
          params: [
            {
              name: 'e',
              type: 'unknown',
              rest: false,
            },
          ],
          syntax: [
            'toggleAll(e: unknown): void',
          ],
          returns: {
            type: 'void',
          },
        },
        {
          kind: 'method',
          keywords: [],
          visibility: 'public',
          name: 'addTodo',
          params: [
            {
              name: 'e',
              type: 'unknown',
              rest: false,
            },
          ],
          syntax: [
            'addTodo(e: unknown): void',
          ],
          returns: {
            type: 'void',
          },
        },
        {
          kind: 'method',
          keywords: [],
          visibility: 'public',
          name: 'removeTodo',
          params: [
            {
              name: 'todo',
              type: 'unknown',
              rest: false,
            },
          ],
          syntax: [
            'removeTodo(todo: unknown): void',
          ],
          returns: {
            type: 'void',
          },
        },
        {
          kind: 'method',
          keywords: [],
          visibility: 'public',
          name: 'editTodo',
          params: [
            {
              name: 'todo',
              type: 'unknown',
              rest: false,
            },
          ],
          syntax: [
            'editTodo(todo: unknown): void',
          ],
          returns: {
            type: 'void',
          },
        },
        {
          kind: 'method',
          keywords: [],
          visibility: 'public',
          name: 'doneEdit',
          params: [
            {
              name: 'todo',
              type: 'unknown',
              rest: false,
            },
          ],
          syntax: [
            'doneEdit(todo: unknown): void',
          ],
          returns: {
            type: 'void',
          },
        },
        {
          kind: 'method',
          keywords: [],
          visibility: 'public',
          name: 'cancelEdit',
          params: [
            {
              name: 'todo',
              type: 'unknown',
              rest: false,
            },
          ],
          syntax: [
            'cancelEdit(todo: unknown): void',
          ],
          returns: {
            type: 'void',
          },
        },
        {
          kind: 'method',
          keywords: [],
          visibility: 'public',
          name: 'removeCompleted',
          params: [],
          syntax: [
            'removeCompleted(): void',
          ],
          returns: {
            type: 'void',
          },
        },
      ],
      events: [],
      slots: [],
    });
  });

  it('simple declaration', async () => {
    const options = {
      filecontent: `
        <script setup>
          import { ref } from 'vue'

          /**
           * Message value
           */
          const message = 'Hello World!';
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [],
      data: [
        {
          kind: 'data',
          name: 'message',
          type: 'string',
          description: 'Message value',
          initialValue: '"Hello World!"',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('simple declaration with typing', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [],
      data: [
        {
          kind: 'data',
          name: 'message',
          type: 'CustomString',
          description: 'Message value',
          initialValue: '"Hello World!"',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'data',
          name: 'message2',
          type: 'bool.Custom',
          description: 'Message value',
          initialValue: '"Hello World!"',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'data',
          name: 'x',
          type: 'string | number',
          initialValue: '1',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('multiple declarations', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [],
      data: [
        {
          kind: 'data',
          name: 'message',
          type: 'string',
          description: 'Message value',
          initialValue: '"Hello World!"',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'data',
          name: 'message2',
          type: 'string',
          description: 'Message value 2',
          initialValue: '"Hello World!2"',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('ref declaration', async () => {
    const options = {
      filecontent: `
        <script setup>
          import { ref } from 'vue'

          /**
           * Message value
           */
          const message = ref('Hello World!');
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [],
      data: [
        {
          kind: 'data',
          name: 'message',
          type: 'string',
          description: 'Message value',
          initialValue: '"Hello World!"',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('multiple ref declarations', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [],
      data: [
        {
          kind: 'data',
          name: 'message',
          type: 'string',
          description: 'Message value',
          initialValue: '"Hello World!"',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'data',
          name: 'message2',
          type: 'string',
          description: 'Message value 2',
          initialValue: '"Hello World!2"',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('ref declaration with typing', async () => {
    const options = {
      filecontent: `
        <script lang="ts" setup>
          import { ref } from 'vue'

          /**
           * Message value
           */
          const message = ref<CustomString>('Hello World!');
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [],
      data: [
        {
          kind: 'data',
          name: 'message',
          type: 'CustomString',
          description: 'Message value',
          initialValue: '"Hello World!"',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('reactive declaration', async () => {
    const options = {
      filecontent: `
        <script setup>
          import { reactive } from 'vue'

          /**
           * Message value
           */
          const obj = reactive({ count: 0 })
          const map = reactive(new Map([['count', ref(0)]]))
          /**
           * The state of the mouse
           */
          const mouseState: IMouseState = reactive({ x: 0, y: 0, buttonHeld: false });
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [],
      data: [
        {
          kind: 'data',
          name: 'obj',
          type: '{ count: number; }',
          description: 'Message value',
          initialValue: '{"count":0}',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'data',
          name: 'map',
          type: 'Map',
          initialValue: "new Map([['count', ref(0)]])",
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'data',
          name: 'mouseState',
          type: 'IMouseState',
          description: 'The state of the mouse',
          initialValue: '{"x":0,"y":0,"buttonHeld":false}',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('readonly() declaration', async () => {
    const options = {
      filecontent: `
        <script setup>
          import { reactive, readonly } from 'vue'

          const original = reactive({ count: 0 })
          const copy = readonly(original)
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [],
      data: [
        {
          kind: 'data',
          name: 'original',
          type: '{ count: number; }',
          initialValue: '{"count":0}',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'data',
          name: 'copy',
          type: '{ count: number; }',
          initialValue: '{"count":0}',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('shallowRef() declaration', async () => {
    const options = {
      filecontent: `
        <script setup>
          import { shallowRef } from 'vue'

          const state = shallowRef({ count: 1 })
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [],
      data: [
        {
          kind: 'data',
          name: 'state',
          type: '{ count: number; }',
          initialValue: '{"count":1}',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('shallowReactive() declaration', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [],
      data: [
        {
          kind: 'data',
          name: 'state',
          type: '{ foo: number; nested: { bar: number; }; }',
          initialValue: '{"foo":1,"nested":{"bar":2}}',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('shallowReadonly() declaration', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [],
      data: [
        {
          kind: 'data',
          name: 'state',
          type: '{ foo: number; nested: { bar: number; }; }',
          initialValue: '{"foo":1,"nested":{"bar":2}}',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('triggerRef() declaration', async () => {
    const options = {
      filecontent: `
        <script setup>
          import { triggerRef } from 'vue'

          const shallow = triggerRef({
            greet: 'Hello, world'
          })
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [],
      data: [
        {
          kind: 'data',
          name: 'shallow',
          type: '{ greet: string; }',
          initialValue: '{"greet":"Hello, world"}',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('useAttrs() declaration', async () => {
    const options = {
      filecontent: `
        <script setup>
          import { useAttrs } from 'vue'

          const shallow = useAttrs({
            greet: 'Hello, world'
          })
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [],
      data: [],
      props: [],
    });
  });

  it('toRaw() declaration', async () => {
    const options = {
      filecontent: `
        <script setup>
          import { toRaw } from 'vue'

          const foo = {}
          const reactiveFoo = reactive(foo)
          const rawFoo = toRaw(reactiveFoo)
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [],
      data: [
        {
          kind: 'data',
          name: 'foo',
          type: 'object',
          initialValue: '{}',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'data',
          name: 'reactiveFoo',
          type: 'object',
          initialValue: '{}',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'data',
          name: 'rawFoo',
          type: 'object',
          initialValue: '{}',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('markRaw() declaration', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [],
      data: [
        {
          kind: 'data',
          name: 'foo',
          type: '{ nested: object; }',
          initialValue: '{"nested":{}}',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'data',
          name: 'bar',
          type: '{ nested: object; }',
          initialValue: '{"nested":{}}',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('unref() declaration', async () => {
    const options = {
      filecontent: `
      <script setup>
        import { ref, unref } from 'vue'

        const foo = ref({
          nested: {}
        })

        const bar = unref(foo)
      </script>
    `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [],
      data: [
        {
          kind: 'data',
          name: 'foo',
          type: '{ nested: object; }',
          initialValue: '{"nested":{}}',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'data',
          name: 'bar',
          type: '{ nested: object; }',
          initialValue: '{"nested":{}}',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('methods composition with debounce()', async () => {
    const options = {
      composition: {
        methods: [
          {
            fname: 'debounce',
            valueIndex: 0,
          },
        ],
      },
      filecontent: `
      <script>
        import { marked } from 'marked';
        import { debounce } from 'lodash-es';
        import { ref, computed } from 'vue';
        
        export default {
          setup() {
            const input = ref('# hello');
        
            const output = computed(() => marked(input.value));
        
            const update = debounce((e) => {
              input.value = e.target.value;
            }, 100);
        
            return {
              input,
              output,
              update,
            };
          },
        };            
      </script>
    `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      props: [],
      computed: [
        {
          kind: 'computed',
          name: 'output',
          type: 'unknown',
          dependencies: [],
          keywords: [],
          visibility: 'public',
        },
      ],
      data: [
        {
          kind: 'data',
          name: 'input',
          type: 'string',
          initialValue: '"# hello"',
          keywords: [],
          visibility: 'public',
        },
      ],
      methods: [
        {
          kind: 'method',
          name: 'update',
          syntax: [
            'update(e: unknown): void',
          ],
          keywords: [],
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
          visibility: 'public',
        },
      ],
    });
  });

  it('toRef() declaration', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [],
      data: [
        {
          kind: 'data',
          name: 'state',
          type: '{ foo: number; bar: number; }',
          initialValue: '{"foo":1,"bar":2}',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'data',
          name: 'fooRef',
          type: 'number',
          initialValue: '1',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('setup() with return', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [],
      data: [
        {
          kind: 'data',
          name: 'message',
          type: 'string',
          initialValue: '"Hello World!"',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'data',
          name: 'isRed',
          type: 'boolean',
          initialValue: 'true',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'data',
          name: 'color',
          type: 'string',
          initialValue: '"green"',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('explicit exposing ref()', async () => {
    const options = {
      filecontent: `
      <script>
        import { ref } from 'vue';

        export default {
          setup() {
            return {
              /**
               * Message text
               */
              message: ref('Hello World!'),
            };
          },
        };

      </script>
    `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [],
      data: [
        {
          kind: 'data',
          name: 'message',
          type: 'string',
          description: 'Message text',
          initialValue: '"Hello World!"',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('simple declaration', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [
        {
          kind: 'computed',
          name: 'message',
          type: 'string',
          description: 'Message value',
          dependencies: [],
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('simple declaration #2', async () => {
    const options = {
      filecontent: `
      <script setup>
        import { computed, ref } from 'vue'

        const messagex = ref('Hello World!');

        /**
         * Message value
         */
        const message = computed(() => messagex.value);
      </script>
    `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [
        {
          kind: 'computed',
          name: 'message',
          type: 'string',
          description: 'Message value',
          dependencies: [],
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('simple declaration with typing', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [
        {
          kind: 'computed',
          name: 'message',
          type: 'number',
          description: 'Message value',
          dependencies: [],
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'computed',
          name: 'message2',
          type: 'bool.custom',
          description: 'Message value',
          dependencies: [],
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'computed',
          name: 'message3',
          type: 'custom',
          description: 'Message value',
          dependencies: [],
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('writable computed', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [
        {
          kind: 'computed',
          name: 'fullName',
          type: 'string',
          description: 'Message value',
          dependencies: [],
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'computed',
          name: 'fullName2',
          type: 'kakarot',
          description: 'Message value',
          dependencies: [],
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [],
    });
  });

  it('effectScope() declaration', async () => {
    const options = {
      filecontent: `
      <script setup>
        import { effectScope } from 'vue'

        const scope = effectScope()

        scope.run((props, { expose }) => {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [
        {
          kind: 'computed',
          name: 'doubled',
          type: 'number',
          dependencies: [],
          keywords: [],
          visibility: 'public',
        },
      ],
      data: [],
      props: [],
    });
  });

  it('effectScope() declaration with expose()', async () => {
    const options = {
      filecontent: `
      <script setup>
        import { effectScope } from 'vue'

        const scope = effectScope()

        scope.run((props, { expose }) => {
          /**
           * @type number
           */
          const doubled = computed(() => counter.value * 2)
          const modulo = computed(() => counter.value % 2)

          watch(doubled, () => console.log(doubled.value))

          watchEffect(() => console.log('Count: ', doubled.value))

          expose({ doubled })
        })

        // to dispose all effects in the scope
        scope.stop()
      </script>
    `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [
        {
          kind: 'computed',
          name: 'doubled',
          type: 'number',
          dependencies: [],
          keywords: [],
          visibility: 'public',
        },
      ],
      data: [],
      props: [],
    });
  });

  it('effectScope() declaration with return', async () => {
    const options = {
      filecontent: `
      <script setup>
        import { effectScope } from 'vue'

        const scope = effectScope()

        scope.run((props, { expose }) => {
          /**
           * @type number
           */
          const doubled = computed(() => counter.value * 2)
          const modulo = computed(() => counter.value % 2)

          watch(doubled, () => console.log(doubled.value))

          watchEffect(() => console.log('Count: ', doubled.value))

          return { doubled }
        })

        // to dispose all effects in the scope
        scope.stop()
      </script>
    `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [
        {
          kind: 'computed',
          name: 'doubled',
          type: 'number',
          dependencies: [],
          keywords: [],
          visibility: 'public',
        },
      ],
      data: [],
      props: [],
    });
  });

  it('effectScope() declaration with inline return', async () => {
    const options = {
      filecontent: `
      <script setup>
        import { effectScope } from 'vue'

        const scope = effectScope()

        scope.run((props, { expose }) => ({
          /**
           * @type number
           */
          doubled: computed(() => counter.value * 2),
        }))

        // to dispose all effects in the scope
        scope.stop()
      </script>
    `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [
        {
          kind: 'computed',
          name: 'doubled',
          type: 'number',
          dependencies: [],
          keywords: [],
          visibility: 'public',
        },
      ],
      data: [],
      props: [],
    });
  });

  it('effectScope() declaration with defineExpose()', async () => {
    const options = {
      filecontent: `
      <script setup>
        import { effectScope, defineExpose } from 'vue'

        const scope = effectScope()

        scope.run(function () {
          /**
           * @type number
           */
          const doubled = computed(() => counter.value * 2)
          const modulo = computed(() => counter.value % 2)

          watch(doubled, () => console.log(doubled.value))

          watchEffect(() => console.log('Count: ', doubled.value))

          defineExpose({ doubled })
        })

        // to dispose all effects in the scope
        scope.stop()
      </script>
    `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [
        {
          kind: 'computed',
          name: 'doubled',
          type: 'number',
          dependencies: [],
          keywords: [],
          visibility: 'public',
        },
      ],
      data: [],
      props: [],
    });
  });

  it('emits as array', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      events: [
        {
          kind: 'event',
          name: 'change',
          keywords: [],
          visibility: 'public',
          arguments: [],
        },
      ],
    });
  });

  it('with defineComponent()', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      events: [
        {
          kind: 'event',
          name: 'change',
          keywords: [],
          visibility: 'public',
          arguments: [],
        },
      ],
    });
  });

  it('simple declaration', async () => {
    const options = {
      filecontent: `
      <script setup>
        const emit = defineEmits(['change', 'delete'])
      </script>
    `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      events: [
        {
          kind: 'event',
          name: 'change',
          keywords: [],
          visibility: 'public',
          arguments: [],
        },
        {
          kind: 'event',
          name: 'delete',
          keywords: [],
          visibility: 'public',
          arguments: [],
        },
      ],
    });
  });

  it('Type-only emit declarations', async () => {
    const options = {
      filecontent: `
      <script setup>
        const emit = defineEmits<{
          (e: 'change', id: number): void
          (e: 'update', value: string): void
        }>()
      </script>
    `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      events: [
        {
          kind: 'event',
          name: 'change',
          keywords: [],
          visibility: 'public',
          arguments: [
            {
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
          visibility: 'public',
          arguments: [
            {
              name: 'value',
              rest: false,
              type: 'string',
            },
          ],
        },
      ],
    });
  });

  it('Events Validation', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      events: [
        {
          kind: 'event',
          name: 'click',
          keywords: [],
          description: 'No validation',
          visibility: 'public',
          arguments: [],
        },
        {
          kind: 'event',
          name: 'submit',
          keywords: [],
          description: 'Validate submit event',
          visibility: 'public',
          arguments: [
            {
              name: '{ email, password }',
              rest: false,
              type: 'object',
            },
          ],
        },
      ],
    });
  });

  it('Usage with v-model', async () => {
    const options = {
      filecontent: `
      <script setup>
        defineProps(['modelValue'])
        defineEmits(['update:modelValue'])
      </script>
    `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      events: [],
      props: [
        {
          kind: 'prop',
          name: 'v-model',
          type: 'unknown',
          required: true,
          visibility: 'public',
          describeModel: true,
          keywords: [],
        },
      ],
    });
  });

  it('Multiple v-model bindings', async () => {
    const options = {
      filecontent: `
      <script setup>
        defineProps({
          firstName: String,
          lastName: String
        })

        defineEmits(['update:firstName', 'update:lastName'])
      </script>
    `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      props: [
        {
          describeModel: true,
          keywords: [],
          kind: 'prop',
          name: 'v-model:first-name',
          required: false,
          type: 'string',
          visibility: 'public',
        },
        {
          describeModel: true,
          keywords: [],
          kind: 'prop',
          name: 'v-model:last-name',
          required: false,
          type: 'string',
          visibility: 'public',
        },
      ],
      events: [
        {
          kind: 'event',
          name: 'update:first-name',
          keywords: [],
          visibility: 'public',
          arguments: [],
        },
        {
          kind: 'event',
          name: 'update:last-name',
          keywords: [],
          visibility: 'public',
          arguments: [],
        },
      ],
    });
  });

  it('method as a function definition', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
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
          description: 'Name only',
          keywords: [],
          name: 'nameOnly',
          params: [
            {
              type: 'unknown',
              name: 'somebody',
              rest: false,
            },
          ],
          returns: {
            type: 'void',
          },
        },
      ],
    });
  });

  it('method as a variable declaration', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
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
          description: 'Name only',
          keywords: [],
          name: 'nameOnly',
          params: [
            {
              type: 'unknown',
              name: 'somebody',
              rest: false,
            },
          ],
          returns: {
            type: 'void',
          },
        },
      ],
    });
  });

  it('method with setup property as declaration', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
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
          description: 'Name only',
          keywords: [],
          name: 'nameOnly',
          params: [
            {
              type: 'unknown',
              name: 'somebody',
              rest: false,
            },
          ],
          returns: {
            type: 'void',
          },
        },
      ],
    });
  });

  it('method with setup property', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
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
          description: 'Name only',
          keywords: [],
          name: 'nameOnly',
          params: [
            {
              type: 'unknown',
              name: 'somebody',
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
            'nameOnly2(somebody: unknown): void',
          ],
          visibility: 'public',
          description: 'Name only',
          keywords: [],
          name: 'nameOnly2',
          params: [
            {
              type: 'unknown',
              name: 'somebody',
              rest: false,
            },
          ],
          returns: {
            type: 'void',
          },
        },
      ],
    });
  });
});
