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
        category: undefined,
        version: undefined,
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'prop-b',
        describeModel: false,
        description: undefined,
        keywords: [],
        default: 'default value',
        required: false,
        type: 'string',
        category: undefined,
        version: undefined,
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'prop-c',
        describeModel: false,
        description: undefined,
        keywords: [],
        default: undefined,
        required: false,
        type: [ 'String', 'Boolean' ],
        category: undefined,
        version: undefined,
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'prop-d',
        describeModel: false,
        description: undefined,
        keywords: [],
        default: 'default value',
        required: true,
        type: 'string',
        category: undefined,
        version: undefined,
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'prop-e',
        describeModel: false,
        description: undefined,
        keywords: [],
        default: 'default value',
        required: false,
        type: 'String',
        category: undefined,
        version: undefined,
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'prop-f',
        describeModel: false,
        description: undefined,
        keywords: [],
        default: 'default value',
        required: false,
        type: 'string',
        category: undefined,
        version: undefined,
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'name',
        describeModel: false,
        description: undefined,
        keywords: [],
        default: undefined,
        required: false,
        type: 'String',
        category: undefined,
        version: undefined,
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'checked',
        describeModel: true,
        description: undefined,
        keywords: [],
        default: undefined,
        required: false,
        type: 'Boolean',
        category: undefined,
        version: undefined,
        visibility: 'public' }
    ],
    model: {
      kind: 'model',
      prop: 'checked',
      event: 'change',
      description: undefined,
      keywords: []
    },
    computed: [
      {
        kind: 'computed',
        name: 'syncedName',
        description: undefined,
        category: undefined,
        version: undefined,
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
        description: undefined,
        category: undefined,
        version: undefined,
        arguments: [
          'name'
        ],
        keywords: [],
        visibility: 'public' },
      {
        kind: 'event',
        name: 'add-to-count',
        description: undefined,
        category: undefined,
        version: undefined,
        arguments: [
          {
            name: 'n',
            description: undefined,
            type: 'any',
            rest: false
          }
        ],
        keywords: [],
        visibility: 'public' },
      {
        kind: 'event',
        name: 'reset',
        description: undefined,
        category: undefined,
        version: undefined,
        arguments: [],
        keywords: [],
        visibility: 'public' },
      {
        kind: 'event',
        name: 'return-value',
        description: undefined,
        category: undefined,
        version: undefined,
        arguments: [],
        keywords: [],
        visibility: 'public' },
      {
        kind: 'event',
        name: 'on-input-change',
        description: undefined,
        category: undefined,
        version: undefined,
        arguments: [
          {
            name: 'e',
            description: undefined,
            type: 'any',
            rest: false
          }
        ],
        keywords: [],
        visibility: 'public' },
      {
        kind: 'event',
        name: 'promise',
        description: undefined,
        category: undefined,
        version: undefined,
        arguments: [],
        keywords: [],
        visibility: 'public' }
    ],
    methods: [
      {
        description: undefined,
        keywords: [],
        kind: 'method',
        name: 'onChildChanged',
        category: undefined,
        version: undefined,
        syntax: [
          'onChildChanged(val: string, oldVal: string): void'
        ],
        params: [
          {
            name: 'val',
            type: 'string',
            description: undefined,
            defaultValue: undefined,
            rest: false
          },
          {
            name: 'oldVal',
            type: 'string',
            description: undefined,
            defaultValue: undefined,
            rest: false
          }
        ],
        returns: {
          description: undefined,
          type: 'void',
        },
        visibility: 'public',
      },
      {
        description: undefined,
        keywords: [],
        kind: 'method',
        name: 'onPersonChanged1',
        category: undefined,
        version: undefined,
        syntax: [
          'onPersonChanged1(val: Person, oldVal: Person): void'
        ],
        params: [
          {
            name: 'val',
            type: 'Person',
            description: undefined,
            defaultValue: undefined,
            rest: false
          },
          {
            name: 'oldVal',
            type: 'Person',
            description: undefined,
            defaultValue: undefined,
            rest: false
          }
        ],
        returns: {
          description: undefined,
          type: 'void',
        },
        visibility: 'public',
      },
      {
        description: undefined,
        keywords: [],
        kind: 'method',
        name: 'addToCount',
        category: undefined,
        version: undefined,
        syntax: [
          'addToCount(n: number): void'
        ],
        params: [
          {
            name: 'n',
            type: 'number',
            description: undefined,
            defaultValue: undefined,
            rest: false
          }
        ],
        returns: {
          description: undefined,
          type: 'void',
        },
        visibility: 'public',
      },
      {
        description: undefined,
        keywords: [],
        kind: 'method',
        name: 'resetCount',
        category: undefined,
        version: undefined,
        syntax: [
          'resetCount(): void'
        ],
        params: [],
        returns: {
          description: undefined,
          type: 'void',
        },
        visibility: 'public',
      },
      {
        description: undefined,
        keywords: [],
        kind: 'method',
        name: 'returnValue',
        category: undefined,
        version: undefined,
        syntax: [
          'returnValue(): void'
        ],
        params: [],
        returns: {
          description: undefined,
          type: 'void',
        },
        visibility: 'public',
      },
      {
        description: undefined,
        keywords: [],
        kind: 'method',
        name: 'onInputChange',
        category: undefined,
        version: undefined,
        syntax: [
          'onInputChange(e: unknow): void'
        ],
        params: [
          {
            name: 'e',
            type: 'unknow',
            description: undefined,
            defaultValue: undefined,
            rest: false
          }
        ],
        returns: {
          description: undefined,
          type: 'void',
        },
        visibility: 'public',
      },
      {
        description: undefined,
        keywords: [],
        kind: 'method',
        name: 'promise',
        category: undefined,
        version: undefined,
        syntax: [
          'promise(): void'
        ],
        params: [],
        returns: {
          description: undefined,
          type: 'void',
        },
        visibility: 'public',
      },
      {
        description: undefined,
        keywords: [],
        kind: 'method',
        name: 'privateMethod',
        category: undefined,
        version: undefined,
        syntax: [
          'privateMethod(): void'
        ],
        params: [],
        returns: {
          description: undefined,
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
