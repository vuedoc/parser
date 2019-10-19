/* global describe it expect */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-return-assign */

const assert = require('assert')

const vuedoc = require('..')

const { ComponentTestCase } = require('./lib/TestUtils')
const { Fixture } = require('./lib/Fixture')

const { Loader } = require('../lib/loader/Loader')
const { VueLoader } = require('../lib/loader/VueLoader')
const { HtmlLoader } = require('../lib/loader/HtmlLoader')
const { JavaScriptLoader } = require('../lib/loader/JavaScriptLoader')

const DefaultLoaders = [
  Loader.extend('js', JavaScriptLoader),
  Loader.extend('html', HtmlLoader),
  Loader.extend('vue', VueLoader)
]

const options = {
  filename: Fixture.resolve('checkbox.vue'),
  encoding: 'utf8',
  ignoredVisibilities: []
}

const optionsForModuleExports = {
  filename: Fixture.resolve('checkboxModuleExports.vue'),
  encoding: 'utf8',
  ignoredVisibilities: []
}

const optionsForVueExtend = {
  filename: Fixture.resolve('checkboxVueExtend.vue'),
  encoding: 'utf8',
  ignoredVisibilities: []
}

const optionsNoTopLevelConstant = {
  filename: Fixture.resolve('checkboxNoTopLevelConstant.vue'),
  encoding: 'utf8',
  ignoredVisibilities: []
}

const optionsWithFileSource = {
  filecontent: Fixture.get('checkbox.vue'),
  ignoredVisibilities: []
}

const optionsForPropsArray = {
  filename: Fixture.resolve('checkboxPropsArray.vue'),
  encoding: 'utf8',
  ignoredVisibilities: []
}

/* eslint-disable no-unused-vars */
function testComponentMethods (optionsToParse) {
  let component = {}

  vuedoc.parse(options)
    .then((_component) => (component = _component))
    .catch((err) => {
      throw err
    })

  it('should contain a method', () => {
    const item = component.methods.find(
      (item) => item.name === 'check'
    )

    assert.notEqual(item, undefined)
    assert.equal(item.description, 'Check the checkbox')
  })

  it('should contain a protected method', () => {
    const item = component.methods.find(
      (item) => item.visibility === 'protected'
    )

    assert.notEqual(item, undefined)
  })

  it('should contain a private method', () => {
    const item = component.methods.find(
      (item) => item.visibility === 'private'
    )

    assert.notEqual(item, undefined)
  })

  it('should contain un uncommented method', () => {
    const item = component.methods.find(
      (item) => item.description === null
    )

    assert.notEqual(item, undefined)
  })
}

function testComponent (optionsToParse) {
  let component = {}

  it('should parse without error', () => {
    return vuedoc.parse(optionsToParse).then((_component) => {
      component = _component
    })
  })

  it('should have a name', () => {
    assert.equal(component.name, 'checkbox')
  })

  it('should have keywords', () => {
    assert.deepEqual(component.keywords, [
      { name: 'author', description: 'Sébastien' }
    ])
  })

  it('should guess the component name using the filename', () => {
    return vuedoc.parse({ filename: Fixture.resolve('UnNamedInput.vue') })
      .then((component) => {
        assert.equal(component.name, 'UnNamedInput')
      })
  })

  it('should have a description', () => {
    assert.equal(component.description, 'A simple checkbox component')
  })
}

function testComponentProps (optionsToParse) {
  let component = {}

  it('should parse without error', () => {
    return vuedoc.parse(optionsToParse).then((_component) => {
      component = _component
    })
  })

  it('should contain a v-model prop with a description', () => {
    const item = component.props.find((item) => item.name === 'v-model')

    assert.notEqual(item, undefined)
    assert.equal(item.type, 'Array')
    assert.equal(item.required, true)
    assert.equal(item.twoWay, undefined)
    assert.equal(item.description, 'The checkbox model')
  })

  it('should contain a disabled prop with comments', () => {
    const item = component.props.find((item) => item.name === 'disabled')

    assert.notEqual(item, undefined)
    assert.equal(item.type, 'Boolean')
    assert.equal(item.description, 'Initial checkbox state')
  })

  it('should contain a checked prop with default value and comments', () => {
    const item = component.props.find((item) => item.name === 'checked')

    assert.notEqual(item, undefined)
    assert.equal(item.type, 'Boolean')
    assert.equal(item.default, true)
    assert.equal(item.description, 'Initial checkbox value')
  })

  it('should contain a checked prop with camel name', () => {
    const item = component.props.find((item) => item.name === 'prop-with-camel')

    assert.notEqual(item, undefined)
    assert.equal(item.type, 'Object')
    assert.equal(item.default, '() => ({ name: \'X\'})')
    assert.equal(item.description, 'Prop with camel name')
  })
}

