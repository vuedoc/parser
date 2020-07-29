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
        nativeType: 'Number',
        required: false,
        type: 'Number',
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'prop-b',
        describeModel: false,
        description: '',
        keywords: [],
        default: 'default value',
        nativeType: 'string',
        required: false,
        type: 'string',
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'prop-c',
        describeModel: false,
        description: '',
        keywords: [],
        default: undefined,
        nativeType: [ 'String', 'Boolean' ],
        required: false,
        type: [ 'String', 'Boolean' ],
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'prop-d',
        describeModel: false,
        description: '',
        keywords: [],
        default: 'default value',
        nativeType: 'string',
        required: true,
        type: 'string',
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'prop-e',
        describeModel: false,
        description: '',
        keywords: [],
        default: 'default value',
        nativeType: 'String',
        required: false,
        type: 'String',
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'prop-f',
        describeModel: false,
        description: '',
        keywords: [],
        default: 'default value',
        nativeType: 'string',
        required: false,
        type: 'string',
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'name',
        describeModel: false,
        description: '',
        keywords: [],
        default: undefined,
        nativeType: 'String',
        required: false,
        type: 'String',
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'checked',
        describeModel: true,
        description: '',
        keywords: [],
        default: undefined,
        nativeType: 'Boolean',
        required: false,
        type: 'Boolean',
        visibility: 'public' }
    ],
    model: {
      kind: 'model',
      prop: 'checked',
      event: 'change',
      description: '',
      keywords: [],
      visibility: 'public'
    },
    computed: [
      {
        kind: 'computed',
        name: 'syncedName',
        description: '',
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
        arguments: [
          'name'
        ],
        keywords: [],
        visibility: 'public' },
      {
        kind: 'event',
        name: 'add-to-count',
        description: '',
        arguments: [
          {
            name: 'n',
            declaration: '',
            description: '',
            type: 'any'
          }
        ],
        keywords: [],
        visibility: 'public' },
      {
        kind: 'event',
        name: 'reset',
        description: '',
        arguments: [],
        keywords: [],
        visibility: 'public' },
      {
        kind: 'event',
        name: 'return-value',
        description: '',
        arguments: [],
        keywords: [],
        visibility: 'public' },
      {
        kind: 'event',
        name: 'on-input-change',
        description: '',
        arguments: [
          {
            name: 'e',
            declaration: '',
            description: '',
            type: 'any'
          }
        ],
        keywords: [],
        visibility: 'public' },
      {
        kind: 'event',
        name: 'promise',
        description: '',
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
        params: [
          {
            name: 'val',
            type: 'string',
            description: '',
            declaration: '',
            defaultValue: undefined
          },
          {
            name: 'oldVal',
            type: 'string',
            description: '',
            declaration: '',
            defaultValue: undefined
          }
        ],
        return: {
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
        params: [
          {
            name: 'val',
            type: 'Person',
            description: '',
            declaration: '',
            defaultValue: undefined
          },
          {
            name: 'oldVal',
            type: 'Person',
            description: '',
            declaration: '',
            defaultValue: undefined
          }
        ],
        return: {
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
        params: [
          {
            name: 'n',
            type: 'number',
            description: '',
            declaration: '',
            defaultValue: undefined
          }
        ],
        return: {
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
        params: [],
        return: {
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
        params: [],
        return: {
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
        params: [
          {
            name: 'e',
            type: 'any',
            description: '',
            declaration: '',
            defaultValue: undefined
          }
        ],
        return: {
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
        params: [],
        return: {
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
        params: [],
        return: {
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
