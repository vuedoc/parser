'use strict'

const parser = require('..')
const assert = require('assert')
const path = require('path')

const options = {
  filename: path.join(__dirname, 'fixtures/checkbox.vue'),
  encoding: 'utf8'
}

/* global describe it */

describe('options', () => {
  it('should faild to parse with missing options.filename', (done) => {
    parser.parse({})
      .catch((err) => {
        assert.ok(/required/.test(err.message))
        done()
      })
  })

  it('should parse with default options.encoding', (done) => {
    const _options = {}

    Object.assign(_options, options)

    delete _options.encoding

    parser.parse(_options)
      .then(() => done())
      .catch(done)
  })

  it('should faild with missing options.filename', (done) => {
    parser.parse({})
      .catch((err) => {
        assert.ok(/required/.test(err.message))
        done()
      })
  })
})

describe('component', () => {
  let component = {}

  it('should parse without error', (done) => {
    parser.parse(options)
      .then((_component) => {
        component = _component
        done()
      })
      .catch(done)
  })

  it('should have a name', () =>
    assert.equal(component.name, 'checkbox'))

  it('should have a description', () =>
    assert.equal(component.description, 'A simple checkbox component'))
})

describe('component.props', () => {
  let component = {}

  parser.parse(options)
    .then((_component) => (component = _component))
    .catch((err) => {
      throw err
    })

  it('should contain an entry.v-model with a description', () => {
    const item = component.props.find((item) =>
      item.hasOwnProperty('entry') &&
      item.entry.hasOwnProperty('v-model'))

    assert.notEqual(typeof item, 'undefined')
    assert.equal(item.entry['v-model'].type, 'Array')
    assert.equal(item.entry['v-model'].required, true)
    assert.equal(item.entry['v-model'].twoWay, true)
    assert.equal(item.description, 'The checkbox model')
  })

  it('should contain an entry.disabled with comments', () => {
    const item = component.props.find((item) =>
      item.hasOwnProperty('entry') &&
      item.entry.hasOwnProperty('disabled'))

    assert.notEqual(typeof item, 'undefined')
    assert.equal(item.entry.disabled, 'Boolean')
    assert.equal(item.description, 'Initial checkbox state')
  })

  it('should contain an entry.checked with default value and comments', () => {
    const item = component.props.find((item) =>
      item.hasOwnProperty('entry') &&
      item.entry.hasOwnProperty('checked'))

    assert.notEqual(typeof item, 'undefined')
    assert.equal(item.entry.checked.type, 'Boolean')
    assert.equal(item.entry.checked.default, true)
    assert.equal(item.description, 'Initial checkbox value')
  })
})

describe('component.slots', () => {
  let component = {}

  parser.parse(options)
    .then((_component) => (component = _component))
    .catch((err) => {
      throw err
    })

  it('should contain a default slot', () => {
    const item = component.slots.find((item) =>
      item.hasOwnProperty('name') && item.name === 'default')

    assert.notEqual(typeof item, 'undefined')
    assert.equal(item.description, 'Default slot')
  })

  it('should contain a named slot', () => {
    const item = component.slots.find((item) =>
      item.hasOwnProperty('name') && item.name === 'label')

    assert.notEqual(typeof item, 'undefined')
    assert.equal(item.description, 'Use this slot to set the checkbox label')
  })

  it('should contain a named slot with multiline description', () => {
    const item = component.slots.find((item) =>
      item.hasOwnProperty('name') && item.name === 'multiline')

    assert.notEqual(typeof item, 'undefined')
    assert.equal(item.description, 'This\n    is multiline description')
  })

  it('should contain a named slot without description', () => {
    const item = component.slots.find(
      (item) => item.name === 'undescribed')

    assert.notEqual(typeof item, 'undefined')
    assert.equal(item.description, null)
  })
})

describe('component.events', () => {
  let component = {}

  parser.parse(options)
    .then((_component) => (component = _component))
    .catch((err) => { throw err })

  it('should contain event with literal name', () => {
    const item = component.events.find((item) =>
      item.name === 'loaded')

    assert.notEqual(typeof item, 'undefined')
    assert.equal(item.description, 'Emit when the component has been loaded')
  })

  it('should contain event with identifier name', () => {
    const item = component.events.find((item) =>
      item.name === 'check')

    assert.notEqual(typeof item, 'undefined')
    assert.equal(item.description, 'Event with identifier name')
  })

  it('should contain event with renamed identifier name', () => {
    const item = component.events.find((item) =>
      item.name === 'renamed')

    assert.notEqual(typeof item, 'undefined')
    assert.equal(item.description, 'Event with renamed identifier name')
  })

  it('should contain event with recursive identifier name', () => {
    const item = component.events.find((item) =>
      item.name === 'recursive')

    assert.notEqual(typeof item, 'undefined')
    assert.equal(item.description, 'Event with recursive identifier name')
  })
})

describe('component.methods', () => {
  let component = {}

  parser.parse(options)
    .then((_component) => (component = _component))
    .catch((err) => {
      throw err
    })

  it('should contain a method', () => {
    const item = component.methods.find(
      (item) => item.name === 'check')

    assert.notEqual(typeof item, 'undefined')
    assert.equal(item.description, 'Check the checkbox')
  })

  it('should contain a private method', () => {
    const item = component.methods.find(
      (item) => item.visibility === 'private')

    assert.notEqual(typeof item, 'undefined')
  })
})
