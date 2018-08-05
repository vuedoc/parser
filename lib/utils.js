'use strict'

const RE_VISIBILITY = /(public|protected|private)/
const RE_KEYWORDS = /@\**\s*([a-z0-9_-]+)(\s+(-\s+)?([\wÀ-ÿ\s*{}[\]()='"`_^$#&²~|\\£¤€%µ,?;.:/!§<>+¨-]+))?/ig
const RE_THIS_EXPRESSION = /this\.([a-z0-9_$]+)/ig

const DEFAULT_VISIBILITY = 'public'
const MODEL_KEYWORD = 'model'

const getVisibility = (keywords, defaultVisibility) => {
  const keyword = keywords.find((keyword) => RE_VISIBILITY.test(keyword.name))

  if (keyword) {
    return keyword.name
  }

  return defaultVisibility
}

const parseComment = (text, defaultVisibility = DEFAULT_VISIBILITY, features = ['description', 'keywords']) => {
  const result = {
    keywords: [],
    visibility: defaultVisibility,
    description: '',
    describeModel: false
  }

  const parsedText = text.split(/\n/)
    .map((line) => {
      return line.trim()
        .replace(/^\/\*+/, '').trim()
        .replace(/\s*\*+\/$/, '').trim()
        .replace(/^\s*\*/, '').trim()
    })
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

    index = matches.index

    const name = matches[1]
    const description = features.includes('description')
      ? (matches[4] || '').trim()
      : ''

    result.keywords.push({ name, description })
  }

  if (features.includes('description')) {
    result.description = parsedText.substring(0, indexDescription).trim()
  }

  result.visibility = getVisibility(result.keywords, result.visibility)
  result.describeModel = !!result.keywords.find((keyword) => {
    return keyword.name === MODEL_KEYWORD
  })

  if (!features.includes('keywords')) {
    result.keywords = []
  }

  return result
}

const getComment = (property, defaultVisibility = DEFAULT_VISIBILITY, features) => {
  let lastComment = null

  if (property.leadingComments) {
    lastComment = property.leadingComments.pop().value
  }

  if (property.trailingComments) {
    lastComment = property.trailingComments.pop().value
  }

  if (lastComment) {
    return parseComment(lastComment, defaultVisibility, features)
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
  if (property.key.type === 'Literal') {
    property.key.name = property.key.value
  }

  switch (property.value.type) {
    case 'Literal':
      return { [property.key.name]: property.value.value }

    case 'Identifier':
      return {
        [property.key.name]: property.value.name === 'undefined'
          ? undefined
          : property.value.name
      }

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

  const valueToken = searchingTokens[tokenIndex - 2]

  if (valueToken) {
    switch (valueToken.type) {
      case 'String':
        return valueToken.value.replace(/['"]/g, '')

      case 'Identifier':
        return getIdentifierValue(
          tokens, valueToken.value, valueToken.range[0])
    }
  }

  return { notFoundIdentifier: identifierName }
}

const getIdentifierValueFromStart = (tokens, identifierName) => {
//   const token = tokens.find((token) => {
//     return (token.type === 'Keyword' && token.value === 'export') || (token.type === 'Identifier' && token.value === 'module')
//   })
//   const range = [ tokens[0].range[0], token.range[0] ]
//   const initialTokens = tokensInterval(tokens, range)
  const tokenIndex = tokens.findIndex((token, i, array) => {
    if (token.type === 'Identifier' && token.value === identifierName) {
      const nextToken = array[i + 1]

      return nextToken.type === 'Punctuator' && nextToken.value === '='
    }

    return false
  })

  if (tokenIndex !== -1) {
    const valueToken = tokens[tokenIndex + 2]

    switch (valueToken.type) {
      case 'String':
        return valueToken.value.replace(/['"]/g, '')

      case 'Identifier':
        return getIdentifierValueFromStart(tokens, valueToken.value)
    }
  }

  return null
}

const unCamelcase = (text) => {
  const chars = []

  text.split('').forEach((char) => {
    if (/[A-Z]/.test(char)) {
      char = char.toLowerCase()

      if (chars.length) {
        chars.push('-')
      }
    }

    chars.push(char)
  })

  return chars.join('')
}

const getDependencies = (ast, source) => {
  const dependencies = []

  if (ast) {
    source = source.substring(ast.start, ast.end - 1)

    let index = 0

    while (index < source.length && index !== -1) {
      const matches = RE_THIS_EXPRESSION.exec(source)

      if (!matches) {
        break
      }

      index = matches.index

      dependencies.push(matches[1])
    }
  }

  return dependencies
}

const escapeImportKeyword = (code) => {
  return code.replace(/import/g, 'importX')
}

module.exports.DEFAULT_VISIBILITY = DEFAULT_VISIBILITY
module.exports.getVisibility = getVisibility
module.exports.parseComment = parseComment
module.exports.getComment = getComment
module.exports.NodeFunction = NodeFunction
module.exports.value = value
module.exports.values = values
module.exports.tokensInterval = tokensInterval
module.exports.getIdentifierValue = getIdentifierValue
module.exports.getIdentifierValueFromStart = getIdentifierValueFromStart
module.exports.unCamelcase = unCamelcase
module.exports.getDependencies = getDependencies
module.exports.escapeImportKeyword = escapeImportKeyword
