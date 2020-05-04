const { ComponentTestCase } = require('./lib/TestUtils')

ComponentTestCase({
  name: '#48 - Vue Instance',
  options: {
    filecontent: `
      <script>
        /**
         * A Vue App Component
         * @version 1.2
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
        name: 'version',
        description: '1.2' }
    ],
    events: [],
    methods: [],
    computed: [],
    data: [
      {
        kind: 'data',
        name: 'url',
        type: 'MemberExpression',
        description: null,
        initial: 'context.url',
        keywords: [],
        visibility: 'public' },
      {
        kind: 'data',
        name: 'contextUrl',
        type: 'MemberExpression',
        description: 'data contextUrl description',
        initial: 'context.url',
        keywords: [],
        visibility: 'public' },
      {
        kind: 'data',
        name: 'contextNumber',
        type: 'number',
        description: 'data contextNumber description',
        initial: 12,
        keywords: [],
        visibility: 'public' }
    ],
    props: [
      {
        default: '__undefined__',
        describeModel: false,
        description: null,
        keywords: [],
        kind: 'prop',
        name: 'todo',
        nativeType: '__undefined__',
        required: false,
        type: 'any',
        visibility: 'public' }
    ],
    slots: [
      {
        description: '',
        keywords: [],
        kind: 'slot',
        name: 'default',
        props: [],
        visibility: 'public' }
    ]
  }
})
