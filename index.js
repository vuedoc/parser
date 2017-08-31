'use strict'

const fs = require('fs')

const Parser = require('./lib/parser')
const cheerio = require('cheerio')

const DEFAULT_ENCODING = 'utf8'
const DEFAULT_IGNORED_VISIBILITIES = ['protected', 'private']

const parseOptions = function (options) {
  if (!options || (!options.filename && !options.filecontent)) {
    throw new Error('One of options.filename or options.filecontent is required')
  }

  options.encoding = options.encoding || DEFAULT_ENCODING
  options.ignoredVisibilities = options.ignoredVisibilities || DEFAULT_IGNORED_VISIBILITIES
}

module.exports.parse = (options) => new Promise((resolve) => {
  parseOptions(options)

  if (!options.source) {
    if (options.filename) {
      options.source = loadSourceFromFileContent(
        fs.readFileSync(options.filename, options.encoding))
    } else {
      options.source = loadSourceFromFileContent(options.filecontent)
    }
  }

  const filterIgnoredVisibilities = (item) => {
    return options.ignoredVisibilities.indexOf(item.visibility) === -1
  }

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
    .on('end', () => {
      component.props = component.props.filter(filterIgnoredVisibilities)
      component.methods = component.methods.filter(filterIgnoredVisibilities)
      component.events = component.events.filter(filterIgnoredVisibilities)

      resolve(component)
    })
})

function loadSourceFromFileContent (filecontent) {
  const $ = cheerio.load(filecontent)
  return {
    template: $('template').html(),
    script: $('script').html()
  }
}