function testComponentSlots (optionsToParse) {
  let component = {}

  it('should parse without error', () => {
    return vuedoc.parse(optionsToParse).then((_component) => {
      component = _component
    })
  })

  it('should contain a default slot', () => {
    const item = component.slots.find((item) => item.hasOwnProperty('name') && item.name === 'default')

    assert.notEqual(item, undefined)
    assert.equal(item.description, 'Default slot')
  })

  it('should contain a named slot', () => {
    const item = component.slots.find((item) => item.hasOwnProperty('name') && item.name === 'label')

    assert.notEqual(item, undefined)
    assert.equal(item.description, 'Use this slot to set the checkbox label')
  })

  it('should contain a named slot with multiline description', () => {
    const item = component.slots.find((item) => item.hasOwnProperty('name') && item.name === 'multiline')

    assert.notEqual(item, undefined)
    assert.equal(item.description, 'This\nis multiline description')
  })

  it('should contain a named slot without description', () => {
    const item = component.slots.find(
      (item) => item.name === 'undescribed'
    )

    assert.notEqual(item, undefined)
    assert.equal(item.description, '')
  })
}

function testComponentEvents (optionsToParse) {
  let component = {}

  it('should parse without error', () => {
    return vuedoc.parse(optionsToParse).then((_component) => {
      component = _component
    })
  })

  it('should contain event with literal name', () => {
    const item = component.events.find((item) => item.name === 'loaded')

    assert.notEqual(item, undefined)
    assert.equal(item.description, 'Emit when the component has been loaded')
  })

  it('should contain event with identifier name', () => {
    const item = component.events.find((item) => item.name === 'check')

    assert.notEqual(item, undefined)
    assert.equal(item.description, 'Event with identifier name')
  })

  it('should contain event with renamed identifier name', () => {
    const item = component.events.find((item) => item.name === 'renamed')

    assert.notEqual(item, undefined)
    assert.equal(item.description, 'Event with renamed identifier name')
  })

  it('should contain event with recursive identifier name', () => {
    const item = component.events.find((item) => item.name === 'recursive')

    assert.notEqual(item, undefined)
    assert.equal(item.description, 'Event with recursive identifier name')
  })

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
    }

    const event = {
      kind: 'event',
      name: 'change',
      description: 'Fires when the card is changed.',
      keywords: [],
      arguments: [
        {
          name: 'object',
          type: 'object',
          description: null,
          declaration: '{\n      bankAccount: { ...this.bankAccount },\n      valid: !this.$v.$invalid\n    }'
        }
      ],
      visibility: 'public'
    }

    return vuedoc.parse(options).then((component) => {
      assert.deepEqual(component.events, [ event ])
    })
  })
}

