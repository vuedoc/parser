/* global describe it expect */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-return-assign */

const assert = require('assert');

const vuedoc = require('..');

const { ComponentTestCase } = require('./lib/TestUtils');
const { JSDocTypeSpec } = require('./spec/JSDocTypeSpec');
const { Fixture } = require('./lib/Fixture');

const Loader = require('../lib/Loader');
const VueLoader = require('../loader/vue');
const HtmlLoader = require('../loader/html');
const JavaScriptLoader = require('../loader/javascript');
const TypeScriptLoader = require('../loader/typescript');

const DefaultLoaders = [
  Loader.extend('js', JavaScriptLoader),
  Loader.extend('ts', TypeScriptLoader),
  Loader.extend('html', HtmlLoader),
  Loader.extend('vue', VueLoader)
];

const options = {
  filename: Fixture.resolve('checkbox.vue'),
  ignoredVisibilities: []
};

const optionsForModuleExports = {
  filename: Fixture.resolve('checkboxModuleExports.vue'),
  ignoredVisibilities: []
};

const optionsForVueExtend = {
  filename: Fixture.resolve('checkboxVueExtend.vue'),
  ignoredVisibilities: []
};

const optionsNoTopLevelConstant = {
  filename: Fixture.resolve('checkboxNoTopLevelConstant.vue'),
  ignoredVisibilities: []
};

const optionsWithFileSource = {
  filecontent: Fixture.get('checkbox.vue'),
  ignoredVisibilities: []
};

const optionsForPropsArray = {
  filename: Fixture.resolve('checkboxPropsArray.vue'),
  ignoredVisibilities: []
};

