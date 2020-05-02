const { Keyword } = require('../entity/Keyword')

const DEFAULT_VISIBILITY = 'public'

const RE_KEYWORDS = /^\s*@\**\s*([a-z0-9_.$-]+)(\s+(-\s+)?(.+))?/i
const RE_VISIBILITY = /(public|protected|private)/

module.exports.CommentParser = {
  parse (text, defaultVisibility = DEFAULT_VISIBILITY) {
    const result = {
      keywords: [],
      visibility: defaultVisibility,
      description: ''
    }

    const lines = text.split(/\n/)
      .map((line) => line.trim()
        .replace(/^\/\*\*/, '')
        .replace(/^(\* |\*)/, '')
        .replace(/\s*\*+\/$/, '')
        .replace(/^\s*\* /, ''))

    let keyword = null

    lines.forEach((line) => {
      const matches = RE_KEYWORDS.exec(line)

      if (matches === null) {
        if (keyword) {
          keyword.description += `\n${line}`
        } else {
          result.description += `\n${line}`
        }

        return
      }

      if (keyword) {
        keyword.description = keyword.description.trim()
      }

      keyword = new Keyword()

      /* eslint-disable-next-line prefer-destructuring */
      keyword.name = matches[1]
      keyword.description = (matches[4] || '').trim()

      result.keywords.push(keyword)
    })

    if (keyword === null) {
      result.description = lines.join('\n').trim()
    } else {
      result.description = result.description.trim()
      keyword.description = keyword.description.trim()
    }

    const visibility = this.getVisibility(result.keywords)

    if (visibility) {
      result.visibility = visibility
    }

    return result
  },

  getVisibility (keywords) {
    const keyword = keywords.find((keyword) => RE_VISIBILITY.test(keyword.name))

    return keyword ? keyword.name : null
  },

  format (comment) {
    const parsedComment = comment.trim()

    if (parsedComment.startsWith('<!--')) {
      const stripedComment = parsedComment.substring(4)

      if (stripedComment.endsWith('-->')) {
        return stripedComment.substring(0, stripedComment.length - 3).trim()
      }
    }

    return null
  }
}
