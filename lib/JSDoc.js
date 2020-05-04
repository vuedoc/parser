const { DEFAULT_TYPE } = require('./Enum')

const PARAM_NAME = '[a-z0-9$\\.\\[\\]_]+'
const TYPE = '[a-z\\[\\]|\\. \\*]*'
const PARAM_RE = new RegExp(`^\\s*(\\{\\(?(${TYPE})\\)?\\}\\s+)?(${PARAM_NAME}|\\[(${PARAM_NAME})(=(.*))?\\])\\s(\\s*-?\\s*)?(.*)?`, 'i')
const RETURN_RE = new RegExp(`^\\s*(\\{\\(?(${TYPE})\\)?\\}\\s+)?-?(.*)`, 'i')

class JSDoc {
  static parseType (type, param) {
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

  static parseParams (keywords = [], event, key) {
    const items = []

    keywords.forEach(({ name, description }) => {
      switch (name) {
        case 'arg':
        case 'prop':
        case 'param':
        case 'argument':
          items.push(JSDoc.parseParamKeyword(description))
          break

        case 'return':
        case 'returns':
          event.return = JSDoc.parseReturnKeyword(description)
          break
      }
    })

    event[key] = items.length ? items : event[key] || []
  }

  static parseParamKeyword (text) {
    const param = { type: DEFAULT_TYPE, name: null, description: '' }
    const matches = PARAM_RE.exec(`${text}\n`)

    if (matches) {
      if (matches[2]) {
        JSDoc.parseType(matches[2], param)
      }

      if (matches[3][0] === '[') {
        param.optional = true
        param.name = matches[4]
          || matches[3].substring(1, matches[3].length - 1)

        if (matches[6]) {
          /* eslint-disable prefer-destructuring */
          param.default = matches[6]
        }
      } else {
        /* eslint-disable prefer-destructuring */
        param.name = matches[3]
      }

      /* eslint-disable prefer-destructuring */
      param.description = matches[8]
    }

    return param
  }

  static parseReturnKeyword (text) {
    const output = { type: DEFAULT_TYPE, description: '' }
    const matches = RETURN_RE.exec(`${text}\n`)

    if (matches[2]) {
      JSDoc.parseType(matches[2], output)
    }

    output.description = matches[3]

    return output
  }
}

module.exports.JSDoc = JSDoc
