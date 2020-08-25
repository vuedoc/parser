const { ComponentTestCase } = require('./lib/TestUtils');

/* global describe */

describe('JSXParser', () => {
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
      `
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
        }
      ],
    }
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
      `
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
        }
      ],
    }
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
      `
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
        }
      ],
    }
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
      `
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
        }
      ],
    }
  });
});
