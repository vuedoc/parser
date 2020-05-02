const EventEmitter = require('events')
const { parse } = require('path')

const { ScriptParser } = require('./ScriptParser')
const { MarkupTemplateParser } = require('./MarkupTemplateParser')

const { NameEntry } = require('../entity/NameEntry')
const { Features } = require('../Enum')

const SUPPORTED_FEATURES = Object.values(Features)

const DEFAULT_OPTIONS = Object.freeze({
  range: false,
  comment: true,
  attachComment: true,
  tokens: true,
  ecmaVersion: 10,
  sourceType: 'module',
  locations: false,
  allowReserved: true,
  allowImportExportEverywhere: true,
  allowAwaitOutsideFunction: true,
  allowHashBang: true
})

class Parser extends EventEmitter {
  constructor (options) {
    super()

    this.options = { ...DEFAULT_OPTIONS, ...options }

    Parser.validateOptions(this.options)

    this.features = this.options.features || SUPPORTED_FEATURES
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
    let hasNameEntry = false

    if (this.features.includes(Features.name)) {
      this.on(Features.name, () => {
        hasNameEntry = true
      })
    }

    process.nextTick(() => {
      if (this.options.source.script) {
        new ScriptParser(this, this.options.source.script).parse()
      }

      if (this.options.source.template) {
        new MarkupTemplateParser(this, this.options.source.template).parse()
      }

      if (!hasNameEntry) {
        if (this.features.includes(Features.name)) {
          this.parseComponentName()
        }
      }

      this.emit('end')
    })

    return this
  }

  parseComponentName () {
    if (this.options.filename) {
      const entry = new NameEntry()

      entry.value = parse(this.options.filename).name

      this.emit(entry.kind, entry)
    }
  }
}

Parser.SUPPORTED_FEATURES = SUPPORTED_FEATURES

module.exports.Parser = Parser
