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
  const parser = new Parser(options)

  parser.features.forEach((feature) => {
    switch (feature) {
      case 'name':
      case 'description':
        component[feature] = null
        parser.on(feature, (value) => (component[feature] = value))
        break

      case 'keywords':
        component[feature] = []
        parser.on(feature, (value) => (component[feature] = value))
        break

      default:
        component[feature] = []

        const eventName = Parser.getEventName(feature)

        parser.on(eventName, (value) => (component[feature].push(value)))
    }
  })

  parser.on('end', () => {
    parser.features.forEach((feature) => {
      if (component[feature] instanceof Array) {
        component[feature] = component[feature].filter((item) => {
          return !options.ignoredVisibilities.includes(item.visibility)
        })
      }
    })

    resolve(component)
  })

  parser.walk()
})

function loadSourceFromFileContent (filecontent) {
  const $ = cheerio.load(filecontent)
  return {
    template: $('template').html(),
    script: $('script').html()
  }
}
