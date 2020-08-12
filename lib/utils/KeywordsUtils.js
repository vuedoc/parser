const { CommonTags } = require('../Enum')

module.exports.KeywordsUtils = {
  extract (keywords, keywordNames, withNotEmptyDesc = false) {
    const keywordNamesArray = keywordNames instanceof Array ? keywordNames : [ keywordNames ]
    const items = keywords.filter(({ name }) => keywordNamesArray.includes(name))

    // delete items from keywords
    items.slice(0).reverse().forEach((item) => {
      const index = keywords.findIndex((keyword) => keyword === item)

      keywords.splice(index, 1)
    })

    if (withNotEmptyDesc) {
      return items.filter(({ description }) => description)
    }

    return items
  },

  mergeEntryKeyword (entry, keywordName, entryKey = keywordName) {
    const items = this.extract(entry.keywords, keywordName)

    if (items.length) {
      entry[entryKey] = items.pop().description
    }
  },

  parseCommonEntryTags (entry) {
    CommonTags.forEach((tag) => this.mergeEntryKeyword(entry, tag))
  }
}
