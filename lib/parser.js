'use strict'

const EventEmitter = require('events')
const espree = require('espree')
const HtmlParser = require('htmlparser2').Parser
const path = require('path')

const RE_TRIM_COMMENT = /\*\s*/g
const RE_VISIBILITY = /@(public|protected|private)/g
const RE_MODEL = /\s?@model\s?/

const DEFAULT_VISIBILITY = 'public'
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

const hasModelDecoration = (text) => {
  return RE_MODEL.test(text)
}

const getCommentVisibility = (text) => {
  const matches = RE_VISIBILITY.exec(text)

  if (matches) {
    return matches[1]
  }

  return DEFAULT_VISIBILITY
}

const parseComment = (text) => {
  const parsedComment = {
    visibility: getCommentVisibility(text),
    describeModel: hasModelDecoration(text),
    description: text.replace(RE_VISIBILITY, '')
  }

  if (parsedComment.describeModel) {
    parsedComment.description = text.replace(RE_MODEL, '').trim()
  }

  parsedComment.description = parsedComment.description
    .replace(RE_TRIM_COMMENT, '').trim()

  return parsedComment
}

const getComment = (property) => {
  let lastComment = null

  if (property.leadingComments) {
    lastComment = property.leadingComments.pop().value
  }

  if (property.trailingComments) {
    lastComment = property.trailingComments.pop().value
  }

  if (lastComment) {
    return parseComment(lastComment)
  }

  return {
    visibility: DEFAULT_VISIBILITY,
    description: null
  }
}

class NodeFunction {
  constructor (node) {
    Object.assign(this, node)
  }
}

const value = (property) => {
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

class Parser extends EventEmitter {
  constructor (options) {
    options = options || {}

    if (!options.source) {
      throw new Error('options.source is required')
    }

    for (let key in DEFAULT_OPTIONS) {
      options[key] = DEFAULT_OPTIONS[key]
    }

    super()

    this.ast = espree.parse(options.source, options)
    this.componentName = null
    this.template = options.template
    this.filename = options.filename
    this.eventsEmmited = {}
  }

  walk () {
    process.nextTick(() => {
      this.ast.body.forEach((body) => {
        if (body.type !== 'ExportDefaultDeclaration') {
          const entry = getComment(body)
          const description = entry ? entry.description : null

          this.emit('description', description)
          return
        }

        body.declaration.properties.forEach((property) => {
          switch (property.value.type) {
            case 'ObjectExpression':
              property.value.properties.forEach((p) => {
                const entry = getComment(p)

                entry.entry = value(p)
                entry.name = Object.keys(entry.entry)[0]

                const entryValue = first(entry.entry)

                if (entryValue instanceof NodeFunction) {
                  entry.params = entryValue.params

                  delete entry.entry
                } else if (property.key.name === 'props') {
                  if (entry.describeModel) {
                    entry.entry['v-model'] = entry.entry[entry.name]
                    delete entry.entry[entry.name]
                  }
                }

                delete entry.describeModel

                this.emit(property.key.name, entry)
                this.subWalk(entryValue)
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

              const entry = getComment(property)

              if (!entry) {
                break
              }

              entry.name = Object.keys(propertyValue)[0]

              delete entry.describeModel

              this.emit(property.key.name, entry)
          }
        })

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
            visibility: DEFAULT_VISIBILITY
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
