const { AbstractLiteralParser } = require('./AbstractLiteralParser')
const { MarkupTemplateParser } = require('./MarkupTemplateParser')

class InlineTemplateParser extends AbstractLiteralParser {
  parse (node) {
    const { value: template } = this.getValue(node)
    const parser = new MarkupTemplateParser(this.root, template)

    parser.parse()
  }

  getTemplateLiteralValue (node) {
    const val = super.getTemplateLiteralValue(node)

    // remove the ` char
    val.value = val.value.substring(1, val.value.length - 1).trim()

    return val
  }
}

module.exports.InlineTemplateParser = InlineTemplateParser
