import { describe, expect, it } from 'vitest';

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

describe('VuePropertyDecorator', () => {
  it('#47 - Vue Property Decorator', async () => {
    const options = {
      filecontent: script,
      ignoredVisibilities: [],
    };

    await expect(options).toParseAs({
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
          default: '"default value"',
          required: true,
          type: 'string',
          visibility: 'public',
        },
        {
          kind: 'prop',
          name: 'prop-e',
          describeModel: false,
          keywords: [],
          default: '"default value"',
          required: false,
          type: 'string',
          visibility: 'public',
        },
        {
          kind: 'prop',
          name: 'prop-f',
          describeModel: false,
          keywords: [],
          default: '"default value"',
          required: false,
          type: 'string',
          visibility: 'public',
        },
        {
          kind: 'prop',
          name: 'v-model',
          describeModel: true,
          keywords: [],
          required: false,
          type: 'boolean',
          visibility: 'public',
        },
      ],
      data: [
        {
          kind: 'data',
          name: 'count',
          type: 'number',
          initialValue: '0',
          visibility: 'public',
          keywords: [],
        },
      ],
      computed: [
        {
          kind: 'computed',
          name: 'checkedValue',
          type: 'boolean',
          keywords: [],
          dependencies: [
            'checked',
          ],
          visibility: 'public',
        },
      ],
      events: [
        {
          kind: 'event',
          name: 'change',
          arguments: [
            {
              name: 'value',
              type: 'boolean',
              rest: false,
            },
          ],
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'event',
          name: 'add-to-count',
          arguments: [
            {
              name: 'n',
              type: 'unknown',
              rest: false,
            },
          ],
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'event',
          name: 'reset',
          arguments: [],
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'event',
          name: 'return-value',
          arguments: [],
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'event',
          name: 'on-input-change',
          arguments: [
            {
              name: 'e',
              type: 'unknown',
              rest: false,
            },
          ],
          keywords: [],
          visibility: 'public',
        },
        {
          kind: 'event',
          name: 'promise',
          arguments: [],
          keywords: [],
          visibility: 'public',
        },
      ],
      methods: [
        {
          keywords: [],
          kind: 'method',
          name: 'onChildChanged',
          syntax: [
            'onChildChanged(val: string, oldVal: string): void',
          ],
          params: [
            {
              name: 'val',
              type: 'string',
              rest: false,
            },
            {
              name: 'oldVal',
              type: 'string',
              rest: false,
            },
          ],
          returns: {
            type: 'void',
          },
          visibility: 'public',
        },
        {
          keywords: [],
          kind: 'method',
          name: 'onPersonChanged1',
          syntax: [
            'onPersonChanged1(val: Person, oldVal: Person): void',
          ],
          params: [
            {
              name: 'val',
              type: 'Person',
              rest: false,
            },
            {
              name: 'oldVal',
              type: 'Person',
              rest: false,
            },
          ],
          returns: {
            type: 'void',
          },
          visibility: 'public',
        },
        {
          keywords: [],
          kind: 'method',
          name: 'addToCount',
          syntax: [
            'addToCount(n: number): void',
          ],
          params: [
            {
              name: 'n',
              type: 'number',
              rest: false,
            },
          ],
          returns: {
            type: 'void',
          },
          visibility: 'public',
        },
        {
          keywords: [],
          kind: 'method',
          name: 'resetCount',
          syntax: [
            'resetCount(): void',
          ],
          params: [],
          returns: {
            type: 'void',
          },
          visibility: 'public',
        },
        {
          keywords: [],
          kind: 'method',
          name: 'returnValue',
          syntax: [
            'returnValue(): number',
          ],
          params: [],
          returns: {
            type: 'number',
          },
          visibility: 'public',
        },
        {
          keywords: [],
          kind: 'method',
          name: 'onInputChange',
          syntax: [
            'onInputChange(e: unknown): unknown',
          ],
          params: [
            {
              name: 'e',
              type: 'unknown',
              rest: false,
            },
          ],
          returns: {
            type: 'unknown',
          },
          visibility: 'public',
        },
        {
          keywords: [],
          kind: 'method',
          name: 'promise',
          syntax: [
            'promise(): Promise',
          ],
          params: [],
          returns: {
            type: 'Promise',
          },
          visibility: 'public',
        },
        {
          keywords: [],
          kind: 'method',
          name: 'privateMethod',
          syntax: [
            'privateMethod(): void',
          ],
          params: [],
          returns: {
            type: 'void',
          },
          visibility: 'private',
        },
      ],
    });
  });

  it('#47 - Vue Property Decorator with disabled features', async () => {
    const options = {
      features: [
        'name',
      ],
      filecontent: `
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
      `,
    };

    await expect(options).toParseAs({
      name: 'YourComponent',
      errors: [],
      props: [],
    });
  });

  it('@Model(event?: string, options: (PropOptions | Constructor[] | Constructor) = {}) decorator', async () => {
    const options = {
      filecontent: `
          <script type="ts">
            import { Vue, Component, Model } from 'vue-property-decorator'
  
            @Component
            export default class YourComponent extends Vue {
              @Model('change', { type: Boolean }) readonly checked!: boolean
            }
          </script>
        `,
    };

    await expect(options).toParseAs({
      name: 'YourComponent',
      errors: [],
      warnings: [],
      props: [
        {
          describeModel: true,
          keywords: [],
          kind: 'prop',
          name: 'v-model',
          required: false,
          type: 'boolean',
          visibility: 'public',
        },
      ],
      data: [],
      computed: [],
      events: [],
      methods: [],
    });
  });

  it('@ModelSync(propName: string, event?: string, options: (PropOptions | Constructor[] | Constructor) = {}) decorator', async () => {
    const options = {
      filecontent: `
          <script type="ts">
            import { Vue, Component, ModelSync } from 'vue-property-decorator'
  
            @Component
            export default class YourComponent extends Vue {
              @ModelSync('checked', 'change', { type: Boolean })
              readonly checkedValue!: boolean
            }
          </script>
        `,
    };

    await expect(options).toParseAs({
      name: 'YourComponent',
      errors: [],
      warnings: [],
      props: [
        {
          describeModel: true,
          keywords: [],
          kind: 'prop',
          name: 'v-model',
          required: false,
          type: 'boolean',
          visibility: 'public',
        },
      ],
      data: [],
      computed: [
        {
          kind: 'computed',
          name: 'checkedValue',
          type: 'boolean',
          keywords: [],
          dependencies: [
            'checked',
          ],
          visibility: 'public',
        },
      ],
      events: [
        {
          kind: 'event',
          name: 'change',
          arguments: [
            {
              name: 'value',
              type: 'boolean',
              rest: false,
            },
          ],
          keywords: [],
          visibility: 'public',
        },
      ],
      methods: [],
    });
  });

  it('@VModel(propsArgs?: PropOptions) decorator', async () => {
    const options = {
      filecontent: `
          <script type="ts">
            import { Vue, Component, VModel } from 'vue-property-decorator'
  
            @Component
            export default class YourComponent extends Vue {
              @VModel({ type: String }) name!: string
            }
          </script>
        `,
    };

    await expect(options).toParseAs({
      name: 'YourComponent',
      errors: [],
      warnings: [],
      props: [
        {
          describeModel: true,
          keywords: [],
          kind: 'prop',
          name: 'v-model',
          required: false,
          type: 'string',
          visibility: 'public',
        },
      ],
      data: [],
      computed: [
        {
          kind: 'computed',
          name: 'name',
          type: 'string',
          keywords: [],
          dependencies: [
            'value',
          ],
          visibility: 'public',
        },
      ],
      events: [
        {
          kind: 'event',
          name: 'input',
          arguments: [
            {
              name: 'value',
              type: 'string',
              rest: false,
            },
          ],
          keywords: [],
          visibility: 'public',
        },
      ],
      methods: [],
    });
  });

  it('@Ref(refKey?: string) decorator', async () => {
    const options = {
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
        `,
    };

    await expect(options).toParseAs({
      name: 'YourComponent',
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
          keywords: [],
        },
        {
          kind: 'data',
          name: 'button',
          type: 'HTMLButtonElement',
          visibility: 'public',
          initialValue: 'null',
          keywords: [],
        },
      ],
      computed: [],
      events: [],
      methods: [],
    });
  });

  it('@Prop(options: (PropOptions | Constructor[] | Constructor) = {}) decorator', async () => {
    const options = {
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
        `,
    };

    await expect(options).toParseAs({
      name: 'YourComponent',
      errors: [],
      warnings: [],
      props: [
        {
          kind: 'prop',
          name: 'prop-a',
          describeModel: false,
          keywords: [],
          required: false,
          type: 'number',
          visibility: 'public',
        },
        {
          kind: 'prop',
          name: 'prop-b',
          describeModel: false,
          keywords: [],
          default: '"default value"',
          required: false,
          type: 'string',
          visibility: 'public',
        },
        {
          kind: 'prop',
          name: 'prop-c',
          describeModel: false,
          keywords: [],
          required: false,
          type: [
            'string',
            'boolean',
          ],
          visibility: 'public',
        },
      ],
      data: [],
      computed: [],
      events: [],
      methods: [],
    });
  });

  it('@Prop(options: (PropOptions | Constructor[] | Constructor) = {}) decorator with reflect-metadata', async () => {
    const options = {
      filecontent: `
          <script type="ts">
            import 'reflect-metadata'
            import { Vue, Component, Prop } from 'vue-property-decorator'
  
            @Component
            export default class MyComponent extends Vue {
              @Prop() age!: number
            }
          </script>
        `,
    };

    await expect(options).toParseAs({
      name: 'MyComponent',
      errors: [],
      warnings: [],
      props: [
        {
          kind: 'prop',
          name: 'age',
          describeModel: false,
          keywords: [],
          required: false,
          type: 'number',
          visibility: 'public',
        },
      ],
      data: [],
      computed: [],
      events: [],
      methods: [],
    });
  });

  it('@PropSync(propName: string, options: (PropOptions | Constructor[] | Constructor) = {}) decorator', async () => {
    const options = {
      filecontent: `
          <script type="ts">
            import { Vue, Component, PropSync } from 'vue-property-decorator'
  
            @Component
            export default class YourComponent extends Vue {
              @PropSync('name', { type: String }) syncedName!: string
            }
          </script>
        `,
    };

    await expect(options).toParseAs({
      name: 'YourComponent',
      errors: [],
      warnings: [],
      props: [
        {
          kind: 'prop',
          name: 'name',
          describeModel: false,
          keywords: [],
          required: false,
          type: 'string',
          visibility: 'public',
        },
      ],
      data: [],
      computed: [
        {
          kind: 'computed',
          name: 'syncedName',
          type: 'string',
          keywords: [],
          dependencies: [
            'name',
          ],
          visibility: 'public',
        },
      ],
      events: [
        {
          kind: 'event',
          name: 'update:name',
          arguments: [
            {
              name: 'name',
              type: 'string',
              rest: false,
            },
          ],
          keywords: [],
          visibility: 'public',
        },
      ],
      methods: [],
    });
  });

  it('#92 - Multiline type', async () => {
    const options = {
      filecontent: `
          <script lang='ts'>
            import { Vue, Component, Prop } from 'vue-property-decorator';
            import { Observer } from 'mobx-vue';
            import { IContextMenuItem } from '../../contextmenus/IContextMenuItem.js';
  
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
        `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      name: 'SelectableList',
      props: [
        {
          kind: 'prop',
          visibility: 'public',
          description: 'private get context(): void {}',
          keywords: [],
          type: '(selectedItemsData: Array<any>) => Array<any>',
          default: '() => []',
          name: 'context-factory',
          describeModel: false,
          required: false,
        },
        {
          kind: 'prop',
          visibility: 'public',
          keywords: [],
          type: '(selectedItemsData: Array<any>) => Array<IContextMenuItem<any>>',
          default: '() => []',
          name: 'menu-factory',
          describeModel: false,
          required: false,
        },
      ],
    });
  });
});
