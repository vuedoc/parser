'use strict'

const EventEmitter = require('events')
const espree = require('espree')

const RE_SLOT = /<slot(\s+name="([\w\d_-]*)"(\s+description="(.*)")?)?>/ig
const RE_TRIM_COMMENT = /\*\s*/g
const RE_PRIVATE = /@(private|protected)/
const RE_MODEL = /\s?@model\s?/

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

const parseComment = (value) => {
  return value.replace(RE_TRIM_COMMENT, '').trim()
}

const getComment = (property) => {
  const comments = []
  let describeModel = false

  if (property.leadingComments) {
    property.leadingComments.forEach((comment) => {
      comments.push(parseComment(comment.value))
    })
  }

  if (property.trailingComments) {
    property.trailingComments.forEach((comment) => {
      comments.push(parseComment(comment.value))
    })
  }

  if (comments.length) {
    comments.forEach((comment, i, self) => {
      if (RE_MODEL.test(comment)) {
        self[i] = comment.replace(RE_MODEL, '').trim()
        describeModel = true
      }
    })

    return {
      isPrivate: !!comments.find((comment) => RE_PRIVATE.test(comment)),
      entries: comments,
      describeModel: describeModel
    }
  }

  return { isPrivate: false, entries: [], describeModel: false }
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

class Parser extends EventEmitter {
  constructor (source, template, options) {
    options = options || {}

    for (let key in DEFAULT_OPTIONS) {
      options[key] = DEFAULT_OPTIONS[key]
    }

    super()

    this.ast = espree.parse(source, options)
    this.template = template
  }

  walk () {
    let mainComment = null

    process.nextTick(() => {
      this.ast.body.forEach((body) => {
        if (body.type !== 'ExportDefaultDeclaration') {
          mainComment = getComment(body)
          return
        }

        body.declaration.properties.forEach((property) => {
          switch (property.value.type) {
            case 'ObjectExpression':
              this.emit('node', property.key.name)

              property.value.properties.forEach((p) => {
                const entry = value(p)
                const comments = getComment(p)

                if (property.key.name === 'props' && comments.describeModel) {
                  for (let key in entry) {
                    entry['v-model'] = entry[key]
                    delete entry[key]
                  }
                }

                this.emit('entry', entry, comments)
                this.subWalk(entry)
              })
              break

            default:
              const entry = value(property)

              if (entry instanceof NodeFunction) {
              }

              this.emit('node', '$root')
              this.emit('entry', entry, mainComment || getComment(property))

              this.subWalk(entry)

              mainComment = null
          }
        })

        this.parseTemplate()
      })

      this.emit('end')
    })

    return this
  }

  subWalk (entry) {
    const key = Object.keys(entry)[0]
    const o = entry[key]

    if (o instanceof NodeFunction) {
      const tokens = this.ast.tokens.filter((t) => {
        return t.range[0] > o.range[0] && t.range[1] < o.range[1]
      })

      for (let i = 0; i < tokens.length; i++) {
        const token = tokens[i]

        if (token.type === 'Identifier') {
          if (!tokens[i + 2]) {
            break
          }

          if (token.value === '$emit') {
            const next = tokens[i + 2]
            let eventName = next.value.replace(/'/g, '')

            if (!eventName) {
              eventName = '****unhandled-event-name****'
            }

            const range = [
              tokens[i - 3].range[1],
              tokens[i - 2].range[0]
            ]

            let comments = this.ast.comments.filter((c) => {
              return c.range[0] > range[0] && c.range[1] < range[1]
            })

            if (comments.length) {
              comments.forEach((comment, i, self) => {
                self[i] = parseComment(comment.value)
              })

              comments = {
                isPrivate: !!comments.find((comment) => RE_PRIVATE.test(comment)),
                entries: comments
              }
            }

            this.emit('event', eventName, comments)

            i += 2
          }
        }
      }
    }
  }

  parseTemplate () {
    if (!this.template) {
      return
    }

    let matches = null

    while ((matches = RE_SLOT.exec(this.template))) {
      const name = matches[2] || 'default'
      const description = matches[4]

      this.emit('slot', name, description ? [ description ] : null)
    }
  }
}

module.exports = Parser
