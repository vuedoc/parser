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

          <template>
            <h1>{{ message }}</h1>
          </template>
        `,
      },
      expected: {
        name: undefined,
        description: undefined,
        inheritAttrs: true,
        keywords: [],
        events: [],
        methods: [],
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

          <template>
            <h1>{{ message }}</h1>
          </template>
        `,
      },
      expected: {
        name: undefined,
        description: undefined,
        inheritAttrs: true,
        keywords: [],
        events: [],
        methods: [],
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

          <template>
            <h1>{{ message }}</h1>
          </template>
        `,
      },
      expected: {
        name: undefined,
        description: undefined,
        inheritAttrs: true,
        keywords: [],
        events: [],
        methods: [],
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

          <template>
            <h1>{{ message }}</h1>
          </template>
        `,
      },
      expected: {
        name: undefined,
        description: undefined,
        inheritAttrs: true,
        keywords: [],
        events: [],
        methods: [],
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

          <template>
            <h1>{{ message }}</h1>
          </template>
        `,
      },
      expected: {
        name: undefined,
        description: undefined,
        inheritAttrs: true,
        keywords: [],
        events: [],
        methods: [],
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

          <template>
            <h1>{{ message }}</h1>
          </template>
        `,
      },
      expected: {
        name: undefined,
        description: undefined,
        inheritAttrs: true,
        keywords: [],
        events: [],
        methods: [],
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

          <template>
            <h1>{{ message }}</h1>
          </template>
        `,
      },
      expected: {
        name: undefined,
        description: undefined,
        inheritAttrs: true,
        keywords: [],
        events: [],
        methods: [],
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

          <template>
            <h1>{{ message }}</h1>
          </template>
        `,
      },
      expected: {
        name: undefined,
        description: undefined,
        inheritAttrs: true,
        keywords: [],
        events: [],
        methods: [],
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
  });
});
