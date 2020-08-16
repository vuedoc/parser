const { CommonTags, Type } = require('../Enum');

module.exports.KeywordsUtils = {
  extract (keywords, keywordNames, withNotEmptyDesc = false) {
    const keywordNamesArray = keywordNames instanceof Array ? keywordNames : [ keywordNames ];
    const items = keywords.filter(({ name }) => keywordNamesArray.includes(name));

    // delete items from keywords
    items.slice(0).reverse().forEach((item) => {
      const index = keywords.findIndex((keyword) => keyword === item);

      keywords.splice(index, 1);
    });

    if (withNotEmptyDesc) {
      return items.filter(({ description }) => description);
    }

    return items;
  },

  mergeEntryKeyword (entry, tag, type = Type.any) {
    const items = this.extract(entry.keywords, tag, true);

    if (items.length) {
      switch (type) {
        case Type.array:
          entry[tag] = items.map(({ description }) => description);
          break;

        default: {
          const item = items.pop();

          if (item.description) {
            entry[tag] = item.description;
          }
          break;
        }
      }
    }
  },

  parseCommonEntryTags (entry) {
    CommonTags.forEach(({ tag, type }) => this.mergeEntryKeyword(entry, tag, type));
  },
};
