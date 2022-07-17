import { ComponentTestCase } from '../lib/TestUtils.js';
import { describe } from '@jest/globals';

describe('JSXParser', () => {
  ComponentTestCase({
    name: 'JSX with no slot',
    options: {
      jsx: true,
      filecontent: `
        <script type="ts">
          export default new Vue({
            el: '#demo',
            render() {
              return <p>hello</p>
            }
          })
        </script>
      `,
    },
    expected: {
      errors: [],
      keywords: [],
      props: [],
      data: [],
      computed: [],
      events: [],
      methods: [],
      slots: [],
    },
  });

  ComponentTestCase({
    name: 'JSX with dynamic content',
    options: {
      jsx: true,
      filecontent: `
        <script type="ts">
          export default new Vue({
            el: '#demo',
            render() {
              return <p>hello { this.message }</p>
            }
          })
        </script>
      `,
    },
    expected: {
      errors: [],
      keywords: [],
      props: [],
      data: [],
      computed: [],
      events: [],
      methods: [],
      slots: [],
    },
  });

  ComponentTestCase({
    name: 'JSX',
    options: {
      jsx: true,
      filecontent: `
        <script type="ts">
          import AnchoredHeading from './AnchoredHeading.vue'

          export default new Vue({
            el: '#demo',
            render: function (h) {
              return (
                <AnchoredHeading level={1}>
                  <span>Hello</span> world!
                  <slot/>
                </AnchoredHeading>
              )
            }
          })
        </script>
      `,
    },
    expected: {
      errors: [],
      keywords: [],
      props: [],
      data: [],
      computed: [],
      events: [],
      methods: [],
      slots: [
        {
          kind: 'slot',
          name: 'default',
          props: [],
          keywords: [],
          version: undefined,
          category: undefined,
          description: undefined,
          visibility: 'public',
        },
      ],
    },
  });

  ComponentTestCase({
    name: 'JSX #2',
    options: {
      jsx: true,
      filecontent: `
        <script type="ts">
          import AnchoredHeading from './AnchoredHeading.vue'

          export default new Vue({
            el: '#demo',
            render(h) {
              return (
                <AnchoredHeading level={1}>
                  <span>Hello</span> world!
                  <slot/>
                </AnchoredHeading>
              )
            }
          })
        </script>
      `,
    },
    expected: {
      errors: [],
      keywords: [],
      props: [],
      data: [],
      computed: [],
      events: [],
      methods: [],
      slots: [
        {
          kind: 'slot',
          name: 'default',
          props: [],
          keywords: [],
          version: undefined,
          category: undefined,
          description: undefined,
          visibility: 'public',
        },
      ],
    },
  });

  ComponentTestCase({
    name: 'JSX #3',
    options: {
      jsx: true,
      filecontent: `
        <script type="ts">
          import AnchoredHeading from './AnchoredHeading.vue'

          export default new Vue({
            el: '#demo',
            render: (h) => {
              return (
                <AnchoredHeading level={1}>
                  <span>Hello</span> world!
                  <slot/>
                </AnchoredHeading>
              )
            }
          })
        </script>
      `,
    },
    expected: {
      errors: [],
      keywords: [],
      props: [],
      data: [],
      computed: [],
      events: [],
      methods: [],
      slots: [
        {
          kind: 'slot',
          name: 'default',
          props: [],
          keywords: [],
          version: undefined,
          category: undefined,
          description: undefined,
          visibility: 'public',
        },
      ],
    },
  });

  ComponentTestCase({
    name: 'JSX #4',
    options: {
      jsx: true,
      filecontent: `
        <script type="ts">
          import AnchoredHeading from './AnchoredHeading.vue'

          export default new Vue({
            el: '#demo',
            render: (h) => (
              <AnchoredHeading level={1}>
                <span>Hello</span> world!
                <slot/>
              </AnchoredHeading>
            )
          })
        </script>
      `,
    },
    expected: {
      errors: [],
      keywords: [],
      props: [],
      data: [],
      computed: [],
      events: [],
      methods: [],
      slots: [
        {
          kind: 'slot',
          name: 'default',
          props: [],
          keywords: [],
          version: undefined,
          category: undefined,
          description: undefined,
          visibility: 'public',
        },
      ],
    },
  });
});
