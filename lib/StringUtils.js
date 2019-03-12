class StringUtils {
  static toKebabCase(text) {
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
}

module.exports.StringUtils = StringUtils
