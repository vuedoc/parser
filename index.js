'use strict'

const compiler = require('vue-template-compiler')
const fs = require('fs')

const Parser = require('./lib/parser')

const DEFAULT_ENCODING = 'utf8'

module.exports.parse = (options) => new Promise((resolve) => {
  if (!options || !options.filename) {
    throw new Error('options.filename is required')
  }

  options.encoding = options.encoding || DEFAULT_ENCODING

  const source = compiler.parseComponent(
    fs.readFileSync(options.filename, options.encoding))

  const component = {
    header: [],
    events: [],
    slots: []
  }

  let currentNode = null

  new Parser(source.script.content, source.template.content, options).walk()
    .on('node', (node) => {
      currentNode = node === '$root' ? 'header' : node

      if (!component[currentNode]) {
        component[currentNode] = []
      }
    })
    .on('entry', (entry, comments) => {
      if (comments) {
        if (!comments.isPrivate) {
          return component[currentNode].push({
            entry,
            comments: comments.entries
          })
        }
      } else {
        component[currentNode].push({ entry, comments })
      }
    })
    .on('slot', (name, description) => {
      component.slots.push({
        name,
        comments: description || []
      })
    })
    .on('event', (name, comments) => {
      component.events.push({
        name,
        comments: comments ? comments.entries : []
      })
    })
    .on('end', () => resolve(component))
})
