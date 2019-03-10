const EventEmitter = require('events')
const { parse } = require('path')

const utils = require('../utils')

const { ScriptParser } = require('./ScriptParser')
const { TemplateParser } = require('./TemplateParser')
const { SUPPORTED_FEATURES } = require('../Enum')

const DEFAULT_OPTIONS = Object.freeze({
  range: false,
  comment: true,
  attachComment: true,
  tokens: true,
  ecmaVersion: 10,
  sourceType: 'module',
  locations: false,
  allowImportExportEverywhere: true,
  allowAwaitOutsideFunction: true,
  allowHashBang: true
})

class Parser extends EventEmitter {
  constructor (options) {
    options = { ...DEFAULT_OPTIONS, ...options }

    Parser.validateOptions(options)

    super()

    this.options = options
    this.features = options.features || SUPPORTED_FEATURES
    this.script = options.source.script
    this.template = options.source.template
    this.filename = options.filename
    this.eventsEmmited = {}
    this.defaultMethodVisibility = options.defaultMethodVisibility
    this.scope = {}
  }

  static validateOptions (options) {
    if (!options.source) {
      throw new Error('options.source is required')
    }

    if (options.features) {
      if (!Array.isArray(options.features)) {
        throw new TypeError('options.features must be an array')
      }

      options.features.forEach((feature) => {
        if (!SUPPORTED_FEATURES.includes(feature)) {
          throw new Error(`Unknow '${feature}' feature. Supported features: ${JSON.stringify(SUPPORTED_FEATURES)}`)
        }
      })
    }
  }

  static getEventName (feature) {
    return feature.endsWith('s')
      ? feature.substring(0, feature.length - 1)
      : feature
  }

  walk () {
    process.nextTick(() => {
      if (this.script) {
        new ScriptParser(this).parse()
      }

      if (this.template) {
        new TemplateParser(this).parse()
      }

      this.emit('end')
    })
  }

  parseComponentName () {
    if (this.componentName === null) {
      if (this.filename) {
        this.componentName = parse(this.filename).name
      }
    }

    if (this.componentName) {
      this.emit('name', utils.unCamelcase(this.componentName))
    }
  }
}

module.exports.Parser = Parser
module.exports.SUPPORTED_FEATURES = SUPPORTED_FEATURES
