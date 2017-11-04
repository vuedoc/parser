'use strict'

const parser = require('..')
const assert = require('assert')
const path = require('path')
const fs = require('fs')

const f = (filename) => path.join(__dirname, 'fixtures/' + filename)

const options = {
  filename: f('checkbox.vue'),
  encoding: 'utf8',
  ignoredVisibilities: []
}

const optionsForModuleExports = {
  filename: f('checkboxModuleExports.vue'),
  encoding: 'utf8',
  ignoredVisibilities: []
}

const optionsNoTopLevelConstant = {
  filename: f('checkboxNoTopLevelConstant.vue'),
  encoding: 'utf8',
  ignoredVisibilities: []
}

const optionsWithFileSource = {
  filecontent: fs.readFileSync(f('checkbox.vue'), 'utf8'),
  ignoredVisibilities: []
}

/* global describe it */

describe('options', () => {
  it('should fail to parse with missing options.filename', () => {
    assert.throws(() => parser.parseOptions({}),
      /One of options.filename or options.filecontent is required/)
  })

  it('should parse with default options.encoding', () => {
    const _options = { filename: options.filename }

    assert.doesNotThrow(() => parser.parseOptions(_options))
  })

  it('should parse with options.filecontent', () => {
    const _options = { filecontent: 'vue file contents' }

    assert.doesNotThrow(() => parser.parseOptions(_options))
  })

  it('should parse with options.features === ["events"]', () => {
    const options = {
      features: ['events'],
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
      name: 'change',
      description: 'Fires when the card is changed.',
      keywords: [],
      visibility: 'public'
    }

    return parser.parse(options).then((component) => {
      assert.deepEqual(component.events, [ event ])
    })
  })
})

describe('component (es6)', () => testComponent(options))

describe('component (commonjs)', () => testComponent(optionsForModuleExports))

describe('component_no-top-level-constant', () => testComponent(optionsNoTopLevelConstant))

describe('component_filesource', () => testComponent(optionsWithFileSource))

function testComponent (optionsToParse) {
  let component = {}

  it('should parse without error', (done) => {
    parser.parse(optionsToParse)
      .then((_component) => {
        component = _component
        done()
      })
      .catch(done)
  })

  it('should have a name', () =>
    assert.equal(component.name, 'checkbox'))

  it('should have keywords', () => {
    assert.deepEqual(component.keywords, [ { name: 'author', description: 'Sébastien' } ])
  })

  it('should guess the component name using the filename', (done) => {
    parser.parse({ filename: f('UnNamedInput.vue') })
      .then((component) => {
        assert.equal(component.name, 'un-named-input')
        done()
      })
      .catch(done)
  })

  it('should have a description', () =>
    assert.equal(component.description, 'A simple checkbox component'))
}

describe('component.props (es6)', () => testComponentProps(options))

describe('component.props (commonjs)', () => testComponentProps(optionsForModuleExports))

describe('component.props_filesource', () => testComponentProps(optionsWithFileSource))

function testComponentProps (optionsToParse) {
  let component = {}

  parser.parse(optionsToParse)
    .then((_component) => (component = _component))
    .catch((err) => { throw err })

  it('should contain a v-model prop with a description', () => {
    const item = component.props.find((item) => item.name === 'v-model')

    assert.notEqual(item, void 0)
    assert.equal(item.value.type, 'Array')
    assert.equal(item.value.required, true)
    assert.equal(item.value.twoWay, true)
    assert.equal(item.description, 'The checkbox model')
  })

  it('should contain a disabled prop with comments', () => {
    const item = component.props.find((item) => item.name === 'disabled')

    assert.notEqual(item, void 0)
    assert.equal(item.value, 'Boolean')
    assert.equal(item.description, 'Initial checkbox state')
  })

  it('should contain a checked prop with default value and comments', () => {
    const item = component.props.find((item) => item.name === 'checked')

    assert.notEqual(item, void 0)
    assert.equal(item.value.type, 'Boolean')
    assert.equal(item.value.default, true)
    assert.equal(item.description, 'Initial checkbox value')
  })

  it('should contain a checked prop with camel name', () => {
    const item = component.props.find((item) => item.name === 'prop-with-camel')

    assert.notEqual(item, void 0)
    assert.equal(item.value.type, 'Object')
    assert.equal(item.value.default.type, 'ArrowFunctionExpression')
    assert.equal(item.description, 'Prop with camel name')
  })
}

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
        keywords: [],
        visibility: 'public',
        description: 'ID data',
        value: 'Hello',
        name: 'id'
      }
    ]

    return parser.parse(options).then((component) => {
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

  it('should successfully extract computed properties', () => {
    return parser.parse(options).then((component) => {
      const computed = component.computed

      assert.equal(computed.length, 3)

      assert.equal(computed[0].name, 'id')
      assert.deepEqual(computed[0].dependencies, [ 'value', 'name' ])

      assert.equal(computed[1].name, 'type')
      assert.deepEqual(computed[1].dependencies, [])

      assert.equal(computed[2].name, 'getter')
      assert.deepEqual(computed[2].dependencies, [ 'value', 'name' ])
    })
  })
})

describe('component.slots (es6)', () => testComponentSlots(options))

describe('component.slots (commonjs)', () => testComponentSlots(optionsForModuleExports))

