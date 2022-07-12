import { describe } from '@jest/globals';
import { ComponentTestCase } from './lib/TestUtils.js';

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
  });

  describe('Composition API', () => {
    describe('data', () => {
      ComponentTestCase({
        name: 'simple declaration',
        options: {
          filecontent: `
            <script setup>
              import { ref } from 'vue'

              /**
               * Message value
               */
              const message = 'Hello World!';
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
        name: 'simple declaration with typing',
        options: {
          filecontent: `
            <script lang="ts" setup>
              import { ref } from 'vue'

              /**
               * Message value
               */
              const message: number = 'Hello World!';

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
              type: 'number',
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
              const message = ref<number>('Hello World!');
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
              type: 'number',
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
              name: 'model-value',
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
              name: 'model-value',
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
              name: 'model-value',
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
              name: 'model-value',
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
              default: "['one', 'two']",
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
        name: 'with defineComponent()',
        options: {
          filecontent: `
            <script setup>
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
  });
});
