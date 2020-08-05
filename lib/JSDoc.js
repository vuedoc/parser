const { DEFAULT_TYPE, UNDEFINED } = require('./Enum')

const PARAM_NAME = '[a-z0-9$\\.\\[\\]_]+'
const TYPE_LIMIT = 'a-z\\[\\]\\{\\}<>|\\.,;:=\'"\\s\\*'
const TYPE_MIDLE = '\\(\\)'
const TYPE = `[${TYPE_LIMIT}]*|[${TYPE_LIMIT}][${TYPE_LIMIT}${TYPE_MIDLE}]*[${TYPE_LIMIT}]`
const PARAM_RE = new RegExp(`^\\s*(\\{\\(?(${TYPE})\\)?\\}\\s+)?(${PARAM_NAME}|\\[(${PARAM_NAME})(=(.*))?\\])\\s(\\s*-?\\s*)?(.*)?`, 'i')
const RETURN_RE = new RegExp(`^\\s*(\\{\\(?(${TYPE})\\)?\\}\\s+)?-?(.*)`, 'i')

const JSDoc = {
  parseType (type, param) {
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
  },
  parseParams (keywords = [], event, key) {
    const items = []
    const indexToRemove = []

    keywords.forEach(({ name, description }, keywordIndex) => {
      switch (name) {
        case 'arg':
        case 'prop':
        case 'param':
        case 'argument': {
          const param = JSDoc.parseParamKeyword(description, null)
          const entryIndex = event[key].findIndex((item) => item.name === param.name)

          if (entryIndex === -1) {
            event[key].push(param)
          } else {
            const entryParam = event[key][entryIndex]

            if (!param.type) {
              param.type = entryParam.type
            }

            if (!param.defaultValue) {
              if (entryParam.defaultValue && entryParam.defaultValue !== UNDEFINED) {
                param.defaultValue = entryParam.defaultValue
              }
            }

            event[key].splice(entryIndex, 1, param)
          }

          // items.push(param)
          indexToRemove.push(keywordIndex)
          break
        }

        case 'return':
        case 'returns':
          event.return = JSDoc.parseReturnKeyword(description)

          indexToRemove.push(keywordIndex)
          break
      }
    })

    indexToRemove.reverse().forEach((index) => keywords.splice(index, 1))

    // event[key] = items.length ? items : event[key] || []
  },
  parseParamKeyword (text, type = DEFAULT_TYPE) {
    const param = { type, name: null, description: '' }
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
          param.defaultValue = matches[6]
        }
      } else {
        /* eslint-disable prefer-destructuring */
        param.name = matches[3]
      }

      /* eslint-disable prefer-destructuring */
      param.description = matches[8]
    }

    return param
  },
  parseReturnKeyword (text, type = DEFAULT_TYPE) {
    const output = { type, description: '' }
    const matches = RETURN_RE.exec(`${text}\n`)

    if (matches[2]) {
      JSDoc.parseType(matches[2], output)
    }

    output.description = matches[3]

    return output
  }
}

module.exports.JSDoc = JSDoc
