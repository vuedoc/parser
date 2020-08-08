const { ComponentTestCase } = require('./lib/TestUtils')

/* eslint-disable max-len */
/* eslint-disable indent */

const script = `
  <script>
  import { Vue, Component, Prop, Model, Watch, Emit } from 'vue-property-decorator'

  class MyClass {}

  /**
   * Component defined with Vue Property Decorator
   * @prop propA -
   */
  @Component
  export default class YourComponent extends Vue {
    count = 0

    /**
     * description of propA
     */
    @Prop(Number) readonly propA!: number
    @Prop({ default: 'default value' }) readonly propB!: string
    @Prop([String, Boolean]) readonly propC!: string | boolean
    @Prop({ default: 'default value', required: true }) readonly propD!: string
    @Prop({ type: String, default: 'default value', required: false }) readonly propE!: any
    @Prop({ default: 'default value', required: false }) readonly propF!: any
    @PropSync('name', { type: String }) syncedName!: string

    @Model('change', { type: Boolean }) readonly checked!: boolean

    @Watch('child')
    onChildChanged(val: string, oldVal: string) { }

    @Watch('person', { immediate: true, deep: true })
    onPersonChanged1(val: Person, oldVal: Person) { }

    @Emit()
    addToCount(n: number) {
      this.count += n
    }

    @Emit('reset')
    resetCount() {
      this.count = 0
    }

    @Emit()
    returnValue() {
      return 10
    }

    @Emit()
    onInputChange(e) {
      return e.target.value
    }

    @Emit()
    promise() {
      return new Promise(resolve => {
        setTimeout(() => {
          resolve(20)
        }, 0)
      })
    }

    #privateMethod() {}
  }
  </script>
`

