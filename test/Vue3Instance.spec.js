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



    //---

  // ComponentTestCase({
  //   name: 'Handling User Input',
  //   options: {
  //     filecontent: `        
  //       <script>
  //         export default {
  //           data() {
  //             return {
  //               message: 'Hello World!'
  //             }
  //           },
  //           methods: {
  //             reverseMessage() {
  //               this.message = this.message.split('').reverse().join('')
  //             },
  //             notify() {
  //               alert('navigation was prevented.')
  //             }
  //           }
  //         }
  //       </script>
        
  //       <template>
  //         <!--
  //           Note we don't need .value inside templates because
  //           refs are automatically "unwrapped" in templates.
  //         -->
  //         <h1>{{ message }}</h1>
        
  //         <!--
  //           Bind to a method/function.
  //           The @click syntax is short for v-on:click.
  //         -->
  //         <button @click="reverseMessage">Reverse Message</button>
        
  //         <!-- Can also be an inline expression statement -->
  //         <button @click="message += '!'">Append "!"</button>
        
  //         <!--
  //           Vue also provides modifiers for common tasks
  //           such as e.preventDefault() and e.stopPropagation()
  //         -->
  //         <a href="https://vuejs.org" @click.prevent="notify">
  //           A link with e.preventDefault()
  //         </a>
  //       </template>
  //     `,
  //   },
  //   expected: {
  //     name: undefined,
  //     description: undefined,
  //     inheritAttrs: true,
  //     keywords: [],
  //     events: [],
  //     methods: [
  //       {
  //         category: undefined,
  //         keywords: [],
  //         kind: 'method',
  //         name: 'reverseMessage',
  //         params: [],
  //         returns: {
  //           description: undefined,
  //           type: 'void',
  //         },
  //         syntax: [
  //           'reverseMessage(): void',
  //         ],
  //         version: undefined,
  //         visibility: 'public',
  //       },
  //       {
  //         category: undefined,
  //         keywords: [],
  //         kind: 'method',
  //         name: 'notify',
  //         params: [],
  //         returns: {
  //           description: undefined,
  //           type: 'void',
  //         },
  //         syntax: [
  //           'notify(): void',
  //         ],
  //         version: undefined,
  //         visibility: 'public',
  //       },
  //     ],
  //     computed: [],
  //     data: [
  //       {
  //         kind: 'data',
  //         name: 'message',
  //         type: 'string',
  //         category: undefined,
  //         version: undefined,
  //         description: undefined,
  //         initialValue: '"Hello World!"',
  //         keywords: [],
  //         visibility: 'public' },
  //     ],
  //     props: [],
  //     slots: [],
  //   },
  // });

  // ComponentTestCase({
  //   name: 'Attribute Bindings',
  //   options: {
  //     filecontent: `
  //       <script>
  //         export default {
  //           data() {
  //             return {
  //               message: 'Hello World!',
  //               isRed: true,
  //               color: 'green'
  //             }
  //           },
  //           methods: {
  //             toggleRed() {
  //               this.isRed = !this.isRed
  //             },
  //             toggleColor() {
  //               this.color = this.color === 'green' ? 'blue' : 'green'
  //             }
  //           }
  //         }
  //       </script>

  //       <template>
  //         <p>
  //           <span :title="message">
  //             Hover your mouse over me for a few seconds to see my dynamically bound title!
  //           </span>
  //         </p>

  //         <!--
  //         class bindings have special support for objects and arrays
  //         in addition to plain strings
  //         -->
  //         <p :class="{ red: isRed }" @click="toggleRed">
  //           This should be red... but click me to toggle it.
  //         </p>

  //         <!-- style bindings also support object and arrays -->
  //         <p :style="{ color }" @click="toggleColor">
  //           This should be green, and should toggle between green and blue on click.
  //         </p>
  //       </template>
  //     `,
  //   },
  //   expected: {
  //     name: undefined,
  //     description: undefined,
  //     inheritAttrs: true,
  //     keywords: [],
  //     events: [],
  //     methods: [],
  //     computed: [],
  //     data: [
  //       {
  //         kind: 'data',
  //         name: 'message',
  //         type: 'string',
  //         category: undefined,
  //         version: undefined,
  //         description: undefined,
  //         initialValue: '"Hello World!"',
  //         keywords: [],
  //         visibility: 'public' },
  //       {
  //         kind: 'data',
  //         name: 'isRed',
  //         type: 'boolean',
  //         category: undefined,
  //         version: undefined,
  //         description: undefined,
  //         initialValue: 'true',
  //         keywords: [],
  //         visibility: 'public' },
  //       {
  //         kind: 'data',
  //         name: 'color',
  //         type: 'string',
  //         category: undefined,
  //         version: undefined,
  //         description: undefined,
  //         initialValue: '"green"',
  //         keywords: [],
  //         visibility: 'public' },
  //     ],
  //     props: [],
  //     slots: [],
  //   },
  // });
  });
});
