import { CommonTags, Tag, Type } from '../lib/Enum.js';
import { JSDoc } from '../lib/JSDoc.js';

import { Entry } from '../../types/Entry.js';
import { Parser } from '../../types/Parser.js';

export const KeywordsUtils = {
  extract(keywords: Entry.Keyword[], keywordNames: string | string[], withNotEmptyDesc = false) {
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

  mergeEntryKeyword(entry: Pick<Entry.TypeKeywords, 'keywords'>, tag: string, type: Parser.Type = Type.unknown) {
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

          if (tag === Tag.type) {
            entry[tag] = JSDoc.parseType(entry[tag]);
          }
          break;
        }
      }
    }
  },

  parseCommonEntryTags(entry: Pick<Entry.TypeKeywords, 'keywords'>) {
    CommonTags.forEach(({ tag, type }) => KeywordsUtils.mergeEntryKeyword(entry, tag, type));
  },
};
