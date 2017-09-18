'use strict'

const EventEmitter = require('events')
const espree = require('espree')
const HtmlParser = require('htmlparser2').Parser
const path = require('path')

const RE_VISIBILITY = /(public|protected|private)/
const RE_KEYWORDS = /@\**\s*([a-z0-9_-]+)(\s+(-\s+)?([\wÀ-ÿ\s*{}[\]()='"`_^$#&²~|\\£¤€%µ,?;.:/!§<>+¨-]+))?/ig

const DEFAULT_VISIBILITY = 'public'
const MODEL_KEYWORD = 'model'
const DEFAULT_OPTIONS = {
  range: false,
//   comment: true,
  attachComment: true,

  // create a top-level tokens array containing all tokens
  tokens: true,

  // set to 3, 5 (default), 6, 7, or 8 to specify the version of ECMAScript syntax you want to use.
  // You can also set to 2015 (same as 6), 2016 (same as 7), or 2017 (same as 8) to use the year-based naming.
  ecmaVersion: 7,

  // specify which type of script you're parsing (script or module, default is script)
  sourceType: 'module'
}

const getVisibility = (keywords, defaultVisibility) => {
  const keyword = keywords.find((keyword) => RE_VISIBILITY.test(keyword.name))

  if (keyword) {
    return keyword.name
  }

  return defaultVisibility
}

const parseComment = (text, defaultVisibility) => {
  const result = {
    keywords: [],
    visibility: defaultVisibility || DEFAULT_VISIBILITY,
    description: '',
    describeModel: false
  }

  let index = 0
  let indexDescription = text.length

  while (index < text.length && index !== -1) {
    const matches = RE_KEYWORDS.exec(text)

    if (!matches) {
      break
    }

    if (index === 0) {
      indexDescription = matches.index
    }

    index = matches.index

    result.keywords.push({
      name: matches[1],
      description: matches[4]
        .replace(/\s*\*\s/g, '')
        .replace(/\s+/g, ' ')
        .replace(/\s*\*\//g, '')
        .trim()
    })
  }

  result.description = text.substring(0, indexDescription)
    .replace(/\/*\*\s*/g, '')
    .replace(/\n\s+/g, ' ')
    .replace(/\/\s*$/g, '')
    .trim()

  if (index) {
    result.visibility = getVisibility(result.keywords, result.visibility)
    result.describeModel = !!result.keywords.find((keyword) => keyword.name === MODEL_KEYWORD)
  }

  return result
}

const getComment = (property, defaultVisibility) => {
  defaultVisibility = defaultVisibility || DEFAULT_VISIBILITY

  let lastComment = null

  if (property.leadingComments) {
    lastComment = property.leadingComments.pop().value
  }

  if (property.trailingComments) {
    lastComment = property.trailingComments.pop().value
  }

  if (lastComment) {
    return parseComment(lastComment, defaultVisibility)
  }

  return {
    visibility: defaultVisibility,
    description: null,
    keywords: []
  }
}

class NodeFunction {
  constructor (node) {
    Object.assign(this, node)
  }
}

const value = (property) => {
  /* istanbul ignore if */
  if (property.key.type === 'Literal') {
    property.key.name = property.key.value
  }

  switch (property.value.type) {
    case 'Literal':
      return { [property.key.name]: property.value.value }

    case 'Identifier':
      return { [property.key.name]: property.value.name }

    case 'ObjectExpression':
      return { [property.key.name]: values(property) }

    case 'FunctionExpression':
    case 'ArrowFunctionExpression':
      return { [property.key.name]: new NodeFunction(property.value) }
  }

  return { [property.key.name]: property.value }
}

const values = (entry) => {
  const values = {}

  entry.value.properties.forEach((property) => {
    if (property.value.type === 'ObjectExpression') {
      Object.assign(values, {
        [property.key.name]: value(property)
      })
    } else {
      Object.assign(values, value(property))
    }
  })

  return values
}

const tokensInterval = (tokens, range) => {
  return tokens.filter((item) => {
    return item.range[0] > range[0] && item.range[1] < range[1]
  })
}

const getIdentifierValue = (tokens, identifierName, rangeLimit) => {
  const range = [ tokens[0].range[0], rangeLimit ]
  const searchingTokens = tokensInterval(tokens, range).reverse()
  const tokenIndex = searchingTokens.findIndex((item, i, array) => {
    if (item.type === 'Identifier' && item.value === identifierName) {
      const nextToken = array[i - 1]

      return nextToken.type === 'Punctuator' && nextToken.value === '='
    }

    return false
  })

  /* istanbul ignore if */
  if (tokenIndex === -1) {
    return null
  }

  const valueToken = searchingTokens[tokenIndex - 2]

  switch (valueToken.type) {
    case 'String':
      return valueToken.value.replace(/['"]/g, '')

    case 'Identifier':
      return getIdentifierValue(
        tokens, valueToken.value, valueToken.range[0])
  }

  /* istanbul ignore next */
  return null
}

const unCamelcase = (text) => {
  const chars = []

  text.split('').forEach((char) => {
    if (char === char.toUpperCase()) {
      char = char.toLowerCase()

      if (chars.length) {
        chars.push('-')
      }
    }

    chars.push(char)
  })

  return chars.join('')
}

const first = (o) => o[Object.keys(o)[0]]

const parseOptions = (options) => {
  options = options || {}

  /* istanbul ignore if */
  if (!options.source) {
    throw new Error('options.source.filename is required')
  }

  /* istanbul ignore if */
  if (!options.source.script) {
    throw new Error('options.source.script is required')
  }
}

class Parser extends EventEmitter {
  constructor (options) {
    parseOptions(options)

    for (let key in DEFAULT_OPTIONS) {
      options[key] = DEFAULT_OPTIONS[key]
    }

    super()

    this.ast = espree.parse(options.source.script, options)
    this.componentName = null
    this.template = options.source.template
    this.filename = options.filename
    this.eventsEmmited = {}
    this.defaultMethodVisibility = options.defaultMethodVisibility
  }

  extractProperties (property) {
    switch (property.value.type) {
      case 'ObjectExpression':
        property.value.properties.forEach((p) => {
          let defaultVisibility = DEFAULT_VISIBILITY

          if (property.key.name === 'methods' && this.defaultMethodVisibility) {
            defaultVisibility = this.defaultMethodVisibility
          }

          const entry = getComment(p, defaultVisibility)

          entry.value = value(p)
          entry.name = Object.keys(entry.value)[0]
          entry.value = entry.value[entry.name]

          if (entry.value instanceof NodeFunction) {
            entry.params = entry.value.params
          } else if (property.key.name === 'props') {
            if (entry.describeModel) {
              entry.name = 'v-model'
            } else {
              entry.name = unCamelcase(entry.name)
            }
          }

          delete entry.describeModel

          this.emit(property.key.name, entry)
          this.subWalk(entry.value)
        })
        break

      default:
        const propertyValue = value(property)
        const entryValue = first(propertyValue)

        if (propertyValue.hasOwnProperty('name') && !this.componentName) {
          this.componentName = propertyValue.name
          break
        }

        this.subWalk(entryValue)
    }
  }

  walk () {
    process.nextTick(() => {
      this.ast.body.forEach((body) => {
        const entry = getComment(body, this.defaultMethodVisibility)

        if (entry.description) {
          this.emit('description', entry.description)
        }

        if (entry.keywords.length) {
          this.emit('keywords', entry.keywords)
        }

        if (body.type !== 'ExportDefaultDeclaration' && body.type !== 'ExpressionStatement') {
          return
        }

        if (body.declaration != null) {
          body.declaration.properties.forEach((property) => this.extractProperties(property))
        } else if (body.expression != null) {
          body.expression.right.properties.forEach((property) => this.extractProperties(property))
        }

        if (this.componentName === null && this.filename) {
          const filename = path.parse(this.filename).name

          this.componentName = unCamelcase(filename)
        }

        this.emit('name', this.componentName)

        if (this.template) {
          this.parseTemplate()
        }
      })

      this.emit('end')
    })

    return this
  }

  subWalk (entry) {
    if (entry instanceof NodeFunction) {
      const tokens = tokensInterval(this.ast.tokens, entry.range)

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]

        if (token.type === 'Identifier' && token.value === '$emit') {
          if (!tokens[i + 2]) {
            break
          }

          const next = tokens[i + 2]
          const event = {
            name: null,
            description: null,
            visibility: DEFAULT_VISIBILITY,
            keywords: []
          }

          switch (next.type) {
            case 'String':
              event.name = next.value.replace(/['"]/g, '')
              break

            case 'Identifier':
              event.name = getIdentifierValue(tokens, next.value, next.range[0])
              break
          }

          if (!event.name) {
            event.name = '****unhandled-event-name****'
          } else {
            if (this.eventsEmmited.hasOwnProperty(event.name)) {
              continue
            }

            this.eventsEmmited[event.name] = true
          }

          const range = [
            tokens[i - 3].range[1],
            tokens[i - 2].range[0]
          ]

          event.description = this.ast.comments.reverse().find((c) => {
            return c.range[0] > range[0] && c.range[1] < range[1]
          })

          if (event.description) {
            const comment = parseComment(event.description.value)

            event.visibility = comment.visibility
            event.description = comment.description
            event.keywords = comment.keywords
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
module.exports.DEFAULT_VISIBILITY= DEFAULT_VISIBILITY
module.exports.getVisibility = getVisibility
module.exports.parseComment = parseComment
module.exports.getComment = getComment
