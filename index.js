'use strict'

const compiler = require('vue-template-compiler')
const fs = require('fs')

const Parser = require('./lib/parser')

const DEFAULT_ENCODING = 'utf8'

module.exports.parse = (options) => new Promise((resolve) => {
  if (!options || !options.filename) {
    throw new Error('options.filename is required')
  }

  options.encoding = options.encoding || DEFAULT_ENCODING

  const source = compiler.parseComponent(
    fs.readFileSync(options.filename, options.encoding))

  options.source = options.source || source.script.content
  options.template = options.template || source.template.content

  const component = {
    name: null,
    description: null,
    props: [],
    methods: [],
    events: [],
    slots: []
  }

  new Parser(options).walk()
    .on('name', (name) => (component.name = name))
    .on('description', (desc) => (component.description = desc))
    .on('props', (prop) => component.props.push(prop))
    .on('methods', (method) => component.methods.push(method))
    .on('slot', (slot) => component.slots.push(slot))
    .on('event', (event) => component.events.push(event))
    .on('end', () => resolve(component))
})