/* eslint-disable no-unused-vars */
function testComponentMethods (optionsToParse) {
  let component = {};

  vuedoc.parse(options)
    .then((_component) => (component = _component))
    .catch((err) => {
      throw err;
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

function testComponent (optionsToParse) {
  let component = {};

  it('should parse without error', () => {
    return vuedoc.parse(optionsToParse).then((_component) => {
      component = _component;
    });
  });

  it('should have a name', () => {
    assert.equal(component.name, 'checkbox');
  });

  it('should have keywords', () => {
    assert.deepEqual(component.keywords, [
      { name: 'contributor', description: 'Sébastien' }
    ]);
  });

  it('should guess the component name using the filename', () => {
    return vuedoc.parse({ filename: Fixture.resolve('UnNamedInput.vue') })
      .then((component) => {
        assert.equal(component.name, 'UnNamedInput');
      });
  });

  it('should have a description', () => {
    assert.equal(component.description, 'A simple checkbox component');
  });
}

function testComponentProps (optionsToParse) {
  let component = {};

  it('should parse without error', () => {
    return vuedoc.parse(optionsToParse).then((_component) => {
      component = _component;
    });
  });

  it('should contain a v-model prop with a description', () => {
    const item = component.props.find((item) => item.describeModel);

    expect(item).toBeDefined();
    assert.equal(item.type, 'Array');
    assert.equal(item.required, true);
    assert.equal(item.twoWay, undefined);
    expect(item.description).toBe('The checkbox model');
  });

  it('should contain a disabled prop with comments', () => {
    const item = component.props.find((item) => item.name === 'disabled');

    expect(item).toBeDefined();
    assert.equal(item.type, 'Boolean');
    expect(item.description).toBe('Initial checkbox state');
  });

  it('should contain a checked prop with default value and comments', () => {
    const item = component.props.find((item) => item.name === 'checked');

    expect(item).toBeDefined();
    assert.equal(item.type, 'Boolean');
    assert.equal(item.default, 'true');
    expect(item.description).toBe('Initial checkbox value');
  });

  it('should contain a checked prop with camel name', () => {
    const item = component.props.find((item) => item.name === 'prop-with-camel');

    expect(item).toBeDefined();
    assert.equal(item.type, 'Object');
    assert.equal(item.default, '() => ({ name: \'X\'})');
    expect(item.description).toBe('Prop with camel name');
  });
}

function testComponentSlots (optionsToParse) {
  let component = {};

  it('should parse without error', () => {
    return vuedoc.parse(optionsToParse).then((_component) => {
      component = _component;
    });
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

function testComponentEvents (optionsToParse) {
  let component = {};

  it('should parse without error', () => {
    return vuedoc.parse(optionsToParse).then((_component) => {
      component = _component;
    });
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

  it('should contain event with spread syntax', () => {
    const options = {
      features: [ 'events' ],
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
      `
    };

    const event = {
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
          rest: false
        }
      ],
      visibility: 'public'
    };

    return vuedoc.parse(options).then((component) => {
      assert.deepEqual(component.events, [ event ]);
    });
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
        `
      };

      return vuedoc.parse(options);
    });
  });

  describe('options', () => {
    it('should fail to parse with missing options', () => {
      assert.throws(() => vuedoc.parseOptions(),
        /Missing options argument/);
    });

    it('should fail to parse with missing minimum required options', () => {
      assert.throws(() => vuedoc.parseOptions({}),
        /One of options.filename or options.filecontent is required/);
    });

    it('should parse with minimum required options', () => {
      const filecontent = ' ';
      const options = { filecontent };
      const expected = {
        filecontent,
        encoding: 'utf8',
        ignoredVisibilities: [ 'protected', 'private' ],
        source: {
          template: '',
          script: '',
          errors: []
        },
        loaders: [ ...DefaultLoaders ]
      };

      return vuedoc.parseOptions(options).then(() => {
        expect(options).toEqual(expected);
      });
    });

    it('should parse with user options', () => {
      const options = {
        filecontent: ' ',
        ignoredVisibilities: [ 'private' ],
        loaders: [
          Loader.extend('coffee', JavaScriptLoader)
        ]
      };

      const expected = {
        filecontent: options.filecontent,
        encoding: 'utf8',
        ignoredVisibilities: [ ...options.ignoredVisibilities ],
        source: {
          template: '',
          script: '',
          errors: []
        },
        loaders: [
          Loader.extend('coffee', JavaScriptLoader),
          ...DefaultLoaders
        ]
      };

      return vuedoc.parseOptions(options).then(() => {
        expect(options).toEqual(expected);
      });
    });

    it('should parse with options.filename', () => {
      const options = {
        filename: Fixture.resolve('checkbox.js'),
        ignoredVisibilities: [ 'private' ],
        loaders: []
      };

      const expected = {
        filename: options.filename,
        encoding: 'utf8',
        ignoredVisibilities: [ ...options.ignoredVisibilities ],
        source: {
          template: '',
          script: Fixture.get('checkbox.js'),
          errors: []
        },
        loaders: [ ...DefaultLoaders ]
      };

      return vuedoc.parseOptions(options).then(() => {
        expect(options).toEqual(expected);
      });
    });

    it('should parse with options.filecontent', () => {
      const options = {
        filecontent: ' ',
        ignoredVisibilities: [ 'private' ],
        loaders: []
      };

      const expected = {
        filecontent: options.filecontent,
        encoding: 'utf8',
        ignoredVisibilities: [ ...options.ignoredVisibilities ],
        source: {
          template: '',
          script: '',
          errors: []
        },
        loaders: [ ...DefaultLoaders ]
      };

      return vuedoc.parseOptions(options).then(() => {
        expect(options).toEqual(expected);
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

    it('should parse without error', () => {
      return vuedoc.parse(optionsForPropsArray).then((_component) => {
        component = _component;
      });
    });

    it('should list props from string array', () => {
      const propsNames = component.props.map((item) => item.name);

      assert.deepEqual(propsNames, [
        'model', 'disabled', 'checked', 'prop-with-camel'
      ]);
    });

    it('should contain a model prop with a description', () => {
      const item = component.props.find((item) => item.describeModel);

      assert.equal(item.type, 'any');
      expect(item.description).toBe('The checkbox model');
    });

    it('should contain a checked prop with a description', () => {
      const item = component.props.find((item) => item.name === 'checked');

      assert.equal(item.type, 'any');
      expect(item.description).toBe('Initial checkbox value');
    });
  });

  describe('component.data', () => {
    it('should successfully extract data', () => {
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
        `
      };

      return vuedoc.parse(options).then((component) => {
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
            name: 'id'
          }
        ]);
      });
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
      `
    };

    it('should successfully extract computed properties', () => vuedoc.parse(options).then((component) => {
      const { computed } = component;

      assert.equal(computed.length, 3);

      assert.equal(computed[0].name, 'id');
      assert.deepEqual(computed[0].dependencies, [ 'value', 'name' ]);

      assert.equal(computed[1].name, 'type');
      assert.deepEqual(computed[1].dependencies, []);

      assert.equal(computed[2].name, 'getter');
      assert.deepEqual(computed[2].dependencies, [ 'value', 'name' ]);
    }));
  });

  describe('component.slots (es6)', () => testComponentSlots(options));

  describe('component.slots (commonjs)', () => testComponentSlots(optionsForModuleExports));

  describe('component.slots filesource', () => testComponentSlots(optionsWithFileSource));

  describe('component.slots scoped', () => {
    it('should successfully parse scoped slot', () => {
      const filecontent = `
        <template>
          <span>
            <slot v-bind:user="user">
              {{ user.lastName }}
            </slot>
          </span>
        </template>
      `;
      const features = [ 'slots' ];
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
              type: 'any',
              description: undefined }
          ],
          keywords: []
        }
      ];

      return vuedoc.parse(options).then(({ slots }) => {
        expect(slots).toEqual(expected);
      });
    });

    it('should successfully parse scoped slot with description', () => {
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
      const features = [ 'slots' ];
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
              type: 'any',
              description: undefined }
          ],
          keywords: []
        }
      ];

      return vuedoc.parse(options).then(({ slots }) => {
        expect(slots).toEqual(expected);
      });
    });

    it('should successfully parse scoped slot with description and props', () => {
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
      const features = [ 'slots' ];
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
              description: 'Todo item' }
          ],
          keywords: []
        }
      ];

      return vuedoc.parse(options).then(({ slots }) => {
        expect(slots).toEqual(expected);
      });
    });

    it('should successfully parse scoped slot with @prop and undescribed prop', () => {
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
      const features = [ 'slots' ];
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
              type: 'any',
              description: undefined }
          ],
          keywords: []
        }
      ];

      return vuedoc.parse(options).then(({ slots }) => {
        expect(slots).toEqual(expected);
      });
    });
  });

  describe('component.events (es6)', () => testComponentEvents(options));

  describe('component.events (commonjs)', () => testComponentEvents(optionsForModuleExports));

  describe('component.events filesource', () => testComponentEvents(optionsWithFileSource));

  describe('component.methods (es6)', () => testComponentMethods(options));

  describe('component.methods (commonjs)', () => testComponentMethods(optionsForModuleExports));

  describe('component.methods filesource', () => testComponentMethods(optionsWithFileSource));

  describe('spread operators', () => {
    it('should successfully parse', () => {
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
          category: undefined,
          version: undefined,
          keywords: [],
          dependencies: []
        }
      ];

      return vuedoc.parse(options).then(({ computed }) => {
        assert.deepEqual(computed, expected);
      });
    });

    it('should successfully parse with missing identifier', () => {
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

      return vuedoc.parse(options).then(({ computed }) => {
        assert.deepEqual(computed, expected);
      });
    });

    it('should successfully parse with external identifier', () => {
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
          category: undefined,
          version: undefined,
          keywords: [],
          dependencies: []
        },
        {
          kind: 'computed',
          visibility: 'public',
          name: 'id',
          category: undefined,
          version: undefined,
          keywords: [],
          dependencies: []
        }
      ];

      return vuedoc.parse(options).then(({ computed }) => {
        assert.deepEqual(computed, expected);
      });
    });

    it('should successfully parse with identifier function call', () => {
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
        slots: [],
        props: [],
        data: [],
        computed: [],
        events: [],
        methods: []
      };

      return vuedoc.parse(options).then((component) => {
        expect(component).toEqual(expected);
      });
    });
  });

  describe('errors', () => {
    it('should throw error for non html template', (done) => {
      const filecontent = `
        <template lang="pug">
          div
            p {{ gretting }} World!
        </template>
      `;
      const options = { filecontent };

      vuedoc.parse(options)
        .then(() => {
          done(new Error('should throw an error for non html script'));
        })
        .catch(() => done());
    });

    it('should throw error for non javascript script', (done) => {
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

      vuedoc.parse(options)
        .then(() => {
          done(new Error('should throw an error for non js script'));
        })
        .catch(() => done());
    });

    it('should throw error for non js files', (done) => {
      const filename = Fixture.resolve('checkbox.coffee');
      const options = { filename };

      vuedoc.parse(options)
        .then(() => {
          done(new Error('should throw an error for non js file'));
        })
        .catch(() => done());
    });

    it('should return component syntax error', () => {
      const filecontent = `
          <template>
            <input>
          </template>
        `;
      const options = { filecontent };
      const expected = [
        'tag <input> has no matching end tag.'
      ];

      return vuedoc.parse(options).then(({ errors }) => {
        assert.deepEqual(errors, expected);
      });
    });

    it('should emit event with @event and no description', () => {
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
          name: '***unhandled***',
          category: undefined,
          version: undefined,
          arguments: [],
          visibility: 'public',
          keywords: []
        }
      ];

      return vuedoc.parse(options).then(({ events }) => {
        assert.deepEqual(events, expected);
      });
    });
  });

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
      `
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
          type: 'Object',
          visibility: 'public' }
      ]
    }
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
      `
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
          type: 'Object',
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
          type: 'Boolean',
          visibility: 'public' }
      ],
      methods: [
        {
          kind: 'method',
          syntax: [
            'dynamic(): void'
          ],
          name: 'dynamic',
          keywords: [],
          category: undefined,
          version: undefined,
          description: 'Make component dynamic',
          params: [],
          returns: {
            type: 'void',
            description: undefined
          },
          visibility: 'public' },
        {
          kind: 'method',
          syntax: [
            'dynamic2Value(): void'
          ],
          name: 'dynamic2Value',
          keywords: [],
          category: undefined,
          version: undefined,
          description: 'Enter to dynamic mode',
          params: [],
          returns: {
            type: 'void',
            description: undefined
          },
          visibility: 'public' }
      ]
    }
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
      `
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
          props: []
        },
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          version: undefined,
          description: 'Use this slot to define form action buttons controls',
          keywords: [],
          name: 'actions',
          props: []
        },
        {
          kind: 'slot',
          visibility: 'public',
          category: undefined,
          version: undefined,
          description: 'Use this slot to define form footer content',
          keywords: [],
          name: 'footer',
          props: []
        }
      ]
    }
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
        `
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
            visibility: 'public'
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
            visibility: 'public'
          }
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
            visibility: 'public'
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
            visibility: 'public'
          }
        ]).flat()
      }
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
        }
      },
      {
        tag: 'version',
        value: '1.2.3',
        get expected() {
          return this.value;
        }
      },
      {
        tag: 'since',
        value: '1.2.3',
        get expected() {
          return this.value;
        }
      },
      {
        tag: 'deprecated',
        value: 'since version 2.0',
        get expected() {
          return this.value;
        }
      },
      {
        tag: 'see',
        value: 'http://mdn.com',
        get expected() {
          return this.value;
        }
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
            type: 'String',
            required: false,
            default: undefined,
            describeModel: false,
            category: undefined,
            version: undefined,
            description: undefined,
            [tag]: expected,
            keywords: [],
            visibility: 'public'
          },
        ],
        data: [
          {
            kind: 'data',
            name: 'data',
            type: 'any',
            category: undefined,
            version: undefined,
            description: undefined,
            [tag]: expected,
            initialValue: 'null',
            keywords: [],
            visibility: 'public'
          },
        ],
        computed: [
          {
            kind: 'computed',
            visibility: 'public',
            name: 'computed',
            category: undefined,
            version: undefined,
            description: undefined,
            [tag]: expected,
            keywords: [],
            dependencies: []
          },
        ],
        methods: [
          {
            kind: 'method',
            syntax: [
              'method(): void'
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
              description: undefined
            },
            visibility: 'public'
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
            visibility: 'public'
          }
        ]
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
          `
        },
        expected: expectedOutput
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
          `
        },
        expected: expectedOutput
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
          `
        },
        expected: expectedOutput
      });
    });
  }
});
