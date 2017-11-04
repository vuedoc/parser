'use strict'

const fs = require('fs')
const cheerio = require('cheerio')

const Parser = require('./lib/parser')

const DEFAULT_ENCODING = 'utf8'
const DEFAULT_IGNORED_VISIBILITIES = ['protected', 'private']

module.exports.parseOptions = (options) => {
  if (!options || (!options.filename && !options.filecontent)) {
    throw new Error('One of options.filename or options.filecontent is required')
  }

  options.encoding = options.encoding || DEFAULT_ENCODING
  options.ignoredVisibilities = options.ignoredVisibilities || DEFAULT_IGNORED_VISIBILITIES
}

module.exports.parse = (options) => new Promise((resolve) => {
  this.parseOptions(options)

  if (!options.source) {
    if (options.filename) {
      options.source = loadSourceFromFileContent(
        fs.readFileSync(options.filename, options.encoding))
    } else {
      options.source = loadSourceFromFileContent(options.filecontent)
    }
  }

  const component = {}

  const walker = new Parser(options).walk()

  walker.features.forEach((feature) => {
    switch (feature) {
      case 'name':
      case 'description':
        component[feature] = null
        break

      default:
        component[feature] = []
    }
  })

  walker
    .on('name', (name) => (component.name = name))
    .on('description', (desc) => (component.description = desc))
    .on('keywords', (keywords) => (component.keywords = keywords))
    .on('props', (prop) => component.props.push(prop))
    .on('data', (data) => component.data.push(data))
    .on('computed', (prop) => component.computed.push(prop))
    .on('methods', (method) => component.methods.push(method))
    .on('slot', (slot) => component.slots.push(slot))
    .on('event', (event) => component.events.push(event))
    .on('end', () => {
      walker.features.forEach((feature) => {
        if (component[feature] instanceof Array) {
          component[feature] = component[feature].filter((item) => {
            return !options.ignoredVisibilities.includes(item.visibility)
          })
        }
      })

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
