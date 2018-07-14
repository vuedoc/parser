'use strict'

const EventEmitter = require('events')
const espree = require('espree')
const HtmlParser = require('htmlparser2').Parser
const path = require('path')
const utils = require('./utils')
const jsdoc = require('./jsdoc')

const DEFAULT_OPTIONS = {
  range: false,
  // comment: true,
  attachComment: true,

  // create a top-level tokens array containing all tokens
  tokens: true,

  // The version of ECMAScript syntax to use
  ecmaVersion: 9,

  // Type of script to parse
  sourceType: 'module',

  ecmaFeatures: {
    experimentalObjectRestSpread: true
  }
}

const SUPPORTED_FEATURES = [
  'name', 'description', 'keywords', 'slots',
  'props', 'data', 'computed', 'events', 'methods'
]

const EVENT_EMIT_RE = /^\$emit\(['"](.+)['"]/

class Parser extends EventEmitter {
  constructor (options) {
    options = Object.assign({}, DEFAULT_OPTIONS, options)

    Parser.validateOptions(options)

    super()

    this.source = options.source
    this.features = options.features || SUPPORTED_FEATURES

    if (options.source.hasOwnProperty('script') && options.source.script) {
      try {
        this.ast = espree.parse(options.source.script, options)
      } catch (e) {
        const script = utils.escapeImportKeyword(options.source.script)

        this.ast = espree.parse(script, options)
      }
    } else {
      this.ast = null
    }

    this.componentName = null
    this.template = options.source.template
    this.filename = options.filename
    this.eventsEmmited = {}
    this.defaultMethodVisibility = options.defaultMethodVisibility
    this.identifiers = {}
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
      ? feature.substring(0, feature.length - 1)
      : feature
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

      if (p.type === 'ExperimentalSpreadProperty') {
        if (p.argument.name in this.identifiers) {
          const value = this.identifiers[p.argument.name]
          const spreadProperty = Object.assign({}, property, { value })

          return this.parseObjectExpression(spreadProperty)
        } else {
          return
        }
      }

      entry.value = utils.value(p)
      entry.name = Object.keys(entry.value)[0]
      entry.value = entry.value[entry.name]

      if (property.key.name === 'computed') {
        if (entry.value instanceof utils.NodeFunction) {
          entry.dependencies = utils.getDependencies(
            entry.value, this.source.script)
        } else {
          const value = entry.value
          const NodeFunction = utils.NodeFunction

          if (value instanceof Object && value.get instanceof NodeFunction) {
            entry.dependencies = utils.getDependencies(
              entry.value.get, this.source.script)
          } else {
            entry.dependencies = []
          }
        }

        delete entry.value
      } else if (entry.value instanceof utils.NodeFunction) {
        entry.args = entry.value.params.map((param) => param.name)
      } else if (property.key.name === 'props') {
        if (entry.describeModel) {
          entry.name = 'v-model'
        } else {
          entry.name = utils.unCamelcase(entry.name)
        }
      }

      delete entry.describeModel

      this.parseKeywords(entry.keywords, entry)
      this.emit(eventName, entry)
      this.subWalk(entry.value)
    })
  }

  parseArrayExpression (property) {
    if (!this.features.includes(property.key.name)) {
      return
    }
    const defaultVisibility = utils.DEFAULT_VISIBILITY

    const eventName = Parser.getEventName(property.key.name)

    property.value.elements.forEach((p) => {
      const entry = utils.getComment(p, defaultVisibility)

      entry.name = p.value
      entry.type = jsdoc.DEFAULT_TYPE

      delete entry.describeModel

      this.emit(eventName, entry)
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

      case 'ArrayExpression':
        this.parseArrayExpression(property)
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
        this.parseTemplate()
      }

      if (this.ast === null) {
        if (this.features.includes('name')) {
          this.parseComponentName()
        }

        return this.emit('end')
      }

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
            this.identifiers[body.declarations[0].id.name] = body.declarations[0].init
          }
          return
        }

        if (body.declaration) {
          switch (body.declaration.type) {
            case 'ObjectExpression':
              body.declaration.properties.forEach((property) => this.extractProperties(property))
              break

            case 'Identifier':
              if (this.identifiers.hasOwnProperty(body.declaration.name)) {
                this.identifiers[body.declaration.name].properties.forEach((property) => this.extractProperties(property))
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
            const comment = utils.parseComment(event.description.value)

            event.visibility = comment.visibility
            event.description = comment.description
            event.keywords = comment.keywords

            const keyword = comment.keywords.find((keyword) => {
              return keyword.name === 'event'
            })

            if (keyword) {
              if (!keyword.description) {
                this.emit('error', new Error('Missing keyword value for @event'))
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
                event.name = utils.getIdentifierValue(
                  tokens, next.value, next.range[0])

                if (typeof event.name === 'object') {
                  event.name = utils.getIdentifierValueFromStart(
                    this.ast.tokens, event.name.notFoundIdentifier)
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

          this.parseKeywords(event.keywords, event)
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
          if (this.features.includes('slots')) {
            this.emit('slot', {
              name: attrs.name || 'default',
              description: lastComment
            })
          }
        } else if (this.features.includes('events')) {
          Object.keys(attrs)
            .map((name) => attrs[name])
            .map((value) => EVENT_EMIT_RE.exec(value))
            .filter((result) => result !== null)
            .map((matches) => ({ name: matches[1] }))
            .forEach((event) => {
              if (lastComment) {
                lastComment = `/** ${lastComment} */`
              }

              const comment = utils.parseComment(lastComment || '')

              event.visibility = comment.visibility
              event.description = comment.description
              event.keywords = comment.keywords

              this.parseKeywords(comment.keywords, event)
              this.emit('event', event)

              lastComment = null
            })

          lastComment = null
        }
      }
    })

    parser.write(this.template)
    parser.end()
  }

  parseKeywords (keywords = [], event) {
    event.params = []

    keywords.forEach(({ name, description }) => {
      switch (name) {
        case 'arg':
        case 'param':
        case 'argument':
          event.params.push(jsdoc.parseParamKeyword(description))
          break

        case 'return':
        case 'returns':
          event.return = jsdoc.parseReturnKeyword(description)
          break
      }
    })

    if (event.params.length === 0) {
      delete event.params
    }
  }
}

module.exports = Parser
module.exports.SUPPORTED_FEATURES = SUPPORTED_FEATURES