describe('options', () => {
  it('should fail to parse with missing options', () => {
    assert.throws(() => vuedoc.parseOptions(),
      /Missing options argument/)
  })

  it('should fail to parse with missing minimum required options', () => {
    assert.throws(() => vuedoc.parseOptions({}),
      /One of options.filename or options.filecontent is required/)
  })

  it('should parse with minimum required options', () => {
    const filecontent = ' '
    const options = { filecontent }
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
    }

    return vuedoc.parseOptions(options).then(() => {
      expect(options).toEqual(expected)
    })
  })

  it('should parse with user options', () => {
    const options = {
      encoding: 'utf8',
      filecontent: ' ',
      ignoredVisibilities: [ 'private' ],
      loaders: [
        Loader.extend('ts', JavaScriptLoader)
      ]
    }

    const expected = {
      encoding: options.encoding,
      filecontent: options.filecontent,
      ignoredVisibilities: [ ...options.ignoredVisibilities ],
      source: {
        template: '',
        script: '',
        errors: []
      },
      loaders: [
        Loader.extend('ts', JavaScriptLoader),
        ...DefaultLoaders
      ]
    }

    return vuedoc.parseOptions(options).then(() => {
      expect(options).toEqual(expected)
    })
  })

  it('should parse with options.filename', () => {
    const options = {
      filename: Fixture.resolve('checkbox.js'),
      ignoredVisibilities: [ 'private' ],
      loaders: []
    }

    const expected = {
      encoding: 'utf8',
      filename: options.filename,
      ignoredVisibilities: [ ...options.ignoredVisibilities ],
      source: {
        template: '',
        script: Fixture.get('checkbox.js'),
        errors: []
      },
      loaders: [ ...DefaultLoaders ]
    }

    return vuedoc.parseOptions(options).then(() => {
      expect(options).toEqual(expected)
    })
  })

  it('should parse with options.filecontent', () => {
    const options = {
      filecontent: ' ',
      ignoredVisibilities: [ 'private' ],
      loaders: []
    }

    const expected = {
      encoding: 'utf8',
      filecontent: options.filecontent,
      ignoredVisibilities: [ ...options.ignoredVisibilities ],
      source: {
        template: '',
        script: '',
        errors: []
      },
      loaders: [ ...DefaultLoaders ]
    }

    return vuedoc.parseOptions(options).then(() => {
      expect(options).toEqual(expected)
    })
  })
})

describe('component (es6)', () => testComponent(options))

describe('component (commonjs)', () => testComponent(optionsForModuleExports))

describe('component no-top-level-constant', () => testComponent(optionsNoTopLevelConstant))

describe('component filesource', () => testComponent(optionsWithFileSource))

describe('component with Vue.extend', () => testComponent(optionsForVueExtend, true))

describe('component.props (es6)', () => testComponentProps(options))

describe('component.props (commonjs)', () => testComponentProps(optionsForModuleExports))

describe('component.props filesource', () => testComponentProps(optionsWithFileSource))

describe('component.props (es6 Array)', () => {
  let component = {}

  it('should parse without error', () => {
    return vuedoc.parse(optionsForPropsArray).then((_component) => {
      component = _component
    })
  })

  it('should list props from string array', () => {
    const propsNames = component.props.map((item) => item.name)

    assert.deepEqual(propsNames, [
      'v-model', 'disabled', 'checked', 'prop-with-camel'
    ])
  })

  it('should contain a model prop with a description', () => {
    const item = component.props.find((item) => item.name === 'v-model')

    assert.equal(item.type, 'Any')
    assert.equal(item.description, 'The checkbox model')
  })

  it('should contain a checked prop with a description', () => {
    const item = component.props.find((item) => item.name === 'checked')

    assert.equal(item.type, 'Any')
    assert.equal(item.description, 'Initial checkbox value')
  })
})

describe('component.data', () => {
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
  }

  it('should successfully extract data', () => {
    const expected = [
      {
        kind: 'data',
        keywords: [],
        visibility: 'public',
        description: 'ID data',
        initial: 'Hello',
        type: 'string',
        name: 'id'
      }
    ]

    return vuedoc.parse(options).then((component) => {
      assert.deepEqual(component.data, expected)
    })
  })
})

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
  }

  it('should successfully extract computed properties', () => vuedoc.parse(options).then((component) => {
    const { computed } = component

    assert.equal(computed.length, 3)

    assert.equal(computed[0].name, 'id')
    assert.deepEqual(computed[0].dependencies, [ 'value', 'name' ])

    assert.equal(computed[1].name, 'type')
    assert.deepEqual(computed[1].dependencies, [])

    assert.equal(computed[2].name, 'getter')
    assert.deepEqual(computed[2].dependencies, [ 'value', 'name' ])
  }))
})

describe('component.slots (es6)', () => testComponentSlots(options))

