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
  parse(value) {
    switch (typeof value) {
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
