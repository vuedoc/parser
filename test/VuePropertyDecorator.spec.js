const { ComponentTestCase } = require('./lib/TestUtils')

/* eslint-disable max-len */
/* eslint-disable indent */

ComponentTestCase({
  name: '#47 - Vue Property Decorator',
  options: {
    filecontent: `
      <script>
        var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
            var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
            if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
            else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
            return c > 3 && r && Object.defineProperty(target, key, r), r;
        };
        import { Vue, Component, Prop, Model, Watch, Emit } from 'vue-property-decorator';
        let YourComponent = class YourComponent extends Vue {
            onChildChanged(val, oldVal) { }
            onPersonChanged1(val, oldVal) { }
            addToCount(n) {
                this.count += n;
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
        YourComponent = __decorate([
            Component
        ], YourComponent);
        export default YourComponent;
      </script>
    `
  },
  expected: {
    name: 'YourComponent',
    errors: [],
    props: [
      {
        kind: 'prop',
        name: 'prop-a',
        describeModel: false,
        description: null,
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
        description: null,
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
        description: null,
        keywords: [],
        default: '__undefined__',
        nativeType: '__undefined__',
        required: false,
        type: '[String, Boolean]',
        visibility: 'public' },
      {
        kind: 'prop',
        name: 'checked',
        describeModel: false,
        description: null,
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
      description: null,
      keywords: [],
      visibility: 'public'
    }
  }
})
