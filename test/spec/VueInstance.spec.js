import { describe, expect, it } from 'vitest';

describe('VueInstance', () => {
  it('#48 - Vue Instance', async () => {
    const options = {
      filecontent: `
        <script>
          /**
           * A Vue App Component
           * @tagtest 1.2
           */
          export default new Vue({
            name: 'App',
            props: ['todo'],
            data: {
              url: context.url,
              /**
               * data contextUrl description
               */
              contextUrl: context.url,
              /**
               * data contextNumber description
               */
              contextNumber: 12
            },
            template: \`<slot>The visited URL is: {{ url }}</slot>\`
          })
        </script>
      `,
    };

    await expect(options).toParseAs({
      name: 'App',
      description: 'A Vue App Component',
      inheritAttrs: true,
      keywords: [
        {
          name: 'tagtest',
          description: '1.2',
        },
      ],
      events: [],
      methods: [],
      computed: [],
      data: [
        {
          kind: 'data',
          name: 'url',
          type: 'unknown',
          initialValue: 'context.url',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'data',
          name: 'contextUrl',
          type: 'unknown',
          description: 'data contextUrl description',
          initialValue: 'context.url',
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'data',
          name: 'contextNumber',
          type: 'number',
          description: 'data contextNumber description',
          initialValue: '12',
          keywords: [],
          visibility: 'public',
        },
      ],
      props: [
        {
          describeModel: false,
          keywords: [],
          kind: 'prop',
          name: 'todo',
          required: true,
          type: 'unknown',
          visibility: 'public',
        },
      ],
      slots: [
        {
          keywords: [],
          kind: 'slot',
          name: 'default',
          props: [],
          visibility: 'public',
        },
      ],
    });
  });
});
