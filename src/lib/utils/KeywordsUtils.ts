import { Vuedoc } from '../../../types/index.js';
import { CommonTags, Type } from '../Enum.js';

export const KeywordsUtils = {
  extract(keywords: Vuedoc.Entry.Keyword[], keywordNames: string | string[], withNotEmptyDesc = false) {
    const keywordNamesArray = keywordNames instanceof Array ? keywordNames : [keywordNames];
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

  mergeEntryKeyword(entry: Pick<Vuedoc.Entry.TypeKeywords, 'keywords'>, tag: string, type: Vuedoc.Parser.Type = Type.unknown) {
    const items = KeywordsUtils.extract(entry.keywords, tag, true);

    if (items.length) {
      switch (type) {
        case Type.array:
          entry[tag] = items.map(({ description }) => description);
          break;

        default: {
          const item = items.pop();

          if (item?.description) {
            entry[tag] = item.description;
          }
          break;
        }
      }
    }
  },

  parseCommonEntryTags(entry: Pick<Vuedoc.Entry.TypeKeywords, 'keywords'>) {
    CommonTags.forEach(({ tag, type }) => KeywordsUtils.mergeEntryKeyword(entry, tag, type));
  },
};
