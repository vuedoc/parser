const { compile } = require('vue-template-compiler')

const { AbstractParser } = require('./AbstractParser')
const { CommentParser } = require('./CommentParser')

const { EventEntry } = require('../entity/EventEntry')
const { SlotEntry } = require('../entity/SlotEntry')

const { JSDoc } = require('../JSDoc')
const { Features } = require('../Enum')

const EVENT_EMIT_RE = /^\$emit\(['"](.+)['"]/

class TemplateParser extends AbstractParser {
  /**
   * @param {Parser} parser - The Parser object
   */
  constructor (root) {
    super(root)

    this.source = root.options.source.template.trim()
    this.features = root.features
    this.nodes = []
    this.options = {
      outputSourceRange: true,
      modules: {
        preTransformNode: (node) => this.parseNode(node)
      }
    }
  }

  getSiblingNode (node) {
    return this.nodes.length
      ? this.nodes[this.nodes.length - 1]
      : node.parent
  }

  findComment (node) {
    const token = this.getSiblingNode(node) || { end: -1 }
    const code = this.source.substring(token.end, node.start).trim()
    const lines = code.split(/\n/g).reverse()
    const parsedLines = []

    for (const line of lines) {
      if (line.endsWith('-->') && parsedLines.length) {
        break
      }

      parsedLines.push(line)
    }

    const comment = parsedLines.reverse().join('\n')

    return CommentParser.trim(comment)
  }

  parseEntryComment (entry, node) {
    const commentText = this.findComment(node)
    const comment = CommentParser.parse(`/** ${commentText} */`)

    entry.visibility = comment.visibility
    entry.description = comment.description
    entry.keywords = comment.keywords

    return comment
  }

  parseNode (node) {
    if (node.tag === 'slot') {
      if (this.features.includes(Features.slots)) {
        const entry = new SlotEntry(node.attrsMap.name)
        const comment = this.parseEntryComment(entry, node)

        JSDoc.parseParams(comment.keywords, entry, 'props')

        this.emit(entry)
      }
    } else if (this.features.includes(Features.events)) {
      Object.values(node.attrsMap)
        .map((value) => EVENT_EMIT_RE.exec(value))
        .filter((result) => result !== null)
        .map((matches) => ({ name: matches[1] }))
        .forEach(({ name }) => {
          const entry = new EventEntry(name)
          const comment = this.parseEntryComment(entry, node)

          JSDoc.parseParams(comment.keywords, entry, 'arguments')

          this.emit(entry)
        })
    }

    this.nodes.push(node)
  }

  parse () {
    if (!this.features.includes(Features.slots)
        && !this.features.includes(Features.events)) {
      return
    }

    compile(this.source, this.options)
  }
}

module.exports.TemplateParser = TemplateParser
