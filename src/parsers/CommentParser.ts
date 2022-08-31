import { Entry } from '../../types/Entry.js';
import { Keyword } from '../entity/Keyword.js';
import { Visibility, Visibilities } from '../lib/Enum.js';

const RE_KEYWORDS = /^\s*@\**\s*([a-z0-9_.$-]+)(\s+(-\s+)?(.+))?/i;
const RE_VISIBILITY = new RegExp(Visibilities.join('|'));

export const CommentParser = {
  parse(text: string, defaultVisibility = Visibility.public) {
    const result = {
      keywords: [] as Entry.Keyword[],
      visibility: defaultVisibility,
      description: '',
    };

    const lines = text.split(/\n/)
      .map((line) => line.trim()
        .replace(/^\/\*+/, '')
        .replace(/^(\* |\*)/, '')
        .replace(/\s*\**\/$/, '')
        .replace(/^\s*\* /, ''));

    let keyword: Keyword;

    lines.forEach((line) => {
      const matches = RE_KEYWORDS.exec(line);

      if (matches === null) {
        if (keyword) {
          keyword.description += `\n${line}`;
        } else {
          result.description += `\n${line}`;
        }

        return;
      }

      if (keyword) {
        keyword.description = keyword.description.trim();

        if (!keyword.description) {
          delete keyword.description;
        }
      }

      keyword = new Keyword();

      keyword.name = matches[1];
      keyword.description = (matches[4] || '').trim();

      result.keywords.push(keyword);
    });

    if (keyword) {
      result.description = result.description.trim();
      keyword.description = keyword.description.trim();

      if (!keyword.description) {
        delete keyword.description;
      }
    } else {
      result.description = lines.join('\n').trim();
    }

    if (!result.description) {
      delete result.description;
    }

    result.visibility = this.getVisibility(result.keywords, defaultVisibility);

    return result;
  },

  getVisibility(keywords: Keyword[], defaultValue = Visibility.public): Entry.Visibility {
    const index = keywords.findIndex((keyword) => RE_VISIBILITY.test(keyword.name));

    if (index > -1) {
      const keywordVisibility = keywords[index];

      keywords.splice(index, 1);

      return keywordVisibility.name as Entry.Visibility;
    }

    return defaultValue;
  },

  format(comment: string) {
    const parsedComment = comment.trim();

    if (parsedComment.startsWith('<!--')) {
      const stripedComment = parsedComment.substring(4);

      if (stripedComment.endsWith('-->')) {
        return stripedComment.substring(0, stripedComment.length - 3).trim();
      }
    }

    return null;
  },
};
