const { AbstractLiteralParser } = require('./AbstractLiteralParser');
const { MarkupTemplateParser } = require('./MarkupTemplateParser');

class InlineTemplateParser extends AbstractLiteralParser {
  parseObjectProperty (node) {
    const { value: template } = this.getValue(node.value);
    const parser = new MarkupTemplateParser(this.root, template);

    parser.parse();
  }
}

module.exports.InlineTemplateParser = InlineTemplateParser;
