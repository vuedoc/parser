'use strict'

const PARAM_NAME = '[a-z0-9$\\.\\[\\]_]+'
const TYPE = '[a-z\\[\\]|\\. \\*]*'
const PARAM_RE = new RegExp(`^\\s*(\\{\\(?(${TYPE})\\)?\\}\\s+)?(${PARAM_NAME}|\\[(${PARAM_NAME})(=(.*))?\\])\\s+-?\\s*(.*)`, 'i')
const RETURN_RE = new RegExp(`^\\s*(\\{\\(?(${TYPE})\\)?\\}\\s+)?-?(.*)`, 'i')
const DEFAULT_TYPE = 'Any'

function parseType (type, param) {
  if (type.indexOf('|') > -1) {
    param.type = type.split('|')
  } else if (type.startsWith('...')) {
    param.type = type.substring(3)
    param.repeated = true
  } else if (type === '*') {
    param.type = DEFAULT_TYPE
  } else {
    param.type = type
  }
}

function parseParamKeyword (text) {
  const param = { type: DEFAULT_TYPE, name: null, desc: null }
  const matches = PARAM_RE.exec(text)

  if (matches) {
    if (matches[2]) {
      parseType(matches[2], param)
    }

    if (matches[3][0] === '[') {
      param.optional = true
      param.name = matches[4] || matches[3].substring(1, matches[3].length - 1)

      if (matches[6]) {
        param.default = matches[6]
      }
    } else {
      param.name = matches[3]
    }

    param.desc = matches[7]
  }

  return param
}

function parseReturnKeyword (text) {
  const output = { type: DEFAULT_TYPE, desc: '' }
  const matches = RETURN_RE.exec(text)

  if (matches[2]) {
    parseType(matches[2], output)
  }

  output.desc = matches[3]

  return output
}

module.exports.parseType = parseType
module.exports.parseParamKeyword = parseParamKeyword
module.exports.parseReturnKeyword = parseReturnKeyword
module.exports.DEFAULT_TYPE = DEFAULT_TYPE
