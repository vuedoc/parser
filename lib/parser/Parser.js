const EventEmitter = require('events')
const { parse } = require('path')

const { ScriptParser } = require('./ScriptParser')
const { TemplateParser } = require('./TemplateParser')

const { NameEntry } = require('../entity/NameEntry')
const { FEATURE_NAME, SUPPORTED_FEATURES } = require('../Enum')

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
    this.hasNameEntry = false
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
    if (this.features.includes(FEATURE_NAME)) {
      this.on(FEATURE_NAME, () => {
        this.hasNameEntry = true
      })
    }

    process.nextTick(() => {
      if (this.script) {
        new ScriptParser(this).parse()
      }

      if (this.template) {
        new TemplateParser(this).parse()
      }

      if (!this.hasNameEntry) {
        if (this.features.includes(FEATURE_NAME)) {
          this.parseComponentName()
        }
      }

      this.emit('end')
    })

    return this
  }

  parseComponentName () {
    if (this.filename) {
      const entry = new NameEntry()

      entry.value = parse(this.filename).name

      this.emit(entry.kind, entry)
    }
  }
}

Parser.SUPPORTED_FEATURES = SUPPORTED_FEATURES

module.exports.Parser = Parser