describe('component.slots (commonjs)', () => testComponentSlots(optionsForModuleExports))

describe('component.slots filesource', () => testComponentSlots(optionsWithFileSource))

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
    `
    const features = [ 'slots' ]
    const options = { filecontent, features }
    const expected = [
      { kind: 'slot',
        visibility: 'public',
        name: 'default',
        description: '',
        props: [
          { name: 'user',
            type: 'Any',
            description: '' }
        ],
        keywords: []
      }
    ]

    return vuedoc.parse(options).then(({ slots }) => {
      expect(slots).toEqual(expected)
    })
  })

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
    `
    const features = [ 'slots' ]
    const options = { filecontent, features }
    const expected = [
      { kind: 'slot',
        visibility: 'public',
        name: 'todo',
        description: 'We have a slot for each todo, passing it the\n`todo` object as a slot prop.',
        props: [
          { name: 'todo',
            type: 'Any',
            description: '' }
        ],
        keywords: []
      }
    ]

    return vuedoc.parse(options).then(({ slots }) => {
      expect(slots).toEqual(expected)
    })
  })

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
    `
    const features = [ 'slots' ]
    const options = { filecontent, features }
    const expected = [
      { kind: 'slot',
        visibility: 'public',
        name: 'todo',
        description: 'We have a slot for each todo, passing it the\n`todo` object as a slot prop.',
        props: [
          { name: 'todo',
            type: 'TodoItem',
            description: 'Todo item' }
        ],
        keywords: [
          { name: 'prop',
            description: '{TodoItem} todo - Todo item' }
        ]
      }
    ]

    return vuedoc.parse(options).then(({ slots }) => {
      expect(slots).toEqual(expected)
    })
  })

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
    `
    const features = [ 'slots' ]
    const options = { filecontent, features }
    const expected = [
      { kind: 'slot',
        visibility: 'public',
        name: 'todo',
        description: 'We have a slot for each todo, passing it the\n`todo` object as a slot prop.',
        props: [
          { name: 'todo',
            type: 'TodoItem',
            description: 'Todo item' },
          { name: 'actions',
            type: 'Any',
            description: '' }
        ],
        keywords: [
          { name: 'prop',
            description: '{TodoItem} todo - Todo item' }
        ]
      }
    ]

    return vuedoc.parse(options).then(({ slots }) => {
      expect(slots).toEqual(expected)
    })
  })
})

describe('component.events (es6)', () => testComponentEvents(options))

describe('component.events (commonjs)', () => testComponentEvents(optionsForModuleExports))

describe('component.events filesource', () => testComponentEvents(optionsWithFileSource))

describe('component.methods (es6)', () => testComponentMethods(options))

describe('component.methods (commonjs)', () => testComponentMethods(optionsForModuleExports))

describe('component.methods filesource', () => testComponentMethods(optionsWithFileSource))

describe('component.methods visibility_default', () => {
  let component = {}
  const options = {
    filename: Fixture.resolve('checkboxMethods.vue'),
    encoding: 'utf8'
  }

  it('should parse without error', () => {
    return vuedoc.parse(options).then((_component) => {
      component = _component
    })
  })

  it('public method should be public', () => {
    const item = component.methods.find(
      (item) => item.name === 'publicMethod'
    )
    assert.equal(item.visibility, 'public')
  })

  it('uncommented method should be public', () => {
    const item = component.methods.find(
      (item) => item.name === 'uncommentedMethod'
    )
    assert.equal(item.visibility, 'public')
  })

  it('default method should be public', () => {
    const item = component.methods.find(
      (item) => item.name === 'defaultMethod'
    )
    assert.equal(item.visibility, 'public')
  })
})

describe('component.methods visibility_private', () => {
  let component = {}
  const options = {
    filename: Fixture.resolve('checkboxMethods.vue'),
    encoding: 'utf8',
    defaultMethodVisibility: 'private'
  }

  it('should parse without error', () => {
    return vuedoc.parse(options).then((_component) => {
      component = _component
    })
  })

  it('public method should be public', () => {
    const item = component.methods.find(
      (item) => item.name === 'publicMethod'
    )
    assert.equal(item.visibility, 'public')
  })

  it('uncommented method should not exist', () => {
    const item = component.methods.find(
      (item) => item.name === 'uncommentedMethod'
    )
    assert.equal(item, undefined)
  })

  it('default method should not exist', () => {
    const item = component.methods.find(
      (item) => item.name === 'defaultMethod'
    )
    assert.equal(item, undefined)
  })
})

