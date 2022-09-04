import { describe, expect, it } from 'vitest';

describe('JSXParser', () => {
  it('JSX with no slot', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      keywords: [],
      props: [],
      data: [],
      computed: [],
      events: [],
      methods: [],
      slots: [],
    });
  });

  it('JSX with dynamic content', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      keywords: [],
      props: [],
      data: [],
      computed: [],
      events: [],
      methods: [],
      slots: [],
    });
  });

  it('JSX', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
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
          visibility: 'public',
        },
      ],
    });
  });

  it('JSX #2', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
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
          visibility: 'public',
        },
      ],
    });
  });

  it('JSX #3', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
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
          visibility: 'public',
        },
      ],
    });
  });

  it('JSX #4', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
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
          visibility: 'public',
        },
      ],
    });
  });
});
