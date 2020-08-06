const { ArrayUtils } = require('./ArrayUtils')
const { DEFAULT_TYPE, UNDEFINED } = require('./Enum')

const PARAM_NAME = '[a-z0-9$\\.\\[\\]_]+'
const TYPE_LIMIT = 'a-z\\[\\]\\{\\}<>|\\.,;:=\'"\\s\\*'
const TYPE_MIDLE = '\\(\\)'
const TYPE = `[${TYPE_LIMIT}]*|[${TYPE_LIMIT}][${TYPE_LIMIT}${TYPE_MIDLE}]*[${TYPE_LIMIT}]`
const PARAM_RE = new RegExp(`^\\s*(\\{\\(?(${TYPE})\\)?\\}\\s+)?(${PARAM_NAME}|\\[(${PARAM_NAME})(=(.*))?\\])\\s(\\s*-?\\s*)?(.*)?`, 'i')
const RETURN_RE = new RegExp(`^\\s*(\\{\\(?(${TYPE})\\)?\\}\\s+)?-?(.*)`, 'i')

function* paramGenerator() {
  while (true) {
    yield { name: null, type: DEFAULT_TYPE, description: '' }
  }
}

const paramGeneratorInstance = paramGenerator()

const JSDoc = {
  parseType (type, param) {
    if (type.indexOf('|') > -1) {
      param.type = type.split('|').map((item) => item.trim())
    } else if (type === '*') {
      param.type = DEFAULT_TYPE
    } else if (type.startsWith('...')) {
      param.type = type.substring(3)
      param.rest = true
    } else {
      param.type = type
    }
  },
  parseParams (keywords = [], params, generator) {
    const indexToRemove = []

    keywords.forEach(({ name, description }, keywordIndex) => {
      switch (name) {
        case 'arg':
        case 'prop':
        case 'param':
        case 'argument': {
          const param = JSDoc.parseParamKeyword(description, generator)
          const entryIndex = params.findIndex((item) => item.name === param.name)

          if (entryIndex === -1) {
            params.push(param)
          } else {
            const entryParam = params[entryIndex]

            if (param.rest === false) {
              param.rest = entryParam.rest
            }

            if (param.type === DEFAULT_TYPE) {
              param.type = entryParam.type
            }

            if (!param.defaultValue) {
              if (entryParam.defaultValue && entryParam.defaultValue !== UNDEFINED) {
                param.defaultValue = entryParam.defaultValue
              }
            }

            params.splice(entryIndex, 1, param)
          }

          indexToRemove.push(keywordIndex)
          break
        }
      }
    })

    ArrayUtils.removeByIndex(keywords, indexToRemove)

    if (indexToRemove.length) {
      const indexParamsToRemove = []

      params.forEach(({ name }, indexParam) => {
        if (name[0] === '{' || name[0] === '[' || name.startsWith('this.')) {
          indexParamsToRemove.push(indexParam)
        }
      })

      ArrayUtils.removeByIndex(params, indexParamsToRemove)
    }
  },
  parseReturn (keywords = [], returns) {
    const indexToRemove = []

    keywords.forEach(({ name, description }, keywordIndex) => {
      switch (name) {
        case 'return':
        case 'returns':
          Object.assign(returns, JSDoc.parseReturnKeyword(description, returns.type))
          indexToRemove.push(keywordIndex)
          break
      }
    })

    ArrayUtils.removeByIndex(keywords, indexToRemove)
  },
  parseParamKeyword (text, generator = paramGeneratorInstance) {
    const param = generator.next().value
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
