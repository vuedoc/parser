const { extname } = require('path')

const { Loader } = require('./lib/loader/Loader')
const { VueLoader } = require('./lib/loader/VueLoader')
const { HtmlLoader } = require('./lib/loader/HtmlLoader')
const { JavaScriptLoader } = require('./lib/loader/JavaScriptLoader')

const { Parser } = require('./lib/parser/Parser')
const { Features } = require('./lib/Enum')

const DEFAULT_ENCODING = 'utf8'
const DEFAULT_IGNORED_VISIBILITIES = [ 'protected', 'private' ]

const DEFAULT_LOADERS = [
  Loader.extend('js', JavaScriptLoader),
  Loader.extend('html', HtmlLoader),
  Loader.extend('vue', VueLoader)
]

module.exports.parseOptions = (options) => {
  if (!options) {
    /* eslint-disable max-len */
    throw new Error('Missing options argument')
  }

  if (!options.filename && !options.filecontent) {
    /* eslint-disable max-len */
    throw new Error('One of options.filename or options.filecontent is required')
  }

  if (!options.encoding) {
    options.encoding = DEFAULT_ENCODING
  }

  if (!options.ignoredVisibilities) {
    options.ignoredVisibilities = DEFAULT_IGNORED_VISIBILITIES
  }

  if (!Array.isArray(options.loaders)) {
    options.loaders = [ ...DEFAULT_LOADERS ]
  } else {
    options.loaders.push(...DEFAULT_LOADERS)
  }

  options.source = {
    template: '',
    script: '',
    errors: []
  }

  if (options.filename) {
    const ext = extname(options.filename)
    const loaderName = ext.substring(1)
    const LoaderClass = Loader.get(loaderName, options)
    const source = Loader.getFileContent(options.filename, options)

    new LoaderClass(options).load(source)
  } else {
    new VueLoader(options).load(options.filecontent)
  }
}

module.exports.parse = (options) => new Promise((resolve) => {
  this.parseOptions(options)

  const component = {}
  const parser = new Parser(options)

  if (options.source.errors.length) {
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
