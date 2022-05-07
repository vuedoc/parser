import { ComponentTestCase } from './lib/TestUtils';

/* eslint-disable max-len */
/* eslint-disable indent */
/* global describe */

const script = `
  <script>
    import { Vue, Component, Prop, Model, ModelSync, Watch, Emit } from 'vue-property-decorator'

    class MyClass {}

    /**
     * Component defined with Vue Property Decorator
     * @prop propA -
     */
    @Component
    export default class YourComponent extends Vue {
      count = 0

      /**
       * description of propD
       */
      @Prop({ default: 'default value', required: true }) readonly propD!: string
      @Prop({ type: String, default: 'default value', required: false }) readonly propE!: any
      @Prop({ default: 'default value', required: false }) readonly propF!: any

      @Model('change', { type: Boolean }) readonly checked!: boolean
      @ModelSync('checked', 'change', { type: Boolean }) readonly checkedValue!: boolean

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
`;

describe('Vue Property Decorator', () => {
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
          name: 'prop-d',
          describeModel: false,
          description: 'description of propD',
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
          name: 'checked',
          describeModel: true,
          description: undefined,
          keywords: [],
          default: undefined,
          required: false,
          type: 'Boolean',
          category: undefined,
          version: undefined,
          visibility: 'public' },
      ],
      data: [
        {
          kind: 'data',
          name: 'count',
          type: 'number',
          initialValue: '0',
          visibility: 'public',
          description: undefined,
          category: undefined,
          version: undefined,
          keywords: [],
        },
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
          name: 'checkedValue',
          type: 'boolean',
          description: undefined,
          category: undefined,
          version: undefined,
          keywords: [],
          dependencies: [
            'checked'
          ],
          visibility: 'public' }
      ],
      events: [
        {
          kind: 'event',
          name: 'change',
          description: undefined,
          category: undefined,
          version: undefined,
          arguments: [
            {
              name: 'value',
              description: undefined,
              type: 'boolean',
              rest: false
            },
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
              type: 'unknown',
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
              type: 'unknown',
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
          visibility: 'public' },
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
            'onInputChange(e: unknown): void'
          ],
          params: [
            {
              name: 'e',
              type: 'unknown',
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
  });

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
  });

  ComponentTestCase({
    name: '@Model(event?: string, options: (PropOptions | Constructor[] | Constructor) = {}) decorator',
    options: {
      filecontent: `
        <script type="ts">
          import { Vue, Component, Model } from 'vue-property-decorator'

          @Component
          export default class YourComponent extends Vue {
            @Model('change', { type: Boolean }) readonly checked!: boolean
          }
        </script>
      `
    },
    expected: {
      name: 'YourComponent',
      description: undefined,
      errors: [],
      warnings: [],
      props: [
        {
          category: undefined,
          default: undefined,
          describeModel: true,
          keywords: [],
          kind: 'prop',
          name: 'checked',
          required: false,
          type: 'Boolean',
          version: undefined,
          visibility: 'public' },
      ],
      data: [],
      model: {
        kind: 'model',
        prop: 'checked',
        event: 'change',
        description: undefined,
        keywords: []
      },
      computed: [],
      events: [],
      methods: [],
    }
  });

  ComponentTestCase({
    name: '@ModelSync(propName: string, event?: string, options: (PropOptions | Constructor[] | Constructor) = {}) decorator',
    options: {
      filecontent: `
        <script type="ts">
          import { Vue, Component, ModelSync } from 'vue-property-decorator'

          @Component
          export default class YourComponent extends Vue {
            @ModelSync('checked', 'change', { type: Boolean })
            readonly checkedValue!: boolean
          }
        </script>
      `
    },
    expected: {
      name: 'YourComponent',
      description: undefined,
      errors: [],
      warnings: [],
      props: [
        {
          category: undefined,
          default: undefined,
          describeModel: true,
          keywords: [],
          kind: 'prop',
          name: 'checked',
          required: false,
          type: 'Boolean',
          version: undefined,
          visibility: 'public' },
      ],
      data: [],
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
          name: 'checkedValue',
          type: 'boolean',
          description: undefined,
          category: undefined,
          version: undefined,
          keywords: [],
          dependencies: [
            'checked'
          ],
          visibility: 'public' }
      ],
      events: [
        {
          kind: 'event',
          name: 'change',
          description: undefined,
          category: undefined,
          version: undefined,
          arguments: [
            {
              name: 'value',
              description: undefined,
              type: 'boolean',
              rest: false
            }
          ],
          keywords: [],
          visibility: 'public' },
      ],
      methods: [],
    }
  });

  ComponentTestCase({
    name: '@VModel(propsArgs?: PropOptions) decorator',
    options: {
      filecontent: `
        <script type="ts">
          import { Vue, Component, VModel } from 'vue-property-decorator'

          @Component
          export default class YourComponent extends Vue {
            @VModel({ type: String }) name!: string
          }
        </script>
      `
    },
    expected: {
      name: 'YourComponent',
      description: undefined,
      errors: [],
      warnings: [],
      props: [
        {
          category: undefined,
          default: undefined,
          describeModel: true,
          keywords: [],
          kind: 'prop',
          name: 'value',
          required: false,
          type: 'String',
          version: undefined,
          visibility: 'public' },
      ],
      data: [],
      model: {
        kind: 'model',
        prop: 'value',
        event: 'input',
        description: undefined,
        keywords: []
      },
      computed: [
        {
          kind: 'computed',
          name: 'name',
          type: 'string',
          description: undefined,
          category: undefined,
          version: undefined,
          keywords: [],
          dependencies: [
            'value'
          ],
          visibility: 'public' }
      ],
      events: [
        {
          kind: 'event',
          name: 'input',
          description: undefined,
          category: undefined,
          version: undefined,
          arguments: [
            {
              name: 'value',
              description: undefined,
              type: 'string',
              rest: false
            }
          ],
          keywords: [],
          visibility: 'public' },
      ],
      methods: [],
    }
  });

  ComponentTestCase({
    name: '@Ref(refKey?: string) decorator',
    options: {
      filecontent: `
        <script type="ts">
          import { Vue, Component, Ref } from 'vue-property-decorator'

          import AnotherComponent from '@/path/to/another-component.vue'

          @Component
          export default class YourComponent extends Vue {
            @Ref() readonly anotherComponent!: AnotherComponent
            @Ref('aButton') readonly button!: HTMLButtonElement
          }
        </script>
      `
    },
    expected: {
      name: 'YourComponent',
      description: undefined,
      errors: [],
      warnings: [],
      props: [],
      data: [
        {
          kind: 'data',
          name: 'anotherComponent',
          type: 'AnotherComponent',
          visibility: 'public',
          initialValue: 'null',
          description: undefined,
          category: undefined,
          version: undefined,
          keywords: [],
        },
        {
          kind: 'data',
          name: 'button',
          type: 'HTMLButtonElement',
          visibility: 'public',
          initialValue: 'null',
          description: undefined,
          category: undefined,
          version: undefined,
          keywords: [],
        },
      ],
      model: undefined,
      computed: [],
      events: [],
      methods: [],
    }
  });

  ComponentTestCase({
    name: '@Prop(options: (PropOptions | Constructor[] | Constructor) = {}) decorator',
    options: {
      filecontent: `
        <script type="ts">
          import { Vue, Component, Prop } from 'vue-property-decorator'

          @Component
          export default class YourComponent extends Vue {
            @Prop(Number) readonly propA: number | undefined
            @Prop({ default: 'default value' }) readonly propB!: string
            @Prop([String, Boolean]) readonly propC: string | boolean | undefined
          }
        </script>
      `
    },
    expected: {
      name: 'YourComponent',
      description: undefined,
      errors: [],
      warnings: [],
      props: [
        {
          kind: 'prop',
          name: 'prop-a',
          describeModel: false,
          description: undefined,
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
      ],
      data: [],
      model: undefined,
      computed: [],
      events: [],
      methods: [],
    }
  });

  ComponentTestCase({
    name: '@Prop(options: (PropOptions | Constructor[] | Constructor) = {}) decorator with reflect-metadata',
    options: {
      filecontent: `
        <script type="ts">
          import 'reflect-metadata'
          import { Vue, Component, Prop } from 'vue-property-decorator'

          @Component
          export default class MyComponent extends Vue {
            @Prop() age!: number
          }
        </script>
      `
    },
    expected: {
      name: 'MyComponent',
      description: undefined,
      errors: [],
      warnings: [],
      props: [
        {
          kind: 'prop',
          name: 'age',
          describeModel: false,
          description: undefined,
          keywords: [],
          default: undefined,
          required: false,
          type: 'number',
          category: undefined,
          version: undefined,
          visibility: 'public' },
      ],
      data: [],
      model: undefined,
      computed: [],
      events: [],
      methods: [],
    }
  });

  ComponentTestCase({
    name: '@PropSync(propName: string, options: (PropOptions | Constructor[] | Constructor) = {}) decorator',
    options: {
      filecontent: `
        <script type="ts">
          import { Vue, Component, PropSync } from 'vue-property-decorator'

          @Component
          export default class YourComponent extends Vue {
            @PropSync('name', { type: String }) syncedName!: string
          }
        </script>
      `
    },
    expected: {
      name: 'YourComponent',
      description: undefined,
      errors: [],
      warnings: [],
      props: [
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
      ],
      data: [],
      model: undefined,
      computed: [
        {
          kind: 'computed',
          name: 'syncedName',
          type: 'string',
          description: undefined,
          category: undefined,
          version: undefined,
          keywords: [],
          dependencies: [
            'name'
          ],
          visibility: 'public' },
        ],
      events: [
        {
          kind: 'event',
          name: 'update:name',
          description: undefined,
          category: undefined,
          version: undefined,
          arguments: [
            {
              name: 'name',
              description: undefined,
              type: 'string',
              rest: false
            }
          ],
          keywords: [],
          visibility: 'public' },
        ],
      methods: [],
    }
  });

  ComponentTestCase({
    name: '#92 - Multiline type',
    options: {
      filecontent: `
        <script lang='ts'>
          import { Vue, Component, Prop } from 'vue-property-decorator';
          import { Observer } from 'mobx-vue';
          import { IContextMenuItem } from '../../contextmenus/IContextMenuItem';

          @Observer
          @Component
          export default class SelectableList extends Vue {
            // private get context(): void {}
            @Prop({ default: () => [] }) public contextFactory!: (selectedItemsData: Array<any>) => Array<any>;

            @Prop({ default: () => [] }) public menuFactory!: (
              selectedItemsData: Array<any>
            ) => Array<IContextMenuItem<any>>;
          }
        </script>
      `
    },
    expected: {
      errors: [],
      warnings: [],
      name: 'SelectableList',
      props: [
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          version: undefined,
          description: 'private get context(): void {}',
          keywords: [],
          type: '(selectedItemsData: Array<any>) => Array<any>',
          default: undefined,
          name: 'context-factory',
          describeModel: false,
          required: false
        },
        {
          kind: 'prop',
          visibility: 'public',
          category: undefined,
          version: undefined,
          description: undefined,
          keywords: [],
          type: '(selectedItemsData: Array<any>) => Array<IContextMenuItem<any>>',
          default: undefined,
          name: 'menu-factory',
          describeModel: false,
          required: false
        },
      ]
    }
  });
});
