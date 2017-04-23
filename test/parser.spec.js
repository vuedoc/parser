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
  })

  it('should faild with missing options.filename', (done) => {
    parser.parse({})
      .catch((err) => {
        assert.ok(/required/.test(err.message))
        done()
      })
  })

  it('should do not have a title with options.ignoreName', (done) => {
    const _options = {}

    Object.assign(_options, options)

    _options.ignoreName = true

    parser.parse(_options)
      .then((component) => {
        const item = component.header.find((item) =>
          item.hasOwnProperty('entry') &&
          item.entry.hasOwnProperty('name'))

        assert.equal(item.entry.name, null)
        done()
      })
  })

  it('should do not have a description with options.ignoreDescription', (done) => {
    const _options = {}

    Object.assign(_options, options)

    _options.ignoreDescription = true

    parser.parse(_options)
      .then((component) => {
        const item = component.header.find((item) =>
          item.hasOwnProperty('entry') &&
          item.entry.hasOwnProperty('name'))

        assert.equal(item.comments.length, 0)
        done()
      })
  })
})

describe('component.header', () => {
  let component = {}

  it('should parse without error', (done) => {
    parser.parse(options)
      .then((_component) => {
        component = _component
        done()
      })
      .catch((err) => done(err))
  })

  it('should contain an entry.name', () => {
    const item = component.header.find((item) =>
      item.hasOwnProperty('entry') &&
      item.entry.hasOwnProperty('name'))

    assert.notEqual(typeof item, 'undefined')
    assert.equal(item.entry.name, 'checkbox')
  })

  it('should contain an entry.comments', () => {
    const item = component.header.find(
      (item) => item.hasOwnProperty('comments'))

    assert.notEqual(typeof item, 'undefined')
    assert.equal(item.comments.length, 1)
    assert.equal(item.comments[0], 'A simple checkbox component')
  })
})

describe('component.props', () => {
  let component = {}

  parser.parse(options)
    .then((_component) => (component = _component))
    .catch((err) => {
      throw err
    })

  it('should contain an entry.model with comments', () => {
    const item = component.props.find((item) =>
      item.hasOwnProperty('entry') &&
      item.entry.hasOwnProperty('model'))

    assert.notEqual(typeof item, 'undefined')
    assert.deepStrictEqual(item.entry.model, {
      type: 'Array', required: true, twoWay: true
    })

    assert.notEqual(typeof item.comments, 'undefined')
    assert.equal(item.comments.length, 1)
    assert.equal(item.comments[0], 'The checbox model')
  })

  it('should contain an entry.disabled with comments', () => {
    const item = component.props.find((item) =>
      item.hasOwnProperty('entry') &&
      item.entry.hasOwnProperty('disabled'))

    assert.notEqual(typeof item, 'undefined')
    assert.equal(item.entry.disabled, 'Boolean')

    assert.notEqual(typeof item.comments, 'undefined')
    assert.equal(item.comments.length, 1)
    assert.equal(item.comments[0], 'Initial checbox state')
  })

  it('should contain an entry.checked with default value and comments', () => {
    const item = component.props.find((item) =>
      item.hasOwnProperty('entry') &&
      item.entry.hasOwnProperty('checked'))

    assert.notEqual(typeof item, 'undefined')
    assert.equal(item.entry.checked.type, 'Boolean')
    assert.equal(item.entry.checked.default, true)

    assert.notEqual(typeof item.comments, 'undefined')
    assert.equal(item.comments.length, 1)
    assert.equal(item.comments[0], 'Initial checbox value')
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
    assert.notEqual(typeof item.comments, 'undefined')
    assert.equal(item.comments.length, 0)
  })

  it('should contain a nammed slot', () => {
    const item = component.slots.find((item) =>
      item.hasOwnProperty('name') && item.name !== 'default')

    assert.notEqual(typeof item, 'undefined')
    assert.equal(item.name, 'label')

    assert.notEqual(typeof item.comments, 'undefined')
    assert.equal(item.comments.length, 1)
    assert.equal(item.comments[0], 'Use this slot to set the checbox label')
  })
})

describe('component.events', () => {
  let component = {}

  parser.parse(options)
    .then((_component) => (component = _component))
    .catch((err) => {
      throw err
    })

  it('should contain event', () => {
    const item = component.events.find((item) =>
      item.hasOwnProperty('name'))

    assert.notEqual(typeof item, 'undefined')
    assert.equal(item.name, 'loaded')
    assert.notEqual(typeof item.comments, 'undefined')
    assert.equal(item.comments.length, 1)
    assert.equal(item.comments[0], 'Emit when the component has been loaded')
  })
})

describe('component.methods', () => {
  let component = {}

  parser.parse(options)
    .then((_component) => (component = _component))
    .catch((err) => {
      throw err
    })

  it('should contain event', () => {
    const item = component.methods.find((item) =>
      item.hasOwnProperty('entry'))

    assert.notEqual(typeof item, 'undefined')
    assert.equal(item.entry.check.type, 'FunctionExpression')
    assert.notEqual(typeof item.comments, 'undefined')
    assert.equal(item.comments.length, 1)
    assert.equal(item.comments[0], 'Check the checbox')
  })
})
