'use strict'

const EventEmitter = require('events')
const espree = require('espree')
const HtmlParser = require('htmlparser2').Parser
const path = require('path')
const utils = require('./utils')

const DEFAULT_OPTIONS = {
  range: false,
//   comment: true,
  attachComment: true,

  // create a top-level tokens array containing all tokens
  tokens: true,

  // set to 3, 5 (default), 6, 7, or 8 to specify the version of ECMAScript syntax you want to use.
  // You can also set to 2015 (same as 6), 2016 (same as 7), or 2017 (same as 8) to use the year-based naming.
  ecmaVersion: 8,

  // specify which type of script you're parsing (script or module, default is script)
  sourceType: 'module',

  ecmaFeatures: {
    experimentalObjectRestSpread: true
  }
}

const SUPPORTED_FEATURES = [
  'name', 'description', 'keywords', 'slots',
  'props', 'data', 'computed', 'events', 'methods'
]

class Parser extends EventEmitter {
  constructor (options) {
    options = Object.assign({}, DEFAULT_OPTIONS, options)

    Parser.validateOptions(options)

    super()

    this.source = options.source
    this.features = options.features || SUPPORTED_FEATURES

    if (options.source.hasOwnProperty('script') && options.source.script) {
      this.ast = espree.parse(options.source.script, options)
    } else {
      this.ast = null
    }

    this.componentName = null
    this.template = options.source.template
    this.filename = options.filename
    this.eventsEmmited = {}
    this.defaultMethodVisibility = options.defaultMethodVisibility
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
          throw new Error(`Unknow '${feature}' feature. Supported features: ` + JSON.stringify(SUPPORTED_FEATURES))
        }
      })
    }
  }

  static getEventName (feature) {
    return feature.endsWith('s')
      ? feature.substring(0, feature.length - 1) : feature
  }

  parseObjectExpression (property) {
    if (!this.features.includes(property.key.name)) {
      return
    }

    const eventName = Parser.getEventName(property.key.name)

    property.value.properties.forEach((p) => {
      let defaultVisibility = utils.DEFAULT_VISIBILITY

      if (property.key.name === 'methods' && this.defaultMethodVisibility) {
        defaultVisibility = this.defaultMethodVisibility
      }

      const entry = utils.getComment(p, defaultVisibility)

      entry.value = utils.value(p)
      entry.name = Object.keys(entry.value)[0]
      entry.value = entry.value[entry.name]

      if (property.key.name === 'computed') {
        if (entry.value instanceof utils.NodeFunction) {
          entry.dependencies = utils.getDependencies(entry.value, this.source.script)
        } else if (entry.value instanceof Object && entry.value.get instanceof utils.NodeFunction) {
          entry.dependencies = utils.getDependencies(entry.value.get, this.source.script)
        } else {
          entry.dependencies = []
        }
      } else if (entry.value instanceof utils.NodeFunction) {
        entry.params = entry.value.params
      } else if (property.key.name === 'props') {
        if (entry.describeModel) {
          entry.name = 'v-model'
        } else {
          entry.name = utils.unCamelcase(entry.name)
        }
      }

      delete entry.describeModel

      this.emit(eventName, entry)
      this.subWalk(entry.value)
    })
  }

  parseProperty (property) {
    const propertyValue = utils.value(property)

    if (propertyValue.hasOwnProperty('name') && !this.componentName) {
      this.componentName = propertyValue.name
      return
    }

    const entryValue = propertyValue[Object.keys(propertyValue)[0]]

    this.subWalk(entryValue)
  }

  extractProperties (property) {
    switch (property.value.type) {
      case 'FunctionExpression':
        const expression = property.value.body.body.find((p) => {
          return p.type === 'ReturnStatement'
        })

        if (expression) {
          if (expression.argument.type === 'ObjectExpression') {
            return this.parseObjectExpression({
              key: property.key,
              value: expression.argument
            })
          }
        }
        this.parseProperty(property)
        break

      case 'ArrowFunctionExpression':
        if (property.value.body.type === 'ObjectExpression') {
          this.parseObjectExpression({
            key: property.key,
            value: property.value.body
          })
        } else {
          this.parseProperty(property)
        }
        break

      case 'ObjectExpression':
        this.parseObjectExpression(property)
        break

      default:
        this.parseProperty(property)
    }
  }

  parseComponentName () {
    if (this.componentName === null) {
      if (this.filename) {
        this.componentName = path.parse(this.filename).name
      }
    }

    if (this.componentName) {
      this.emit('name', utils.unCamelcase(this.componentName))
    }
  }

  walk () {
    process.nextTick(() => {
      if (this.features.length === 0) {
        return this.emit('end')
      }

      if (this.template) {
        if (this.features.includes('slots')) {
          this.parseTemplate()
        }
      }

      if (this.ast === null) {
        if (this.features.includes('name')) {
          this.parseComponentName()
        }

        return this.emit('end')
      }

      const identifiers = {}

      this.ast.body.forEach((body) => {
        const entry = utils.getComment(body, this.defaultMethodVisibility, this.features)

        if (entry.description) {
          this.emit('description', entry.description)
        }

        if (entry.keywords.length) {
          this.emit('keywords', entry.keywords)
        }

        if (body.type !== 'ExportDefaultDeclaration' && body.type !== 'ExpressionStatement') {
          if (body.type === 'VariableDeclaration') {
            identifiers[body.declarations[0].id.name] = body.declarations[0].init
          }
          return
        }

        if (body.declaration) {
          switch (body.declaration.type) {
            case 'ObjectExpression':
              body.declaration.properties.forEach((property) => this.extractProperties(property))
              break

            case 'Identifier':
              if (identifiers.hasOwnProperty(body.declaration.name)) {
                identifiers[body.declaration.name].properties.forEach((property) => this.extractProperties(property))
              }
              break
          }
        } else if (body.expression !== null && body.expression.right && body.expression.right.properties) {
          body.expression.right.properties.forEach((property) => this.extractProperties(property))
        }

        if (this.features.includes('name')) {
          this.parseComponentName()
        }
      })

      this.emit('end')
    })

    return this
  }

  subWalk (entry) {
    if (entry instanceof utils.NodeFunction) {
      const tokens = utils.tokensInterval(this.ast.tokens, entry.range)

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]

        if (token.type === 'Identifier' && token.value === '$emit') {
          if (!tokens[i + 2]) {
            break
          }

          if (!this.features.includes('events')) {
            continue
          }

          const next = tokens[i + 2]
          const event = {
            name: null,
            description: null,
            visibility: utils.DEFAULT_VISIBILITY,
            keywords: []
          }

          const range = [
            tokens[i - 3].range[1],
            tokens[i - 2].range[0]
          ]

          event.description = this.ast.comments.reverse().find((c) => {
            return c.range[0] > range[0] && c.range[1] < range[1]
          })

          if (event.description) {
            const comment = utils.parseComment(
              event.description.value)

            event.visibility = comment.visibility
            event.description = comment.description
            event.keywords = comment.keywords

            const keyword = comment.keywords.find((keyword) => keyword.name === 'event')

            if (keyword) {
              if (!keyword.description) {
                const error = new Error('Missing keyword value for @event')

                this.emit('error', error)

                continue
              }

              event.name = keyword.description
            }
          }

          if (event.name === null) {
            switch (next.type) {
              case 'String':
                event.name = next.value.replace(/['"]/g, '')
                break

              case 'Identifier':
                event.name = utils.getIdentifierValue(tokens, next.value, next.range[0])

                if (typeof event.name === 'object') {
                  event.name = utils.getIdentifierValueFromStart(this.ast.tokens, event.name.notFoundIdentifier)
                }
                break
            }
          }

          if (!event.name) {
            event.name = '****unhandled-event-name****'
          } else {
            if (this.eventsEmmited.hasOwnProperty(event.name)) {
              continue
            }

            this.eventsEmmited[event.name] = true
          }

          this.emit('event', event)

          i += 2
        }
      }
    }
  }

  parseTemplate () {
    let lastComment = null

    const parser = new HtmlParser({
      oncomment: (data) => {
        lastComment = data.trim()
      },
      ontext: (text) => {
        if (text.trim()) {
          lastComment = null
        }
      },
      onopentag: (name, attrs) => {
        if (name === 'slot') {
          this.emit('slot', {
            name: attrs.name || 'default',
            description: lastComment
          })

          lastComment = null
        }
      }
    })

    parser.write(this.template)
    parser.end()
  }
}

module.exports = Parser
module.exports.SUPPORTED_FEATURES = SUPPORTED_FEATURES
