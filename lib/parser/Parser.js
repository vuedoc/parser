const path = require('path')
const EventEmitter = require('events')

const { ScriptParser } = require('./ScriptParser')
const { MarkupTemplateParser } = require('./MarkupTemplateParser')

const { NameEntry } = require('../entity/NameEntry')
const { Features, FeaturesList } = require('../Enum')

class Parser extends EventEmitter {
  constructor (options) {
    super()

    this.options = options
    this.features = this.options.features || FeaturesList
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
        if (!FeaturesList.includes(feature)) {
          throw new Error(`Unknow '${feature}' feature. Supported features: ${JSON.stringify(FeaturesList)}`)
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
    Parser.validateOptions(this.options)

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

      entry.value = path.parse(this.options.filename).name

      this.emit(entry.kind, entry)
    }
  }
}

Parser.SUPPORTED_FEATURES = FeaturesList

module.exports.Parser = Parser