describe('dynamic import() function', () => {
  it('should successfully parse code with the reserved import keyword', () => {
    const filecontent = `
      <script>
        export default {
          components: {
            Lazy: import('./components/Lazy.vue')
          }
        }
      </script>
    `
    const options = { filecontent }
    const expected = {
      name: null,
      description: null,
      inheritAttrs: true,
      keywords: [],
      errors: [],
      slots: [],
      props: [],
      data: [],
      computed: [],
      events: [],
      methods: []
    }

    return vuedoc.parse(options).then((component) => {
      assert.deepEqual(component, expected)
    })
  })
})

describe('Syntax: exports["default"]', () => {
  it('should successfully parse code with the reserved import keyword', () => {
    const filecontent = `
      <script>
        exports.__esModule = true;
        var vue_1 = require("vue");
        var Site_1 = require("@/designer/models/Site");

        /**
         * description
         */
        exports["default"] = vue_1["default"].extend({
            props: {
                links: {
                    type: Object,
                    required: true
                },
                site: {
                    type: Site_1.Site,
                    required: true
                }
            },
            data: function () { return ({
                currentYear: new Date().getFullYear()
            }); },
            computed: {
                pages: function () {
                    var _this = this;
                    return this.links.map(function (pageId) {
                        return _this.site.getPage(pageId);
                    });
                }
            }
        });
      </script>
    `
    const options = { filecontent }
    const expected = {
      name: null,
      description: 'description',
      inheritAttrs: true,
      events: [],
      errors: [],
      keywords: [],
      methods: [],
      computed: [ {
        kind: 'computed',
        name: 'pages',
        dependencies: [ 'links', 'site' ],
        description: null,
        keywords: [],
        visibility: 'public'
      } ],
      data: [ {
        kind: 'data',
        name: 'currentYear',
        type: 'CallExpression',
        description: null,
        initial: 'new Date().getFullYear()',
        keywords: [],
        visibility: 'public'
      } ],
      props: [ {
        kind: 'prop',
        name: 'links',
        type: 'Object',
        nativeType: 'object',
        required: true,
        default: '__undefined__',
        describeModel: false,
        description: null,
        keywords: [],
        visibility: 'public'
      }, {
        kind: 'prop',
        name: 'site',
        type: 'Site_1.Site',
        nativeType: '__undefined__',
        required: true,
        default: '__undefined__',
        describeModel: false,
        description: null,
        keywords: [],
        visibility: 'public'
      } ],
      slots: []
    }

    return vuedoc.parse(options).then((component) => {
      assert.deepEqual(component, expected)
    })
  })
})

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
    `
    const options = { filecontent }
    const expected = [
      {
        kind: 'computed',
        visibility: 'public',
        name: 'value',
        description: null,
        keywords: [],
        dependencies: []
      }
    ]

    return vuedoc.parse(options).then(({ computed }) => {
      assert.deepEqual(computed, expected)
    })
  })

  it('should successfully parse with missing identifier', () => {
    const filecontent = `
      <script>
        export default {
          computed: {
            ...importedComputed
          }
        }
      </script>
    `
    const options = { filecontent }
    const expected = []

    return vuedoc.parse(options).then(({ computed }) => {
      assert.deepEqual(computed, expected)
    })
  })

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
    `
    const options = { filecontent }
    const expected = [
      {
        kind: 'computed',
        visibility: 'public',
        name: 'value',
        description: null,
        keywords: [],
        dependencies: []
      },
      {
        kind: 'computed',
        visibility: 'public',
        name: 'id',
        description: null,
        keywords: [],
        dependencies: []
      }
    ]

    return vuedoc.parse(options).then(({ computed }) => {
      assert.deepEqual(computed, expected)
    })
  })

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
    `
    const options = { filecontent }
    const expected = {
      name: null,
      description: null,
      inheritAttrs: true,
      keywords: [],
      errors: [],
      slots: [],
      props: [],
      data: [],
      computed: [],
      events: [],
      methods: []
    }

    return vuedoc.parse(options).then((component) => {
      assert.deepEqual(component, expected)
    })
  })
})

describe('errors', () => {
  it('should throw error for non html template', (done) => {
    const filecontent = `
      <template lang="pug">
        div
          p {{ gretting }} World!
      </template>
    `
    const options = { filecontent }

    vuedoc.parse(options)
      .then(() => {
        done(new Error('should throw an error for non html script'))
      })
      .catch(() => done())
  })

  it('should throw error for non javascript script', (done) => {
    const filecontent = `
      <script lang="ts">
        export default {
          computed: {
            ...mapGetters('map', [
              'searchMapToolIsActive'
            ])
          }
        }
      </script>
    `
    const options = { filecontent }

    vuedoc.parse(options)
      .then(() => {
        done(new Error('should throw an error for non js script'))
      })
      .catch(() => done())
  })

  it('should throw error for non js files', (done) => {
    const filename = Fixture.resolve('checkbox.ts')
    const options = { filename }

    vuedoc.parse(options)
      .then(() => {
        done(new Error('should throw an error for non js file'))
      })
      .catch(() => done())
  })

  it('should return component syntax error', () => {
    const filecontent = `
        <template>
          <input>
        </template>
      `
    const options = { filecontent }
    const expected = [
      'tag <input> has no matching end tag.'
    ]

    return vuedoc.parse(options).then(({ errors }) => {
      assert.deepEqual(errors, expected)
    })
  })

  it('should throw error for lang !== js', () => {
    const filecontent = `
        <script type="js">
          export default {
            created () {
              /**
              * @event
              */
              this.$emit('input')
            }
          }
        </script>
      `
    const options = { filecontent }
    const expected = [
      'Missing keyword value for @event: this.$emit(\'input\')'
    ]

    return vuedoc.parse(options).then(({ errors }) => {
      assert.deepEqual(errors, expected)
    })
  })
})

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
        description: 'Custom default value with @default keyword.\nOnly the last defined keyword will be used',
        keywords: [],
        kind: 'prop',
        name: 'complex',
        nativeType: 'ArrowFunctionExpression',
        required: false,
        type: 'Object',
        visibility: 'public' }
    ]
  }
})

ComponentTestCase({
  name: 'Dynamic object key',
  options: {
    filecontent: `
      <script>
        const name = 'blabla'
        const complex = 'complexValue'
        const dynamic2 = 'dynamic2Value'
        const computedProp2 = 'computedProp2Value'
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
          computed: {
            ['computedProp1']() { return 1 },
            [computedProp2]() { return 2 }
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
        default: '__undefined__',
        describeModel: false,
        description: null,
        keywords: [],
        kind: 'prop',
        name: 'complex-value',
        nativeType: 'object',
        required: false,
        type: 'Object',
        visibility: 'public' },
      {
        default: true,
        describeModel: false,
        description: null,
        keywords: [],
        kind: 'prop',
        name: 'bool-false',
        nativeType: 'boolean',
        required: false,
        type: 'Boolean',
        visibility: 'public' }
    ],
    computed: [
      {
        kind: 'computed',
        name: 'computedProp1',
        description: null,
        keywords: [],
        dependencies: [],
        visibility: 'public' },
      {
        kind: 'computed',
        name: 'computedProp2Value',
        description: null,
        keywords: [],
        dependencies: [],
        visibility: 'public' }
    ],
    methods: [
      {
        kind: 'method',
        name: 'dynamic',
        keywords: [],
        description: 'Make component dynamic',
        params: [],
        return: {
          type: 'void',
          description: null
        },
        visibility: 'public' },
      {
        kind: 'method',
        name: 'dynamic2Value',
        keywords: [],
        description: 'Enter to dynamic mode',
        params: [],
        return: {
          type: 'void',
          description: null
        },
        visibility: 'public' }
    ]
  }
})
