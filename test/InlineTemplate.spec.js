import { parseComponent } from '../index.js';

/* global describe it expect */
/* eslint-disable max-len */
/* eslint-disable indent */

describe('#44 - Inline Template', () => {
  it('should successfully parse component with inline template', () => {
    const options = {
      filecontent: `
        <script>
          export default Vue.extends({
            template: '<slot>Hello, World!</slot>'
          })
        </script>
      `,
    };

    return parseComponent(options).then(({ slots }) => {
      expect(slots).toEqual([
        {
          kind: 'slot',
          visibility: 'public',
          description: undefined,
          category: undefined,
          keywords: [],
          name: 'default',
          props: [],
        },
      ]);
    });
  });

  it('should successfully parse component with inline litteral template', () => {
    const options = {
      filecontent: `
        <script>
          export default Vue.extends({
            template: \`
              <div>
                <!-- Use this slot to set the content -->
                <slot name="content">Hello, World!</slot>
                <button @click="$emit('input')">Submit</button>
              </div>
            \`
          })
        </script>
      `,
    };

    return parseComponent(options).then((component) => {
      expect(component).toEqual({
        name: undefined,
        inheritAttrs: true,
        description: undefined,
        keywords: [],
        errors: [],
        warnings: [],
        slots:
          [{
              kind: 'slot',
              visibility: 'public',
              description: 'Use this slot to set the content',
              category: undefined,
              version: undefined,
              keywords: [],
              name: 'content',
              props: [] }],
        props: [],
        data: [],
        computed: [],
        events:
          [{
              kind: 'event',
              visibility: 'public',
              description: undefined,
              category: undefined,
              version: undefined,
              keywords: [],
              name: 'input',
              arguments: [] }],
        methods: [],
      });
    });
  });
});
