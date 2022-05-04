import { CommentParser } from '../lib/parser/CommentParser';

/* global describe it expect */
/* eslint-disable max-len */
/* eslint-disable indent */

const comment = `
  /**
   * The generic component
   * Sub description
   *
   * @public
   * @alpnum azert0 123456789
   * @generic Keyword generic description
   * @multiline Keyword multiline
   *            description
   * @special-char {$[ç(àë£€%µù!,|\`_\\<>/_ç^?;.:/!§)]}
   * @punctuations !,?;.:!
   * @operators -/+<>=*%
   *
   * @slot inputs - Use this slot to define form inputs ontrols
   * @slot actions - Use this slot to define form action buttons controls
   * @slot footer - Use this slot to define form footer content.
   *
   * @multiline2 If the match succeeds, the exec() method returns an array (with extra properties index and input; see below) and updates the lastIndex property of the regular expression object. The returned array has the matched text as the first item, and then one item for each parenthetical capture group of the matched text.
   * If the match fails, the exec() method returns null, and sets lastIndex to 0.
   */`;

describe('CommentParser', () => {
  describe('parse(text, defaultVisibility = public)', () => {
    const result = CommentParser.parse(comment);
    const keywords = result.keywords;

    it('should successfully extract both description and keywords', () => {
      expect(result.description).toBe('The generic component\nSub description');
      expect(result.keywords.length).toBe(10);
    });

    it('should successfully skip the public visibility keyword', () => {
      const keyword = keywords.find((keyword) => keyword.name === 'public');

      expect(keyword).toBeUndefined();
    });

    it('should successfully extract keyword with alpnum chars in description', () => {
      const keyword = keywords.find((keyword) => keyword.name === 'alpnum');

      expect(keyword).toBeDefined();
      expect(keyword.description).toBe('azert0 123456789');
    });

    it('should successfully extract generic keyword with description', () => {
      const keyword = keywords.find((keyword) => keyword.name === 'generic');

      expect(keyword).toBeDefined();
      expect(keyword.description).toBe('Keyword generic description');
    });

    it('should successfully extract keyword with multiline description', () => {
      const keyword = keywords.find((keyword) => keyword.name === 'multiline');

      expect(keyword).toBeDefined();
      expect(keyword.description).toBe('Keyword multiline\n           description');
    });

    it('should successfully parse complex comment', () => {
      const comment = `
        /**
         * The **\`exec()\`** method executes a search for a match in a specified
         * string. Returns a result array, or \`null\`.
         *
         * JavaScript \`RegExp\` objects are **stateful** when they have the \`global\`
         * or \`sticky\` flags set (e.g. \`/foo/g\` or \`/foo/y\`). They store a
         * \`lastIndex\` from the previous match. Using this internally, \`exec()\` can
         * be used to iterate over multiple matches in a string of text (with
         * capture groups), as opposed to getting just the matching strings with
         * \`String.prototype.match()\`.
         *
         * A newer function has been proposed to simplify matching multiple parts of a string (with capture groups): \`String.prototype.matchAll()\`.
         *
         * If you are executing a match simply to find \`true\` or \`false\`, use
         * \`RegExp.prototype.test()\` method or String.prototype.search() instead.
         *
         * @example
         * \`\`\`js
         * const regex1 = RegExp('foo*','g');
         * const str1 = 'table football, foosball';
         * let array1;
         *
         * while ((array1 = regex1.exec(str1)) !== null) {
         *   console.log(\`Found \${array1[0]}. Next starts at \${regex1.lastIndex}.\`);
         *   // expected output: "Found foo. Next starts at 9."
         *   // expected output: "Found foo. Next starts at 19."
         * }
         * \`\`\`
         *
         * @syntax regexObj.exec(str: string): any[]
         * @param {string} str - The string against which to match the regular expression.
         * @returns If the match succeeds, the exec() method returns an array (with extra properties index and input; see below) and updates the lastIndex property of the regular expression object. The returned array has the matched text as the first item, and then one item for each parenthetical capture group of the matched text.
         * If the match fails, the exec() method returns null, and sets lastIndex to 0.
         */
      `;
      const result = CommentParser.parse(comment);

      expect(result).toEqual({
        keywords: [
          {
            name: 'example',
            description: '```js\n'
              + "const regex1 = RegExp('foo*','g');\n"
              + "const str1 = 'table football, foosball';\n"
              + 'let array1;\n'
              + '\n'
              + 'while ((array1 = regex1.exec(str1)) !== null) {\n'
              + '  console.log(`Found ${array1[0]}. Next starts at ${regex1.lastIndex}.`);\n'
              + '  // expected output: "Found foo. Next starts at 9."\n'
              + '  // expected output: "Found foo. Next starts at 19."\n'
              + '}\n'
              + '```'
          },
          {
            name: 'syntax',
            description: 'regexObj.exec(str: string): any[]'
          },
          {
            name: 'param',
            description: '{string} str - The string against which to match the regular expression.'
          },
          {
            name: 'returns',
            description: 'If the match succeeds, the exec() method returns an array (with extra properties index and input; see below) and updates the lastIndex property of the regular expression object. The returned array has the matched text as the first item, and then one item for each parenthetical capture group of the matched text.\n'
              + 'If the match fails, the exec() method returns null, and sets lastIndex to 0.'
          }
        ],
        visibility: 'public',
        description: 'The **`exec()`** method executes a search for a match in a specified\n'
          + 'string. Returns a result array, or `null`.\n'
          + '\n'
          + 'JavaScript `RegExp` objects are **stateful** when they have the `global`\n'
          + 'or `sticky` flags set (e.g. `/foo/g` or `/foo/y`). They store a\n'
          + '`lastIndex` from the previous match. Using this internally, `exec()` can\n'
          + 'be used to iterate over multiple matches in a string of text (with\n'
          + 'capture groups), as opposed to getting just the matching strings with\n'
          + '`String.prototype.match()`.\n'
          + '\n'
          + 'A newer function has been proposed to simplify matching multiple parts of a string (with capture groups): `String.prototype.matchAll()`.\n'
          + '\n'
          + 'If you are executing a match simply to find `true` or `false`, use\n'
          + '`RegExp.prototype.test()` method or String.prototype.search() instead.'
      });
    });

    it('should successfully extract keyword with special chars in description', () => {
      const keyword = keywords.find((keyword) => keyword.name === 'special-char');

      expect(keyword).toBeDefined();
      expect(keyword.description).toBe('{$[ç(àë£€%µù!,|`_\\<>/_ç^?;.:/!§)]}');
    });

    it('should successfully extract keyword with punctuations chars in description', () => {
      const keyword = keywords.find((keyword) => keyword.name === 'punctuations');

      expect(keyword).toBeDefined();
      expect(keyword.description).toBe('!,?;.:!');
    });

    it('should successfully extract keyword with operators chars in description', () => {
      const keyword = keywords.find((keyword) => keyword.name === 'operators');

      expect(keyword).toBeDefined();
      expect(keyword.description).toBe('-/+<>=*%');
    });

    it('should successfully extract grouped keywords', () => {
      const group = keywords.filter((keyword) => keyword.name === 'slot');

      expect(group.length).toBe(3);
    });

    it('should success with malformated keyword syntax', () => {
      const comment = `
        /**
         * The generic component
         * Sub description
         *
         * @keyword*
         */`;
      const result = CommentParser.parse(comment);

      expect(result.description).toBe('The generic component\nSub description');
      expect(result.keywords.length).toBe(1);
    });

    it('should parse with defaultVisibility = protected', () => {
      const comment = `
        /**
         * The generic component
         */`;
      const visibility = 'protected';
      const result = CommentParser.parse(comment, visibility);

      expect(result.visibility).toBe(visibility);
    });
  });

  describe('getVisibility(keywords)', () => {
    it('should return the attached visibility', () => {
      const keywords = [
        { name: 'private',
          description: undefined }
      ];
      const result = CommentParser.getVisibility(keywords);
      const expected = 'private';

      expect(result).toBe(expected);
    });

    it('should return default method visibility for non visibility keyword', () => {
      const keywords = [
        { name: 'author',
          description: 'Sébastien' }
      ];
      const result = CommentParser.getVisibility(keywords);

      expect(result).toBe('public');
    });

    it('should return explicit default visibility', () => {
      const keywords = [
        { name: 'author',
          description: 'Sébastien' }
      ];
      const result = CommentParser.getVisibility(keywords, 'private');

      expect(result).toBe('private');
    });
  });

  describe('format(comment)', () => {
    it('should return the trimmed comment', () => {
      const comment = `
        <!-- Hello, World -->
      `;
      const result = CommentParser.format(comment);
      const expected = 'Hello, World';

      expect(result).toBe(expected);
    });

    it('should return null for an invalid comment', () => {
      const comment = ' <!--Hello, World  ';
      const result = CommentParser.format(comment);
      const expected = null;

      expect(result).toBe(expected);
    });

    it('should return null for a non comment', () => {
      const comment = ' Hello, \nWorld  ';
      const result = CommentParser.format(comment);
      const expected = null;

      expect(result).toBe(expected);
    });
  });
});
