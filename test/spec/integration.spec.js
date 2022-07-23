import { beforeAll, describe, expect, it } from 'vitest';
import { parseComponent, parseOptions } from '../../src/index.ts';
import { ComponentTestCase } from '../lib/TestUtils.js';
import { JSDocTypeSpec } from '../lib/JSDocTypeSpec.js';
import { Fixture } from '../lib/Fixture.js';
import { Loader } from '../../src/lib/Loader.ts';
import { JavaScriptLoader } from '../../src/loaders/javascript.ts';

const options = {
  filename: Fixture.resolve('checkbox.vue'),
  ignoredVisibilities: [],
  composition: {
    data: [],
    methods: [],
    computed: [],
    props: [],
  },
};

const optionsForModuleExports = {
  filename: Fixture.resolve('checkboxModuleExports.vue'),
  ignoredVisibilities: [],
  composition: {
    data: [],
    methods: [],
    computed: [],
    props: [],
  },
};

const optionsForVueExtend = {
  filename: Fixture.resolve('checkboxVueExtend.vue'),
  ignoredVisibilities: [],
  composition: {
    data: [],
    methods: [],
    computed: [],
    props: [],
  },
};

const optionsNoTopLevelConstant = {
  filename: Fixture.resolve('checkboxNoTopLevelConstant.vue'),
  ignoredVisibilities: [],
  composition: {
    data: [],
    methods: [],
    computed: [],
    props: [],
  },
};

const optionsWithFileSource = {
  filecontent: await Fixture.get('checkbox.vue'),
  ignoredVisibilities: [],
  composition: {
    data: [],
    methods: [],
    computed: [],
    props: [],
  },
};

const optionsForPropsArray = {
  filename: Fixture.resolve('checkboxPropsArray.vue'),
  ignoredVisibilities: [],
  composition: {
    data: [],
    methods: [],
    computed: [],
    props: [],
  },
};

function testComponentMethods(optionsToParse) {
  let component = {};

  beforeAll(async () => {
    component = await parseComponent(optionsToParse);
  });

  it('should contain a method', () => {
    const item = component.methods.find(
      (item) => item.name === 'check'
    );

    expect(item).toBeDefined();
    expect(item.description).toBe('Check the checkbox');
  });

  it('should contain a protected method', () => {
    const item = component.methods.find((item) => item.visibility === 'protected');

    expect(item).toBeDefined();
  });

  it('should contain a private method', () => {
    const item = component.methods.find((item) => item.visibility === 'private');

    expect(item).toBeDefined();
  });

  it('should contain un uncommented method', () => {
    const item = component.methods.find((item) => !item.description);

    expect(item).toBeDefined();
  });
}

function testComponent(optionsToParse) {
  let component = {};

  beforeAll(async () => {
    component = await parseComponent(optionsToParse);
  });

  it('should have a name', () => {
    expect(component.name).toBe('checkbox');
  });

  it('should have keywords', () => {
    expect(component.keywords).toEqual([
      { name: 'contributor', description: 'Sébastien' },
    ]);
  });

  it('should guess the component name using the filename', async () => {
    const component = await parseComponent({ filename: Fixture.resolve('UnNamedInput.vue') });

    expect(component.name).toBe('UnNamedInput');
  });

  it('should have a description', () => {
    expect(component.description).toBe('A simple checkbox component');
  });
}

function testComponentProps(optionsToParse) {
  let component = {};

  beforeAll(async () => {
    component = await parseComponent(optionsToParse);
  });

  it('should contain a v-model prop with a description', () => {
    const item = component.props.find((item) => item.describeModel);

    expect(item).toBeDefined();
    expect(item.type).toBe('array');
    expect(item.required).toBeTruthy();
    expect(item.twoWay).toBeUndefined();
    expect(item.description).toBe('The checkbox model');
  });

  it('should contain a disabled prop with comments', () => {
    const item = component.props.find((item) => item.name === 'disabled');

    expect(item).toBeDefined();
    expect(item.type).toBe('boolean');
    expect(item.description).toBe('Initial checkbox state');
  });

  it('should contain a checked prop with default value and comments', () => {
    const item = component.props.find((item) => item.name === 'checked');

    expect(item).toBeDefined();
    expect(item.type).toBe('boolean');
    expect(item.default).toBeTruthy();
    expect(item.description).toBe('Initial checkbox value');
  });

  it('should contain a checked prop with camel name', () => {
    const item = component.props.find((item) => item.name === 'prop-with-camel');

    expect(item).toBeDefined();
    expect(item.type).toBe('object');
    expect(item.default).toBe('{"name":"X"}');
    expect(item.description).toBe('Prop with camel name');
  });
}