ComponentTestCase({
  name: '#47 - Vue Property Decorator',
  options: {
    filecontent: script,
    ignoredVisibilities: []
  },
  expected: {
    name: 'YourComponent',
    description: 'Component defined with Vue Property Decorator',
    errors: [],
    props: [
      {
        kind: 'prop',
        name: 'prop-a',
        describeModel: false,
        description: 'description of propA',
        keywords: [],
        default: undefined,
        required: false,
        type: 'Number',
        category: null,
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'prop-b',
        describeModel: false,
        description: '',
        keywords: [],
        default: 'default value',
        required: false,
        type: 'string',
        category: null,
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'prop-c',
        describeModel: false,
        description: '',
        keywords: [],
        default: undefined,
        required: false,
        type: [ 'String', 'Boolean' ],
        category: null,
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'prop-d',
        describeModel: false,
        description: '',
        keywords: [],
        default: 'default value',
        required: true,
        type: 'string',
        category: null,
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'prop-e',
        describeModel: false,
        description: '',
        keywords: [],
        default: 'default value',
        required: false,
        type: 'String',
        category: null,
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'prop-f',
        describeModel: false,
        description: '',
        keywords: [],
        default: 'default value',
        required: false,
        type: 'string',
        category: null,
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'name',
        describeModel: false,
        description: '',
        keywords: [],
        default: undefined,
        required: false,
        type: 'String',
        category: null,
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'checked',
        describeModel: true,
        description: '',
        keywords: [],
        default: undefined,
        required: false,
        type: 'Boolean',
        category: null,
        visibility: 'public' }
    ],
    model: {
      kind: 'model',
      prop: 'checked',
      event: 'change',
      description: '',
      keywords: []
    },
    computed: [
      {
        kind: 'computed',
        name: 'syncedName',
        description: '',
        category: null,
        keywords: [],
        dependencies: [
          'name'
        ],
        visibility: 'public' }
    ],
    events: [
      {
        kind: 'event',
        name: 'update:name',
        description: '',
        category: null,
        arguments: [
          'name'
        ],
        keywords: [],
        visibility: 'public' },
      {
        kind: 'event',
        name: 'add-to-count',
        description: '',
        category: null,
        arguments: [
          {
            name: 'n',
            description: '',
            type: 'any',
            rest: false
          }
        ],
        keywords: [],
        visibility: 'public' },
      {
        kind: 'event',
        name: 'reset',
        description: '',
        category: null,
        arguments: [],
        keywords: [],
        visibility: 'public' },
      {
        kind: 'event',
        name: 'return-value',
        description: '',
        category: null,
        arguments: [],
        keywords: [],
        visibility: 'public' },
      {
        kind: 'event',
        name: 'on-input-change',
        description: '',
        category: null,
        arguments: [
          {
            name: 'e',
            description: '',
            type: 'any',
            rest: false
          }
        ],
        keywords: [],
        visibility: 'public' },
      {
        kind: 'event',
        name: 'promise',
        description: '',
        category: null,
        arguments: [],
        keywords: [],
        visibility: 'public' }
    ],
    methods: [
      {
        description: '',
        keywords: [],
        kind: 'method',
        name: 'onChildChanged',
        category: null,
        syntax: [
          'onChildChanged(val: string, oldVal: string): void'
        ],
        params: [
          {
            name: 'val',
            type: 'string',
            description: '',
            defaultValue: undefined,
            rest: false
          },
          {
            name: 'oldVal',
            type: 'string',
            description: '',
            defaultValue: undefined,
            rest: false
          }
        ],
        returns: {
          description: '',
          type: 'void',
        },
        visibility: 'public',
      },
      {
        description: '',
        keywords: [],
        kind: 'method',
        name: 'onPersonChanged1',
        category: null,
        syntax: [
          'onPersonChanged1(val: Person, oldVal: Person): void'
        ],
        params: [
          {
            name: 'val',
            type: 'Person',
            description: '',
            defaultValue: undefined,
            rest: false
          },
          {
            name: 'oldVal',
            type: 'Person',
            description: '',
            defaultValue: undefined,
            rest: false
          }
        ],
        returns: {
          description: '',
          type: 'void',
        },
        visibility: 'public',
      },
      {
        description: '',
        keywords: [],
        kind: 'method',
        name: 'addToCount',
        category: null,
        syntax: [
          'addToCount(n: number): void'
        ],
        params: [
          {
            name: 'n',
            type: 'number',
            description: '',
            defaultValue: undefined,
            rest: false
          }
        ],
        returns: {
          description: '',
          type: 'void',
        },
        visibility: 'public',
      },
      {
        description: '',
        keywords: [],
        kind: 'method',
        name: 'resetCount',
        category: null,
        syntax: [
          'resetCount(): void'
        ],
        params: [],
        returns: {
          description: '',
          type: 'void',
        },
        visibility: 'public',
      },
      {
        description: '',
        keywords: [],
        kind: 'method',
        name: 'returnValue',
        category: null,
        syntax: [
          'returnValue(): void'
        ],
        params: [],
        returns: {
          description: '',
          type: 'void',
        },
        visibility: 'public',
      },
      {
        description: '',
        keywords: [],
        kind: 'method',
        name: 'onInputChange',
        category: null,
        syntax: [
          'onInputChange(e: unknow): void'
        ],
        params: [
          {
            name: 'e',
            type: 'unknow',
            description: '',
            defaultValue: undefined,
            rest: false
          }
        ],
        returns: {
          description: '',
          type: 'void',
        },
        visibility: 'public',
      },
      {
        description: '',
        keywords: [],
        kind: 'method',
        name: 'promise',
        category: null,
        syntax: [
          'promise(): void'
        ],
        params: [],
        returns: {
          description: '',
          type: 'void',
        },
        visibility: 'public',
      },
      {
        description: '',
        keywords: [],
        kind: 'method',
        name: 'privateMethod',
        category: null,
        syntax: [
          'privateMethod(): void'
        ],
        params: [],
        returns: {
          description: '',
          type: 'void',
        },
        visibility: 'private',
      }
    ]
  }
})

ComponentTestCase({
  name: '#47 - Vue Property Decorator with disabled features',
  options: {
    features: [ 'name' ],
    filecontent: script
  },
  expected: {
    name: 'YourComponent',
    description: undefined,
    errors: [],
    props: undefined,
    model: undefined,
    computed: undefined,
    events: undefined,
    methods: undefined
  }
})
