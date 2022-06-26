import { describe } from '@jest/globals';
import { ComponentTestCase } from './lib/TestUtils.js';

describe('Vue 3', () => {
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
            type: 'String',
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
            type: 'Number',
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
              msg?: string
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
            default: undefined,
            describeModel: false,
            required: false,
            keywords: [],
            visibility: 'public' },
          {
            kind: 'prop',
            name: 'labels',
            type: 'string[]',
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
});