describe('component.slots_filesource', () => testComponentSlots(optionsWithFileSource))

function testComponentSlots (optionsToParse) {
  let component = {}

  parser.parse(options)
    .then((_component) => (component = _component))
    .catch((err) => { throw err })

  it('should contain a default slot', () => {
    const item = component.slots.find((item) =>
      item.hasOwnProperty('name') && item.name === 'default')

    assert.notEqual(item, void 0)
    assert.equal(item.description, 'Default slot')
  })

  it('should contain a named slot', () => {
    const item = component.slots.find((item) =>
      item.hasOwnProperty('name') && item.name === 'label')

    assert.notEqual(item, void 0)
    assert.equal(item.description, 'Use this slot to set the checkbox label')
  })

  it('should contain a named slot with multiline description', () => {
    const item = component.slots.find((item) =>
      item.hasOwnProperty('name') && item.name === 'multiline')

    assert.notEqual(item, void 0)
    assert.equal(item.description, 'This\n      is multiline description')
  })

  it('should contain a named slot without description', () => {
    const item = component.slots.find(
      (item) => item.name === 'undescribed')

    assert.notEqual(item, void 0)
    assert.equal(item.description, null)
  })
}

describe('component.events (es6)', () => testComponentEvents(options))

describe('component.events (commonjs)', () => testComponentEvents(optionsForModuleExports))

describe('component.events_filesource', () => testComponentEvents(optionsWithFileSource))

function testComponentEvents (optionsToParse) {
  let component = {}

  parser.parse(options)
    .then((_component) => (component = _component))
    .catch((err) => { throw err })

  it('should contain event with literal name', () => {
    const item = component.events.find((item) => item.name === 'loaded')

    assert.notEqual(item, void 0)
    assert.equal(item.description, 'Emit when the component has been loaded')
  })

  it('should contain event with identifier name', () => {
    const item = component.events.find((item) => item.name === 'check')

    assert.notEqual(item, void 0)
    assert.equal(item.description, 'Event with identifier name')
  })

  it('should contain event with renamed identifier name', () => {
    const item = component.events.find((item) => item.name === 'renamed')

    assert.notEqual(item, void 0)
    assert.equal(item.description, 'Event with renamed identifier name')
  })

  it('should contain event with recursive identifier name', () => {
    const item = component.events.find((item) => item.name === 'recursive')

    assert.notEqual(item, void 0)
    assert.equal(item.description, 'Event with recursive identifier name')
  })

  it('should contain event with spread syntax', () => {
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
      `
    }

    const event = {
      name: 'change',
      description: 'Fires when the card is changed.',
      keywords: [],
      visibility: 'public'
    }

    return parser.parse(options).then((component) => {
      assert.deepEqual(component.events, [ event ])
    })
  })
}

describe('component.methods (es6)', () => testComponentMethods(options))

describe('component.methods (commonjs)', () => testComponentMethods(optionsForModuleExports))

describe('component.methods_filesource', () => testComponentMethods(optionsWithFileSource))

function testComponentMethods (optionsToParse) {
  let component = {}

  parser.parse(options)
    .then((_component) => (component = _component))
    .catch((err) => {
      throw err
    })

  it('should contain a method', () => {
    const item = component.methods.find(
      (item) => item.name === 'check')

    assert.notEqual(item, void 0)
    assert.equal(item.description, 'Check the checkbox')
  })

  it('should contain a protected method', () => {
    const item = component.methods.find(
      (item) => item.visibility === 'protected')

    assert.notEqual(item, void 0)
  })

  it('should contain a private method', () => {
    const item = component.methods.find(
      (item) => item.visibility === 'private')

    assert.notEqual(item, void 0)
  })

  it('should contain un uncommented method', () => {
    const item = component.methods.find(
      (item) => item.description === null)

    assert.notEqual(item, void 0)
  })
}

describe('component.methods_visibility_default', () => {
  let component = {}

  parser.parse({
    filename: f('checkboxMethods.vue'),
    encoding: 'utf8'
  })
    .then((_component) => (component = _component))
    .catch((err) => {
      throw err
    })

  it('public method should be public', () => {
    const item = component.methods.find(
      (item) => item.name === 'publicMethod')
    assert.equal(item.visibility, 'public')
  })

  it('uncommented method should be public', () => {
    const item = component.methods.find(
      (item) => item.name === 'uncommentedMethod')
    assert.equal(item.visibility, 'public')
  })

  it('default method should be public', () => {
    const item = component.methods.find(
      (item) => item.name === 'defaultMethod')
    assert.equal(item.visibility, 'public')
  })
})

describe('component.methods_visibility_private', () => {
  let component = {}

  parser.parse({
    filename: f('checkboxMethods.vue'),
    encoding: 'utf8',
    defaultMethodVisibility: 'private'
  })
    .then((_component) => (component = _component))
    .catch((err) => {
      throw err
    })

  it('public method should be public', () => {
    const item = component.methods.find(
      (item) => item.name === 'publicMethod')
    assert.equal(item.visibility, 'public')
  })

  it('uncommented method should not exist', () => {
    const item = component.methods.find(
      (item) => item.name === 'uncommentedMethod')
    assert.equal(item, undefined)
  })

  it('default method should not exist', () => {
    const item = component.methods.find(
      (item) => item.name === 'defaultMethod')
    assert.equal(item, undefined)
  })
})
