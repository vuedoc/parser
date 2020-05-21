const { DEFAULT_TYPE } = require('./Enum')

module.exports.StringUtils = {
  toKebabCase(text) {
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
  },
  parseValue(value, type = typeof value) {
    switch (type) {
      case 'null':
        return DEFAULT_TYPE

      case 'bigint':
        return value

      case 'string':
        return JSON.stringify(value)

      case 'boolean':
        if (value === true) {
          return 'true'
        }

        if (value === false) {
          return 'false'
        }

        return value

      case 'undefined':
        return 'undefined'

      default:
        if (value === null) {
          return 'null'
        }
    }

    return `${value}`
  }
}