function testComponentSlots(optionsToParse) {
  let component = {};

  beforeAll(async () => {
    component = await parseComponent(optionsToParse);
  });

  it('should contain a default slot', () => {
    const item = component.slots.find((item) => item.hasOwnProperty('name') && item.name === 'default');

    expect(item).toBeDefined();
    expect(item.description).toBe('Default slot');
  });

  it('should contain a named slot', () => {
    const item = component.slots.find((item) => item.hasOwnProperty('name') && item.name === 'label');

    expect(item).toBeDefined();
    expect(item.description).toBe('Use this slot to set the checkbox label');
  });

  it('should contain a named slot with multiline description', () => {
    const item = component.slots.find((item) => item.hasOwnProperty('name') && item.name === 'multiline');

    expect(item).toBeDefined();
    expect(item.description).toBe('This\nis multiline description');
  });

  it('should contain a named slot without description', () => {
    const item = component.slots.find((item) => item.name === 'undescribed');

    expect(item).toBeDefined();
    expect(item.description).toBeUndefined();
  });
}

function testComponentEvents(optionsToParse) {
  let component = {};

  beforeAll(async () => {
    component = await parseComponent(optionsToParse);
  });

  it('should contain event with literal name', () => {
    const item = component.events.find((item) => item.name === 'loaded');

    expect(item).toBeDefined();
    expect(item.description).toBe('Emit when the component has been loaded');
  });

  it('should contain event with identifier name', () => {
    const item = component.events.find((item) => item.name === 'check');

    expect(item).toBeDefined();
    expect(item.description).toBe('Event with identifier name');
  });

  it('should contain event with renamed identifier name', () => {
    const item = component.events.find((item) => item.name === 'renamed');

    expect(item).toBeDefined();
    expect(item.description).toBe('Event with renamed identifier name');
  });

  it('should contain event with recursive identifier name', () => {
    const item = component.events.find((item) => item.name === 'recursive');

    expect(item).toBeDefined();
    expect(item.description).toBe('Event with recursive identifier name');
  });

  it('should contain event with spread syntax', async () => {
    const options = {
      features: ['events'],
      filecontent: `
        <script>
          export default {
            created () {
              /**
               * Fires when the card is changed.
               */
              this.$emit('change', {
                bankAccount: { ...this.bankAccount },
                valid: !this.$v.$invalid
              })
            }
          }
        </script>
      `,
    };

    const component = await parseComponent(options);

    expect(component.events).toEqual([
      {
        kind: 'event',
        name: 'change',
        category: undefined,
        version: undefined,
        description: 'Fires when the card is changed.',
        keywords: [],
        arguments: [
          {
            name: '{ bankAccount: { ...this.bankAccount }, valid: !this.$v.$invalid }',
            type: 'object',
            description: undefined,
            rest: false,
          },
        ],
        visibility: 'public',
      },
    ]);
  });
}

