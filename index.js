const { parseComponent } = require('vue-template-compiler')

const { extname } = require('path')
const { readFileSync } = require('fs')

const { Parser } = require('./lib/parser/Parser')
const { Features } = require('./lib/Enum')

const DEFAULT_ENCODING = 'utf8'
const DEFAULT_IGNORED_VISIBILITIES = [ 'protected', 'private' ]

function loadSourceFromFileContent (filecontent) {
  const result = parseComponent(filecontent)

  if (result.script) {
    if (result.script.attrs.type && result.script.attrs.type !== 'js') {
      throw new Error('Only JavaScript script are supported')
    }
  }

  return {
    template: result.template ? result.template.content : '',
    script: result.script ? result.script.content : '',
    errors: result.errors
  }
}

module.exports.parseOptions = (options) => {
  if (!options || (!options.filename && !options.filecontent)) {
    /* eslint-disable max-len */
    throw new Error('One of options.filename or options.filecontent is required')
  }

  if (!options.encoding) {
    options.encoding = DEFAULT_ENCODING
  }

  if (!options.ignoredVisibilities) {
    options.ignoredVisibilities = DEFAULT_IGNORED_VISIBILITIES
  }
}

module.exports.parse = (options) => new Promise((resolve) => {
  this.parseOptions(options)

  if (!options.source) {
    if (options.filename) {
      const ext = extname(options.filename)

      switch (ext) {
        case '.js':
          options.source = {
            script: readFileSync(options.filename, options.encoding)
          }
          break

        case '.vue': {
          const filecontent = readFileSync(options.filename, options.encoding)

          options.source = loadSourceFromFileContent(filecontent)

          break
        }

        default:
          throw new Error('Only .js and .vue files are supported')
      }
    } else {
      options.source = loadSourceFromFileContent(options.filecontent)
    }
  }

  const component = {}
  const parser = new Parser(options)

  if (options.source.errors instanceof Array && options.source.errors.length) {
    component.errors = options.source.errors
  }

  parser.on('error', ({ message }) => {
    if (!component.errors) {
      component.errors = []
    }

    component.errors.push(message)
  })

  parser.on('end', () => {
    parser.features.forEach((feature) => {
      if (component[feature] instanceof Array) {
        /* eslint-disable-next-line arrow-body-style */
        component[feature] = component[feature].filter((item) => {
          return !options.ignoredVisibilities.includes(item.visibility)
        })
      }
    })

    resolve(component)
  })

  parser.features.forEach((feature) => {
    switch (feature) {
      case Features.name:
      case Features.description:
        component[feature] = null

        parser.on(feature, ({ value }) => {
          component[feature] = value
        })
        break

      case Features.keywords:
        component[feature] = []

        parser.on(feature, ({ value }) => {
          component[feature] = value
        })
        break

      default: {
        const eventName = Parser.getEventName(feature)

        component[feature] = []

        parser.on(eventName, (entry) => component[feature].push(entry))
      }
    }
  })

  parser.walk()
})
