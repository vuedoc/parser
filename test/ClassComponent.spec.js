const { ComponentTestCase } = require('./lib/TestUtils')

/* eslint-disable max-len */
/* eslint-disable indent */

ComponentTestCase({
  name: '#37 - Class Component',
  options: {
    filecontent: `
      <script>
        import Vue from 'vue';
        import Component from 'vue-class-component';

        /**
         * A class component element
         *
         * @author Jon Snow
         */
        @Component({
          inheritAttrs: false,
          props: {
            /**
             * prop name description
             */
            name: String
          }
        })
        class App extends Vue {
          static staticVar = 123;

          static ignoredMethod() {}

          constructor() {
            super(...arguments);

            /**
             * data msg description
             */
            this.msg = 'Hello';

            /**
             * data helloMsg with expression
             */
            this.helloMsg = 'Hello, ' + this.name;

            /**
             * event constructor description
             */
            this.$emit('created')
          }

          // lifecycle hook
          mounted() {
            this.greet();

            /**
             * event mounted description
             */
            this.$emit('mounted')
          }

          /**
           * computed computedMsg description
           */
          get computedMsg() {
            return 'computed ' + this.msg;
          }

          /**
           * computed [Symbol.species] description
           */
          get [Symbol.species]() { return Array; }

          /**
           * method greet description
           */
          greet() {
            alert('greeting: ' + this.msg);
          }

          /**
           * method _protectedMethod description
           * @protected
           */
          _protectedMethod() {}

          /**
           * method _ignoredMethod description
           * @private
           */
          _ignoredMethod() {}
        };

        export default App;
      </script>
    `,
    ignoredVisibilities: [ 'private' ]
  },
  expected: {
    name: 'App',
    description: 'A class component element',
    inheritAttrs: false,
    errors: [],
    keywords: [
      {
        name: 'author',
        description: 'Jon Snow' }
    ],
    events: [
      { kind: 'event',
        name: 'created',
        arguments: [],
        description: 'event constructor description',
        keywords: [],
        visibility: 'public' },
      { kind: 'event',
        name: 'mounted',
        arguments: [],
        description: 'event mounted description',
        keywords: [],
        visibility: 'public' }
    ],
    methods: [
      { kind: 'method',
        name: 'greet',
        params: [],
        description: 'method greet description',
        keywords: [],
        visibility: 'public',
        return: {
          description: '',
          type: 'void'
        } },
      { kind: 'method',
        name: '_protectedMethod',
        params: [],
        description: 'method _protectedMethod description',
        keywords: [
          {
            name: 'protected',
            description: '' }
        ],
        visibility: 'protected',
        return: {
          description: '',
          type: 'void'
        } }
    ],
    computed: [
      { kind: 'computed',
        name: 'computedMsg',
        dependencies: [ 'msg' ],
        description: 'computed computedMsg description',
        keywords: [],
        visibility: 'public' },
      { kind: 'computed',
        name: '[Symbol.species]',
        dependencies: [],
        description: 'computed [Symbol.species] description',
        keywords: [],
        visibility: 'public' }
    ],
    data: [
      {
        kind: 'data',
        name: 'msg',
        type: 'string',
        description: 'data msg description',
        initial: 'Hello',
        keywords: [],
        visibility: 'public' },
      {
        kind: 'data',
        name: 'helloMsg',
        type: 'BinaryExpression',
        description: 'data helloMsg with expression',
        initial: '\'Hello, \' + this.name',
        keywords: [],
        visibility: 'public' }
    ],
    props: [
      { kind: 'prop',
        name: 'name',
        type: 'String',
        nativeType: 'string',
        required: false,
        default: undefined,
        describeModel: false,
        description: 'prop name description',
        keywords: [],
        visibility: 'public' }
    ],
    slots: []
  }
})

ComponentTestCase({
  name: 'vuedoc.md#25 - Class Component',
  options: {
    filecontent: `
      <script>
        import Vue from 'vue';
        import Component from 'vue-class-component';

        /**
         * MyComponent description
         */
        @Component({
          name: 'MyComponent',
          router,
          components: {
            XHeader,
          },
        })
        class App extends Vue {
          data() {
            return {
              routeQueue: [this.$router.currentRoute],
              historyLength: window.history.length,
              transitionName: 'slide-left',
              init: false,
            };
          }
        };

        export default App
      </script>
    `
  },
  expected: {
    name: 'MyComponent',
    description: 'MyComponent description',
    inheritAttrs: true,
    errors: [],
    keywords: [],
    events: [],
    methods: [],
    computed: [],
    data: [
      {
        kind: 'data',
        name: 'routeQueue',
        type: 'ArrayExpression',
        description: '',
        initial: '[this.$router.currentRoute]',
        keywords: [],
        visibility: 'public' },
      {
        kind: 'data',
        name: 'historyLength',
        type: 'object',
        description: '',
        initial: 'window.history.length',
        keywords: [],
        visibility: 'public' },
      {
        kind: 'data',
        name: 'transitionName',
        type: 'string',
        description: '',
        initial: 'slide-left',
        keywords: [],
        visibility: 'public' },
      {
        kind: 'data',
        name: 'init',
        type: 'boolean',
        description: '',
        initial: false,
        keywords: [],
        visibility: 'public' },
    ],
    props: [],
    slots: []
  }
})
