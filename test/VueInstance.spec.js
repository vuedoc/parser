const { ComponentTestCase } = require('./lib/TestUtils');

ComponentTestCase({
  name: '#48 - Vue Instance',
  options: {
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
    `
  },
  expected: {
    name: 'App',
    description: 'A Vue App Component',
    inheritAttrs: true,
    keywords: [
      {
        name: 'tagtest',
        description: '1.2' }
    ],
    events: [],
    methods: [],
    computed: [],
    data: [
      {
        kind: 'data',
        name: 'url',
        type: 'object',
        category: undefined,
        version: undefined,
        description: undefined,
        initialValue: 'context.url',
        keywords: [],
        visibility: 'public' },
      {
        kind: 'data',
        name: 'contextUrl',
        type: 'object',
        category: undefined,
        version: undefined,
        description: 'data contextUrl description',
        initialValue: 'context.url',
        keywords: [],
        visibility: 'public' },
      {
        kind: 'data',
        name: 'contextNumber',
        type: 'number',
        category: undefined,
        version: undefined,
        description: 'data contextNumber description',
        initialValue: '12',
        keywords: [],
        visibility: 'public' }
    ],
    props: [
      {
        default: undefined,
        describeModel: false,
        category: undefined,
        version: undefined,
        description: undefined,
        keywords: [],
        kind: 'prop',
        name: 'todo',
        required: false,
        type: 'unknown',
        visibility: 'public' }
    ],
    slots: [
      {
        description: undefined,
        category: undefined,
        version: undefined,
        keywords: [],
        kind: 'slot',
        name: 'default',
        props: [],
        visibility: 'public' }
    ]
  }
});