describe('Integration', () => {
  describe('Generic tests', () => {
    it('should successfully parse', () => {
      const options = {
        filecontent: `
          <script>
            /**
             * @mixin
             */
            export function TestMixinFactory(boundValue: Record<string, any>) {
              return Vue.extend({
                methods: {
                  /**
                   * Testing
                   *
                   * @tagtest2.5.0
                   * @public
                   */
                  myFunction(test: Record<string, any>): Record<string, any> {
                    //this.$emit('input')
                    return boundValue
                  },
                },
              })
            }

            /**
             * @mixin
             */
            export default (boundValue: Record<string, any>) => {
              return Vue.extend({
                methods: {
                  /**
                   * Testing
                   *
                   * @tagtest2.5.0
                   * @public
                   */
                  myFunction0(test: Record<string, any>): Record<string, any> {
                    //this.$emit('input')
                    return boundValue
                  },
                },
              })
            }

            export default Vue.extend({
              methods: {
                /**
                 * Testing
                 *
                 * @param {Record<string, any>} test <-- Parser stops with error
                 * @return {Record<string, any>} <-- Gets parsed as description
                 * @public
                 */
                myFunction2(test: Record<string, any>): Record<string, any> {
                    //this.$emit('input')
                    return boundValue
                },
              }
            })

            const fn6 = 'myFunction6'
            const fn7 = \`myFunction7\`
            const fn8 = 12
            const fn9 = true
            const fn10 = null
            const fn11 = /hello/
            const fn12 = new RegExp('hello')

            export default {
              methods: {
                /**
                 * Testing
                 *
                 * @param {Record<string, any>} test <-- Parser stops with error
                 * @return {Record<string, any>} <-- Gets parsed as description
                 * @public
                 */
                myFunction2(test: Record<string, any>): Record<string, any> {
                    //this.$emit('input')
                    return boundValue
                },
                myFunction2(test: Record<string, any>): Record<string, any> {
                    //this.$emit('input')
                    return boundValue
                },
                myFunction4: (test: Record<string, any>): Record<string, any> => {
                    //this.$emit('input')
                    return boundValue
                },
                myFunction5: function (test: Record<string, any>): Record<string, any> {
                    //this.$emit('input')
                    return boundValue
                },
                [fn6]: function (test: Record<string, any>): Record<string, any> {
                    return boundValue
                },
                [fn7]: function (test: Record<string, any>): Record<string, any> {
                    return boundValue
                },
                [fn8]: function (test: Record<string, any>): Record<string, any> {
                    return boundValue
                },
                [fn9]: function (test: Record<string, any>): Record<string, any> {
                    return boundValue
                },
                [fn10]: function (test: Record<string, any>): Record<string, any> {
                    return boundValue
                },
                [fn11]: function (test: Record<string, any>): Record<string, any> {
                    return boundValue
                },
                [fn12]: function (test: Record<string, any>): Record<string, any> {
                    return boundValue
                },
                [Symbol.species]: function (test: Record<string, any>): Record<string, any> {
                    return boundValue
                },
                /**
                 * @method test
                 */
                [MyObject.getDynamicMethodName()]: function (test: Record<string, any>): Record<string, any> {
                    return boundValue
                },
                [MyObject.fnname]: function (test: Record<string, any>): Record<string, any> {
                    return boundValue
                },
                ['fn13']: function (test: Record<string, any>): Record<string, any> {
                    return boundValue
                },
              }
            }
          </script>
        `,
      };

      return parseComponent(options);
    });
  });

  describe('options', () => {
    it('should fail to parse with missing options', () => {
      expect(parseOptions()).rejects.toThrow(/Missing options argument/);
    });

    it('should fail to parse with missing minimum required options', () => {
      expect(parseOptions({})).rejects.toThrow(/Missing options.filename of options.filecontent/);
    });

    it('should parse with minimum required options', async () => {
      const filecontent = ' ';
      const options = { filecontent };
      const expected = {
        filecontent,
        encoding: 'utf8',
        ignoredVisibilities: ['protected', 'private'],
        source: {
          template: {
            attrs: { lang: 'html' },
          },
          script: {
            attrs: { lang: 'js' },
          },
          errors: [],
        },
        composition: {
          data: [],
          methods: [],
          computed: [],
          props: [],
        },
      };

      await parseOptions(options);
      expect(options).toEqual(expected);
    });

    it('should parse with user options', async () => {
      const options = {
        filecontent: ' ',
        ignoredVisibilities: ['private'],
        loaders: [
          Loader.extend('coffee', JavaScriptLoader),
        ],
      };

      const expected = {
        filecontent: options.filecontent,
        encoding: 'utf8',
        ignoredVisibilities: [...options.ignoredVisibilities],
        source: {
          template: {
            attrs: { lang: 'html' },
          },
          script: {
            attrs: { lang: 'js' },
          },
          errors: [],
        },
        loaders: [
          Loader.extend('coffee', JavaScriptLoader),
        ],
        composition: {
          data: [],
          methods: [],
          computed: [],
          props: [],
        },
      };

      await parseOptions(options);
      expect(options).toEqual(expected);
    });

    it('should parse with options.filename', async () => {
      const options = {
        filename: Fixture.resolve('checkbox.js'),
        ignoredVisibilities: ['private'],
        loaders: [],
      };

      const expected = {
        filename: options.filename,
        encoding: 'utf8',
        ignoredVisibilities: [...options.ignoredVisibilities],
        source: {
          script: {
            attrs: { lang: 'js' },
            content: await Fixture.get('checkbox.js'),
          },
          errors: [],
        },
        loaders: [],
        composition: {
          data: [],
          methods: [],
          computed: [],
          props: [],
        },
      };

      await parseOptions(options);
      expect(options).toEqual(expected);
    });

    it('should parse with options.filecontent', async () => {
      const options = {
        filecontent: ' ',
        ignoredVisibilities: ['private'],
        loaders: [],
      };

      await parseOptions(options);

      expect(options).toEqual({
        filecontent: options.filecontent,
        encoding: 'utf8',
        ignoredVisibilities: [...options.ignoredVisibilities],
        source: {
          template: {
            attrs: { lang: 'html' },
          },
          script: {
            attrs: { lang: 'js' },
          },
          errors: [],
        },
        loaders: [],
        composition: {
          data: [],
          methods: [],
          computed: [],
          props: [],
        },
      });
    });
  });

  describe('component (es6)', () => testComponent(options));

  describe('component (commonjs)', () => testComponent(optionsForModuleExports));

  describe('component no-top-level-constant', () => testComponent(optionsNoTopLevelConstant));

  describe('component filesource', () => testComponent(optionsWithFileSource));

  describe('component with Vue.extend', () => testComponent(optionsForVueExtend, true));

  describe('component.props (es6)', () => testComponentProps(options));

  describe('component.props (commonjs)', () => testComponentProps(optionsForModuleExports));

  describe('component.props filesource', () => testComponentProps(optionsWithFileSource));

  describe('component.props (es6 Array)', () => {
    let component = {};

    beforeAll(async () => {
      component = await parseComponent(optionsForPropsArray);
    });

    it('should list props from string array', () => {
      const propsNames = component.props.map((item) => item.name);

      expect(propsNames).toEqual([
        'v-model', 'disabled', 'checked', 'prop-with-camel',
      ]);
    });

    it('should contain a model prop with a description', () => {
      const item = component.props.find((item) => item.describeModel);

      expect(item.type, 'unknown');
      expect(item.description).toBe('The checkbox model');
    });

    it('should contain a checked prop with a description', () => {
      const item = component.props.find((item) => item.name === 'checked');

      expect(item.type, 'unknown');
      expect(item.description).toBe('Initial checkbox value');
    });
  });

  describe('component.data', () => {
    it('should successfully extract data', async () => {
      const options = {
        filecontent: `
          <script>
            export default {
              name: 'test',
              data: {
                /**
                 * ID data
                 */
                id: 'Hello'
              }
            }
          </script>
        `,
      };

      const component = await parseComponent(options);

      expect(component.data).toEqual([
        {
          kind: 'data',
          keywords: [],
          visibility: 'public',
          category: undefined,
          version: undefined,
          description: 'ID data',
          initialValue: '"Hello"',
          type: 'string',
          name: 'id',
        },
      ]);
    });
  });

  describe('component.computed', () => {
    const options = {
      filecontent: `
        <script>
          export default {
            computed: {
              id () {
                const value = this.value
                return this.name + value
              },
              type () {
                return 'text'
              },
              getter: {
                get () {
                  const value = this.value
                  return this.name + value
                }
              }
            }
          }
        </script>
      `,
    };

    it('should successfully extract computed properties', () => parseComponent(options).then((component) => {
      const { computed } = component;

      expect(computed.length).toBe(3);

      expect(computed[0].name).toBe('id');
      expect(computed[0].dependencies).toEqual(['value', 'name']);

      expect(computed[1].name).toBe('type');
      expect(computed[1].dependencies).toEqual([]);

      expect(computed[2].name).toBe('getter');
      expect(computed[2].dependencies).toEqual(['value', 'name']);
    }));
  });

  describe('component.slots (es6)', () => testComponentSlots(options));

  describe('component.slots (commonjs)', () => testComponentSlots(optionsForModuleExports));

  describe('component.slots filesource', () => testComponentSlots(optionsWithFileSource));

  describe('component.slots scoped', () => {
    it('should successfully parse scoped slot', async () => {
      const filecontent = `
        <template>
          <span>
            <slot v-bind:user="user">
              {{ user.lastName }}
            </slot>
          </span>
        </template>
      `;
      const features = ['slots'];
      const options = { filecontent, features };
      const expected = [
        { kind: 'slot',
          visibility: 'public',
          name: 'default',
          category: undefined,
          version: undefined,
          description: undefined,
          props: [
            { name: 'user',
              type: 'unknown',
              description: undefined },
          ],
          keywords: [],
        },
      ];

      const { slots } = await parseComponent(options);

      expect(slots).toEqual(expected);
    });

    it('should successfully parse scoped slot with description', async () => {
      const filecontent = `
        <template>
          <ul>
            <li
              v-for="todo in filteredTodos"
              v-bind:key="todo.id"
            >
              <!--
                We have a slot for each todo, passing it the
                \`todo\` object as a slot prop.
              -->
              <slot name="todo" v-bind:todo="todo">
                <!-- Fallback content -->
                {{ todo.text }}
              </slot>
            </li>
          </ul>
        </template>
      `;
      const features = ['slots'];
      const options = { filecontent, features };
      const expected = [
        { kind: 'slot',
          visibility: 'public',
          name: 'todo',
          category: undefined,
          version: undefined,
          description: 'We have a slot for each todo, passing it the\n`todo` object as a slot prop.',
          props: [
            { name: 'todo',
              type: 'unknown',
              description: undefined },
          ],
          keywords: [],
        },
      ];

      const { slots } = await parseComponent(options);

      expect(slots).toEqual(expected);
    });

    it('should successfully parse scoped slot with description and props', async () => {
      const filecontent = `
        <template>
          <ul>
            <li
              v-for="todo in filteredTodos"
              v-bind:key="todo.id"
            >
              <!--
              We have a slot for each todo, passing it the
              \`todo\` object as a slot prop.

              @prop {TodoItem} todo - Todo item
              -->
              <slot name="todo" v-bind:todo="todo">
                <!-- Fallback content -->
                {{ todo.text }}
              </slot>
            </li>
          </ul>
        </template>
      `;
      const features = ['slots'];
      const options = { filecontent, features };
      const expected = [
        { kind: 'slot',
          visibility: 'public',
          name: 'todo',
          category: undefined,
          version: undefined,
          description: 'We have a slot for each todo, passing it the\n`todo` object as a slot prop.',
          props: [
            { name: 'todo',
              type: 'TodoItem',
              description: 'Todo item' },
          ],
          keywords: [],
        },
      ];

      const { slots } = await parseComponent(options);

      expect(slots).toEqual(expected);
    });

    it('should successfully parse scoped slot with @prop and undescribed prop', async () => {
      const filecontent = `
        <template>
          <ul>
            <li
              v-for="todo in filteredTodos"
              v-bind:key="todo.id"
            >
              <!--
              We have a slot for each todo, passing it the
              \`todo\` object as a slot prop.

              @prop {TodoItem} todo - Todo item
              -->
              <slot name="todo" v-bind:todo="todo" v-bind:actions="actions">
                <!-- Fallback content -->
                {{ todo.text }}
              </slot>
            </li>
          </ul>
        </template>
      `;
      const features = ['slots'];
      const options = { filecontent, features };
      const expected = [
        { kind: 'slot',
          visibility: 'public',
          name: 'todo',
          category: undefined,
          version: undefined,
          description: 'We have a slot for each todo, passing it the\n`todo` object as a slot prop.',
          props: [
            { name: 'todo',
              type: 'TodoItem',
              description: 'Todo item' },
            { name: 'actions',
              type: 'unknown',
              description: undefined },
          ],
          keywords: [],
        },
      ];

      const { slots } = await parseComponent(options);

      expect(slots).toEqual(expected);
    });
  });

  describe('component.events (es6)', () => testComponentEvents(options));

  describe('component.events (commonjs)', () => testComponentEvents(optionsForModuleExports));

  describe('component.events filesource', () => testComponentEvents(optionsWithFileSource));

  describe('component.methods (es6)', () => testComponentMethods(options));

  describe('component.methods (commonjs)', () => testComponentMethods(optionsForModuleExports));

  describe('component.methods filesource', () => testComponentMethods(optionsWithFileSource));

  describe('spread operators', () => {
    it('should successfully parse', async () => {
      const filecontent = `
        <script>
          const importedComputed = {
            value () {
              return 0
            }
          }

          export default {
            computed: {
              ...importedComputed
            }
          }
        </script>
      `;
      const options = { filecontent };
      const expected = [
        {
          kind: 'computed',
          visibility: 'public',
          name: 'value',
          type: 'number',
          category: undefined,
          version: undefined,
          keywords: [],
          dependencies: [],
        },
      ];

      const { computed } = await parseComponent(options);

      expect(computed).toEqual(expected);
    });

    it('should successfully parse with missing identifier', async () => {
      const filecontent = `
        <script>
          export default {
            computed: {
              ...importedComputed
            }
          }
        </script>
      `;
      const options = { filecontent };
      const expected = [];

      const { computed } = await parseComponent(options);

      expect(computed).toEqual(expected);
    });

    it('should successfully parse with external identifier', async () => {
      const filecontent = `
        <script>
          const importedComputed = {
            value () {
              return 0
            }
          }

          function id () {
            const value = this.value
            return this.name + value
          }

          export default {
            computed: {
              ...importedComputed, id
            }
          }
        </script>
      `;
      const options = { filecontent };
      const expected = [
        {
          kind: 'computed',
          visibility: 'public',
          name: 'value',
          type: 'number',
          category: undefined,
          version: undefined,
          keywords: [],
          dependencies: [],
        },
        {
          kind: 'computed',
          visibility: 'public',
          name: 'id',
          type: 'unknown',
          category: undefined,
          version: undefined,
          keywords: [],
          dependencies: [],
        },
      ];

      const { computed } = await parseComponent(options);

      expect(computed).toEqual(expected);
    });

    it('should successfully parse with identifier function call', async () => {
      const filecontent = `
        <script>
          export default {
            computed: {
              ...mapGetters('map', [
                'searchMapToolIsActive'
              ])
            }
          }
        </script>
      `;
      const options = { filecontent };
      const expected = {
        name: undefined,
        description: undefined,
        inheritAttrs: true,
        keywords: [],
        errors: [],
        warnings: [],
        slots: [],
        props: [],
        data: [],
        computed: [],
        events: [],
        methods: [],
      };

      const component = await parseComponent(options);

      expect(component).toEqual(expected);
    });
  });

  describe('errors', () => {
    it('should throw error for non html template', () => new Promise((resolve, reject) => {
      const filecontent = `
        <template lang="pug">
          div
            p {{ gretting }} World!
        </template>
      `;
      const options = { filecontent };

      parseComponent(options)
        .then(() => reject(new Error('should throw an error for non html script')))
        .catch(() => resolve());
    }));

    it('should throw error for non javascript script', () => new Promise((resolve, reject) => {
      const filecontent = `
        <script lang="coffee">
          export default {
            computed: {
              ...mapGetters('map', [
                'searchMapToolIsActive'
              ])
            }
          }
        </script>
      `;
      const options = { filecontent };

      parseComponent(options)
        .then(() => reject(new Error('should throw an error for non js script')))
        .catch(() => resolve());
    }));

    it('should throw error for non js files', () => new Promise((resolve, reject) => {
      const filename = Fixture.resolve('checkbox.coffee');
      const options = { filename };

      parseComponent(options)
        .then(() => reject(new Error('should throw an error for non js file')))
        .catch(() => resolve());
    }));

    it('should return component syntax error', async () => {
      const filecontent = `
          <template>
            <input>
          </template>
        `;
      const options = { filecontent };
      const expected = [
        'tag <input> has no matching end tag.',
      ];

      const { errors } = await parseComponent(options);

      expect(errors).toEqual(expected);
    });

    it('should emit event with @event and no description', async () => {
      const filecontent = `
          <script type="js">
            export default {
              created () {
                /**
                 * @event
                 */
                this.$emit(INPUT)
              }
            }
          </script>
        `;
      const options = { filecontent };
      const expected = [
        {
          kind: 'event',
          name: 'input',
          category: undefined,
          version: undefined,
          arguments: [],
          visibility: 'public',
          keywords: [],
        },
      ];

      const { events } = await parseComponent(options);

      expect(events).toEqual(expected);
    });
  });

  // FIXME Fix test for options.hooks
  // ComponentTestCase({
  //   name: 'options.hooks',
  //   options: {
  //     filecontent: `
  //       <script>
  //         export default {
  //           props: {
  //             /**
  //              * Custom default value with @default keyword.
  //              * Only the last defined keyword will be used
  //              * @default { key: 'value' }
  //              * @default { last: 'keyword' }
  //              */
  //             complex: {
  //               type: Object,
  //               default: () => {
  //                 // complex operations
  //                 return complexOperationsResultObject
  //               }
  //             }
  //           }
  //         }
  //       </script>
  //     `,
  //     hooks: {
  //       handleParsingResult(component) {
  //         component.props.push({ ...component.props[0], name: 'additional-prop' });
  //       },
  //     },
  //   },
  //   expected: {
  //     props: [
  //       {
  //         default: '{ last: \'keyword\' }',
  //         describeModel: false,
  //         category: undefined,
  //         version: undefined,
  //         description: 'Custom default value with @default keyword.\nOnly the last defined keyword will be used',
  //         keywords: [],
  //         kind: 'prop',
  //         name: 'complex',
  //         required: false,
  //         type: 'object',
  //         visibility: 'public' },
  //       {
  //         default: '{ last: \'keyword\' }',
  //         describeModel: false,
  //         category: undefined,
  //         version: undefined,
  //         description: 'Custom default value with @default keyword.\nOnly the last defined keyword will be used',
  //         keywords: [],
  //         kind: 'prop',
  //         name: 'additional-prop',
  //         required: false,
  //         type: 'object',
  //         visibility: 'public' },
  //     ],
  //   },
  // });

  ComponentTestCase({
    name: '#50 - @default keyword in props',
    options: {
      filecontent: `
        <script>
          export default {
            props: {
              /**
               * Custom default value with @default keyword.
               * Only the last defined keyword will be used
               * @default { key: 'value' }
               * @default { last: 'keyword' }
               */
              complex: {
                type: Object,
                default: () => {
                  // complex operations
                  return complexOperationsResultObject
                }
              }
            }
          }
        </script>
      `,
    },
    expected: {
      props: [
        {
          default: '{ last: \'keyword\' }',
          describeModel: false,
          category: undefined,
          version: undefined,
          description: 'Custom default value with @default keyword.\nOnly the last defined keyword will be used',
          keywords: [],
          kind: 'prop',
          name: 'complex',
          required: false,
          type: 'object',
          visibility: 'public' },
      ],
    },
  });

  ComponentTestCase({
    name: 'Dynamic object key',
    options: {
      filecontent: `
        <script>
          const name = 'blabla'
          const complex = 'complexValue'
          const dynamic2 = 'dynamic2Value'
          const boolFalse = false
          export default {
            name,
            props: {
              [complex]: {
                type: Object
              },
              boolFalse: {
                type: Boolean,
                default: true
              }
            },
            methods: {
              // Make component dynamic
              ['dynamic']: () => {
                console.log('dynamic')
              },

              // Enter to dynamic mode
              [dynamic2]: () => {
                console.log(dynamic2)
              }
            }
          }
        </script>
      `,
    },
    expected: {
      name: 'blabla',
      props: [
        {
          default: undefined,
          describeModel: false,
          category: undefined,
          version: undefined,
          description: undefined,
          keywords: [],
          kind: 'prop',
          name: 'complex-value',
          required: false,
          type: 'object',
          visibility: 'public' },
        {
          default: 'true',
          describeModel: false,
          category: undefined,
          version: undefined,
          description: undefined,
          keywords: [],
          kind: 'prop',
          name: 'bool-false',
          required: false,
          type: 'boolean',
          visibility: 'public' },
      ],
      methods: [
        {
          kind: 'method',
          syntax: [
            'dynamic(): void',
          ],
          name: 'dynamic',
          keywords: [],
          category: undefined,
          version: undefined,
          description: 'Make component dynamic',
          params: [],
          returns: {
            type: 'void',
            description: undefined,
          },
          visibility: 'public' },
        {
          kind: 'method',
          syntax: [
            'dynamic2Value(): void',
          ],
          name: 'dynamic2Value',
          keywords: [],
          category: undefined,
          version: undefined,
          description: 'Enter to dynamic mode',
          params: [],
          returns: {
            type: 'void',
            description: undefined,
          },
          visibility: 'public' },
      ],
    },
  });

  ComponentTestCase({
    name: '@slot',
    options: {
      filecontent: `
        <script>
          /**
           * @slot inputs - Use this slot to define form inputs ontrols
           * @slot actions - Use this slot to define form action buttons controls
           * @slot footer - Use this slot to define form footer content
           */
          export default {}
        </script>
      `,
    },
    expected: {
      slots: [
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          version: undefined,
          description: 'Use this slot to define form inputs ontrols',
          keywords: [],
          name: 'inputs',
          props: [],
        },
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          version: undefined,
          description: 'Use this slot to define form action buttons controls',
          keywords: [],
          name: 'actions',
          props: [],
        },
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          version: undefined,
          description: 'Use this slot to define form footer content',
          keywords: [],
          name: 'footer',
          props: [],
        },
      ],
    },
  });

  JSDocTypeSpec.forEach(({ name, values, expected }) => {
    const propsDeclaration = values.map((value, index) => `
      /**
       * @type {${value}}
       */
      propA${index}: String,
      /**
       * @type ${value}
       */
      propB${index}: String,
    `).join('');

    const dataDeclaration = values.map((value, index) => `
      /**
       * @type {${value}}
       */
      dataA${index}: null,
      /**
       * @type ${value}
       */
      dataB${index}: null,
    `).join('');

    ComponentTestCase({
      name: '@type',
      description: name,
      options: {
        filecontent: `
          <script>
            export default {
              props: {
                ${propsDeclaration}
              },
              data: () => ({
                ${dataDeclaration}
              })
            };
          </script>
        `,
      },
      expected: {
        errors: [],
        props: expected.map((value, index) => [
          {
            kind: 'prop',
            name: `prop-a${index}`,
            type: value,
            required: false,
            default: undefined,
            describeModel: false,
            category: undefined,
            version: undefined,
            description: undefined,
            keywords: [],
            visibility: 'public',
          },
          {
            kind: 'prop',
            name: `prop-b${index}`,
            type: value,
            required: false,
            default: undefined,
            describeModel: false,
            category: undefined,
            version: undefined,
            description: undefined,
            keywords: [],
            visibility: 'public',
          },
        ]).flat(),
        data: expected.map((value, index) => [
          {
            kind: 'data',
            name: `dataA${index}`,
            type: value,
            category: undefined,
            version: undefined,
            description: undefined,
            initialValue: 'null',
            keywords: [],
            visibility: 'public',
          },
          {
            kind: 'data',
            name: `dataB${index}`,
            type: value,
            category: undefined,
            version: undefined,
            description: undefined,
            initialValue: 'null',
            keywords: [],
            visibility: 'public',
          },
        ]).flat(),
      },
    });
  });

  // @author, @version, @since, @deprecated
  {
    const TagSpecs = [
      {
        tag: 'author',
        value: [
          'Arya Stark',
          'Jane Smith <jsmith@example.com>',
        ],
        get expected() {
          return this.value;
        },
      },
      {
        tag: 'version',
        value: '1.2.3',
        get expected() {
          return this.value;
        },
      },
      {
        tag: 'since',
        value: '1.2.3',
        get expected() {
          return this.value;
        },
      },
      {
        tag: 'deprecated',
        value: 'since version 2.0',
        get expected() {
          return this.value;
        },
      },
      {
        tag: 'see',
        value: 'http://mdn.com',
        get expected() {
          return this.value;
        },
      },
    ];

    TagSpecs.forEach(({ tag, value, expected }) => {
      const dotlet = value instanceof Array
        ? `/** \n${value.map((item) => '@' + tag + ' ' + item).join('\n')}\n **/`
        : `/** @${tag} ${value}*/`;

      const expectedOutput = {
        description: undefined,
        [tag]: expected,
        errors: [],
        keywords: [],
        props: [
          {
            kind: 'prop',
            name: 'prop',
            type: 'string',
            required: false,
            default: undefined,
            describeModel: false,
            category: undefined,
            version: undefined,
            description: undefined,
            [tag]: expected,
            keywords: [],
            visibility: 'public',
          },
        ],
        data: [
          {
            kind: 'data',
            name: 'data',
            type: 'unknown',
            category: undefined,
            version: undefined,
            description: undefined,
            [tag]: expected,
            initialValue: 'null',
            keywords: [],
            visibility: 'public',
          },
        ],
        computed: [
          {
            kind: 'computed',
            visibility: 'public',
            name: 'computed',
            type: 'string',
            category: undefined,
            version: undefined,
            description: undefined,
            [tag]: expected,
            keywords: [],
            dependencies: [],
          },
        ],
        methods: [
          {
            kind: 'method',
            syntax: [
              'method(): void',
            ],
            name: 'method',
            keywords: [],
            category: undefined,
            version: undefined,
            description: undefined,
            [tag]: expected,
            params: [],
            returns: {
              type: 'void',
              description: undefined,
            },
            visibility: 'public',
          },
        ],
        events: [
          {
            kind: 'event',
            name: 'input',
            category: undefined,
            version: undefined,
            description: undefined,
            [tag]: expected,
            keywords: [],
            arguments: [],
            visibility: 'public',
          },
        ],
      };

      ComponentTestCase({
        name: '@description',
        description: 'object definition',
        options: {
          filecontent: `
            <script>
              ${dotlet}
              export default {
                props: {
                  ${dotlet}
                  prop: String,
                },
                data: () => ({
                  ${dotlet}
                  data: null,
                }),
                computed: {
                  ${dotlet}
                  computed() {
                    return ''
                  },
                },
                methods: {
                  ${dotlet}
                  method() {
                    ${dotlet}
                    this.$emit('input')
                  },
                },
              };
            </script>
          `,
        },
        expected: expectedOutput,
      });

      ComponentTestCase({
        name: '@description',
        description: 'class component definition',
        options: {
          filecontent: `
            <script>
              ${dotlet}
              @Component({
                props: {
                  ${dotlet}
                  prop: String,
                },
                computed: {
                  ${dotlet}
                  computed() {
                    return ''
                  },
                }
              })
              export default class App extends Vue {
                constructor() {
                  ${dotlet}
                  this.data = null
                }

                ${dotlet}
                method() {
                  ${dotlet}
                  this.$emit('input')
                }
              };
            </script>
          `,
        },
        expected: expectedOutput,
      });

      ComponentTestCase({
        name: '@description',
        description: 'vue property decorator definition',
        options: {
          filecontent: `
            <script>
              ${dotlet}
              @Component
              class App extends Vue {
                ${dotlet}
                @Prop(String) prop!: String

                ${dotlet}
                data = null

                ${dotlet}
                get computed() {
                  return ''
                }

                ${dotlet}
                method() {
                  ${dotlet}
                  this.$emit('input')
                }
              };

              export default App
            </script>
          `,
        },
        expected: expectedOutput,
      });
    });
  }
});
