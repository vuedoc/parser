const { Keyword } = require('../entity/Keyword');
const { Visibility, Visibilities } = require('../Enum');

const RE_KEYWORDS = /^\s*@\**\s*([a-z0-9_.$-]+)(\s+(-\s+)?(.+))?/i;
const RE_VISIBILITY = new RegExp(Visibilities.join('|'));

module.exports.CommentParser = {
  parse (text, defaultVisibility = Visibility.public) {
    const result = {
      keywords: [],
      visibility: defaultVisibility,
      description: ''
    };

    const lines = text.split(/\n/)
      .map((line) => line.trim()
        .replace(/^\/\*+/, '')
        .replace(/^(\* |\*)/, '')
        .replace(/\s*\**\/$/, '')
        .replace(/^\s*\* /, ''));

    let keyword = null;

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

    if (keyword === null) {
      result.description = lines.join('\n').trim();
    } else {
      result.description = result.description.trim();
      keyword.description = keyword.description.trim();

      if (!keyword.description) {
        delete keyword.description;
      }
    }

    if (!result.description) {
      delete result.description;
    }

    result.visibility = this.getVisibility(result.keywords, defaultVisibility);

    return result;
  },

  getVisibility (keywords, defaultValue = Visibility.public) {
    const index = keywords.findIndex((keyword) => RE_VISIBILITY.test(keyword.name));

    if (index > -1) {
      const keywordVisibility = keywords[index];

      keywords.splice(index, 1);

      return keywordVisibility.name;
    }

    return defaultValue;
  },

  format (comment) {
    const parsedComment = comment.trim();

    if (parsedComment.startsWith('<!--')) {
      const stripedComment = parsedComment.substring(4);

      if (stripedComment.endsWith('-->')) {
        return stripedComment.substring(0, stripedComment.length - 3).trim();
      }
    }

    return null;
  }
};
