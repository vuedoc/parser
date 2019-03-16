const HtmlParser = require('htmlparser2').Parser

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

    this.source = root.options.source.template || ''
    this.features = root.features
  }

  parse () {
    if (!this.features.includes(Features.slots)
        && !this.features.includes(Features.events)) {
      return
    }

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
          if (this.features.includes(Features.slots)) {
            const entry = new SlotEntry()

            entry.name = attrs.name || 'default'
            entry.description = lastComment

            this.emit(entry)
          }
        } else if (this.features.includes(Features.events)) {
          Object.keys(attrs)
            .map((name) => attrs[name])
            .map((value) => EVENT_EMIT_RE.exec(value))
            .filter((result) => result !== null)
            .map((matches) => ({ name: matches[1] }))
            .forEach(({ name }) => {
              if (lastComment) {
                lastComment = `/** ${lastComment} */`
              }

              const comment = CommentParser.parse(lastComment || '')
              const entry = new EventEntry(name)

              entry.visibility = comment.visibility
              entry.description = comment.description
              entry.keywords = comment.keywords

              JSDoc.parseParams(comment.keywords, entry, 'arguments')

              this.emit(entry)

              lastComment = null
            })

          lastComment = null
        }
      }
    }, { decodeEntities: true })

    parser.write(this.source)
    parser.end()
  }
}

module.exports.TemplateParser = TemplateParser
