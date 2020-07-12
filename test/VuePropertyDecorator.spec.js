const { ComponentTestCase } = require('./lib/TestUtils')

/* eslint-disable max-len */
/* eslint-disable indent */

const script = `
  <script>
    var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
        var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
        if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
        else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
        return c > 3 && r && Object.defineProperty(target, key, r), r;
    };
    import 'reflect-metadata';
    import { Vue, Component, Prop, Model, Watch, Emit } from 'vue-property-decorator';
    /**
     * Component defined with Vue Property Decorator
     */
    let YourComponent = class YourComponent extends Vue {
        /**
         * Component defined with Vue Property Decorator
         */
        constructor() {
            super(...arguments);
            this.count = 0;
        }
        onChildChanged(val, oldVal) { }
        onPersonChanged1(val, oldVal) { }
        addToCount(n) {
            this.count += n;
        }
        resetCount() {
            this.count = 0;
        }
        returnValue() {
            return 10;
        }
        onInputChange(e) {
            return e.target.value;
        }
        promise() {
            return new Promise(resolve => {
                setTimeout(() => {
                    resolve(20);
                }, 0);
            });
        }
    };
    __decorate([
        Prop(Number)
    ], YourComponent.prototype, "propA", void 0);
    __decorate([
        Prop({ default: 'default value' })
    ], YourComponent.prototype, "propB", void 0);
    __decorate([
        Prop([String, Boolean])
    ], YourComponent.prototype, "propC", void 0);
    __decorate([
        PropSync('name', { type: String })
    ], YourComponent.prototype, "syncedName", void 0);
    __decorate([
        Model('change', { type: Boolean })
    ], YourComponent.prototype, "checked", void 0);
    __decorate([
        Watch('child')
    ], YourComponent.prototype, "onChildChanged", null);
    __decorate([
        Watch('person', { immediate: true, deep: true })
    ], YourComponent.prototype, "onPersonChanged1", null);
    __decorate([
        Emit()
    ], YourComponent.prototype, "addToCount", null);
    __decorate([
        Emit('reset')
    ], YourComponent.prototype, "resetCount", null);
    __decorate([
        Emit()
    ], YourComponent.prototype, "returnValue", null);
    __decorate([
        Emit()
    ], YourComponent.prototype, "onInputChange", null);
    __decorate([
        Emit()
    ], YourComponent.prototype, "promise", null);
    YourComponent = __decorate([
        Component
    ], YourComponent);
    export default YourComponent;

  </script>
`

ComponentTestCase({
  name: '#47 - Vue Property Decorator',
  options: {
    filecontent: script
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
        description: '',
        keywords: [],
        default: '__undefined__',
        nativeType: 'number',
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
        type: '__undefined__',
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'prop-c',
        describeModel: false,
        description: '',
        keywords: [],
        default: '__undefined__',
        nativeType: '__undefined__',
        required: false,
        type: [ 'String', 'Boolean' ],
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'name',
        describeModel: false,
        description: '',
        keywords: [],
        default: '__undefined__',
        nativeType: 'string',
        required: false,
        type: 'String',
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'checked',
        describeModel: true,
        description: '',
        keywords: [],
        default: '__undefined__',
        nativeType: 'boolean',
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
    methods: []
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
