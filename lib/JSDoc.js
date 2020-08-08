const { ArrayUtils } = require('./ArrayUtils')
const { Type } = require('./Enum')

const PARAM_NAME = '[a-zA-Z0-9$&\\.\\[\\]_]+'
const TYPE_LIMIT = 'a-zA-Z\\[\\]\\{\\}<>\\+\\-|!%^$&#\\.,;:=\'"\\s\\*\\?'
const TYPE_MIDLE = '\\(\\)'
const TYPE = `[${TYPE_LIMIT}]*|[${TYPE_LIMIT}][${TYPE_LIMIT}${TYPE_MIDLE}]*[${TYPE_LIMIT}]`
const PARAM_RE = new RegExp(`^\\s*(\\{\\(?(${TYPE})\\)?\\}\\s+)?(${PARAM_NAME}|\\[(${PARAM_NAME})(=(.*))?\\])\\s(\\s*-?\\s*)?(.*)?`)
const RETURN_RE = new RegExp(`^\\s*(\\{\\(?(${TYPE})\\)?\\}\\s+)?-?(.*)`)
const TYPE_RE = new RegExp(`^(\\{\\((${TYPE})\\)\\}|\\{(${TYPE})\\}|\\((${TYPE})\\))$`)

function* paramGenerator() {
  while (true) {
    yield { name: null, type: Type.any, description: '' }
  }
}

const paramGeneratorInstance = paramGenerator()

const JSDoc = {
  parseTypeParam (type, param) {
    if (type.indexOf('|') > -1) {
      param.type = type.split('|').map((item) => item.trim())
    } else if (type === '*') {
      param.type = Type.any
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

            if (param.type === Type.unknow) {
              param.type = entryParam.type
            }

            if (!param.defaultValue) {
              if (entryParam.defaultValue && entryParam.defaultValue !== Type.undefined) {
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
  parseType (description) {
    let type = `${description}`.trim()
    const matches = TYPE_RE.exec(type)

    if (matches) {
      type = matches[2] || matches[3] || matches[4]
    } else if (type[0] === '{' && type.endsWith('}')) {
      type = type.substring(1, type.length - 1)
    }

    switch (type[0]) {
      case '!':
        type = type.substring(1)
        break

      case '?':
        type = type.length === 1
          ? Type.unknow
          : [ type.substring(1), Type.null ]
        break
    }

    // eslint-disable-next-line valid-typeof
    if (typeof type === Type.string) {
      if (type.indexOf('|') > -1) {
        type = type.split('|').map((item) => item.trim())
      } else if (type === '*') {
        type = Type.any
      } else {
        type = type.trim()
      }
    }

    return type
  },
  parseParamKeyword (text, generator = paramGeneratorInstance) {
    const param = generator.next().value
    const matches = PARAM_RE.exec(`${text}\n`)

    if (matches) {
      if (matches[2]) {
        JSDoc.parseTypeParam(matches[2], param)
      }

      if (matches[3][0] === '[') {
        param.optional = true
        param.name = matches[4]
          || matches[3].substring(1, matches[3].length - 1)

        if (matches[6]) {
          param.defaultValue = matches[6]
        }
      } else {
        param.name = matches[3]
      }

      param.description = matches[8]
    }

    return param
  },
  parseReturnKeyword (text, type = Type.any) {
    const output = { type, description: '' }
    const matches = RETURN_RE.exec(`${text}\n`)

    if (matches[2]) {
      JSDoc.parseTypeParam(matches[2], output)
    }

    output.description = matches[3]

    return output
  }
}

module.exports.JSDoc = JSDoc
