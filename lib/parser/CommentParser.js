const DEFAULT_VISIBILITY = 'public'

const RE_KEYWORDS = /@\**\s*([a-z0-9_-]+)(\s+(-\s+)?([\wÀ-ÿ\s*{}[\]()='"`_^$#&²~|\\£¤€%µ,?;.:/!§<>+¨-]+))?/ig
const RE_VISIBILITY = /(public|protected|private)/

class CommentParser {
  static parse (text, defaultVisibility = DEFAULT_VISIBILITY) {
    const result = {
      keywords: [],
      visibility: defaultVisibility,
      description: ''
    }

    const parsedText = text.split(/\n/)
      .map((line) => line.trim()
        .replace(/^\/\*\*\s+/, '')
        .replace(/^(\* |\*)/, '')
        .replace(/\s*\*+\/$/, '')
        .replace(/^\s*\* /, ''))
      .join('\n')
      .trim()

    let index = 0
    let indexDescription = parsedText.length

    while (index < parsedText.length && index !== -1) {
      const matches = RE_KEYWORDS.exec(parsedText)

      if (!matches) {
        break
      }

      if (index === 0) {
        indexDescription = matches.index
      }

      /* eslint-disable prefer-destructuring */
      index = matches.index

      const name = matches[1]
      const description = (matches[4] || '').trim()

      result.keywords.push({ name, description })
    }

    result.description = parsedText.substring(0, indexDescription).trim()

    const visibility = CommentParser.getVisibility(result.keywords)

    if (visibility) {
      result.visibility = visibility
    }

    return result
  }

  static getVisibility (keywords) {
    const keyword = keywords.find((keyword) => RE_VISIBILITY.test(keyword.name))

    return keyword ? keyword.name : null
  }

  static trim (comment) {
    let parsedComment = comment.trim()

    if (parsedComment.startsWith('<!--')) {
      parsedComment = parsedComment.substring(4)
    }

    if (parsedComment.endsWith('-->')) {
      parsedComment = parsedComment.substring(0, parsedComment.length - 3)
    }

    return parsedComment.trim()
  }
}

module.exports.CommentParser = CommentParser
