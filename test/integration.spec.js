const vuedoc = require('..')
const assert = require('assert')

const { join } = require('path')
const { readFileSync } = require('fs')

/* global describe it expect */
/* eslint-disable max-len */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-return-assign */
/* eslint-disable arrow-body-style */

function resolve (filename) {
  return join(__dirname, `fixtures/${filename}`)
}

const options = {
  filename: resolve('checkbox.vue'),
  encoding: 'utf8',
  ignoredVisibilities: []
}

const optionsForModuleExports = {
  filename: resolve('checkboxModuleExports.vue'),
  encoding: 'utf8',
  ignoredVisibilities: []
}

const optionsForVueExtend = {
  filename: resolve('checkboxVueExtend.vue'),
  encoding: 'utf8',
  ignoredVisibilities: []
}

const optionsNoTopLevelConstant = {
  filename: resolve('checkboxNoTopLevelConstant.vue'),
  encoding: 'utf8',
  ignoredVisibilities: []
}

const optionsWithFileSource = {
  filecontent: readFileSync(resolve('checkbox.vue'), 'utf8'),
  ignoredVisibilities: []
}

const optionsForPropsArray = {
  filename: resolve('checkboxPropsArray.vue'),
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

  /* eslint-disable arrow-body-style */
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
    return vuedoc.parse({ filename: resolve('UnNamedInput.vue') })
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
      arguments: [],
      description: 'Fires when the card is changed.',
      keywords: [],
      visibility: 'public'
    }

    return vuedoc.parse(options).then((component) => {
      assert.deepEqual(component.events, [ event ])
    })
  })
}

describe('options', () => {
  it('should fail to parse with missing options.filename', () => {
    assert.throws(() => vuedoc.parseOptions({}),
      /One of options.filename or options.filecontent is required/)
  })

  it('should parse with default options.encoding', () => {
    const _options = { filename: options.filename }

    assert.doesNotThrow(() => vuedoc.parseOptions(_options))
  })

  it('should parse with options.filename', () => {
    const options = {
      filename: resolve('checkbox.js'),
      features: [ 'description' ]
    }

    return vuedoc.parse(options).then((component) => {
      assert.deepEqual(component, { description: 'A js component' })
    })
  })

  it('should parse with options.filecontent', () => {
    const _options = { filecontent: 'vue file contents' }

    assert.doesNotThrow(() => vuedoc.parseOptions(_options))
  })

  it('should parse with options.features === ["events"]', () => {
    const options = {
      features: [ 'events' ],
      filecontent: `
        <script>
          export default {
            created () {
              /**
               * Fires when the card is changed.
               */
              this.$emit('change', true)
            }
          }
        </script>
      `
    }

    const event = {
      kind: 'event',
      name: 'change',
      arguments: [],
      description: 'Fires when the card is changed.',
      keywords: [],
      visibility: 'public'
    }

    return vuedoc.parse(options).then((component) => {
      assert.deepEqual(component.events, [ event ])
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
    filename: resolve('checkboxMethods.vue'),
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
    filename: resolve('checkboxMethods.vue'),
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
      keywords: [],
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
    const expected = {
      name: null,
      description: null,
      keywords: [],
      slots: [],
      props: [],
      data: [],
      computed: [
        {
          kind: 'computed',
          visibility: 'public',
          name: 'value',
          description: null,
          keywords: [],
          dependencies: []
        }
      ],
      events: [],
      methods: []
    }

    return vuedoc.parse(options).then((component) => {
      assert.deepEqual(component, expected)
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
    const expected = {
      name: null,
      description: null,
      keywords: [],
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
    const expected = {
      name: null,
      description: null,
      keywords: [],
      slots: [],
      props: [],
      data: [],
      computed: [
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
      ],
      events: [],
      methods: []
    }

    return vuedoc.parse(options).then((component) => {
      assert.deepEqual(component, expected)
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
      keywords: [],
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
