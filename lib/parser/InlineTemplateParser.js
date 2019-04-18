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

    if (val.value[0] === '`') {
      val.value = val.value.substring(1, val.value.length - 1).trim()
    } else {
      val.value = val.value.trim()
    }

    return val
  }
}

module.exports.InlineTemplateParser = InlineTemplateParser
