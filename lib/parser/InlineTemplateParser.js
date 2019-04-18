const { AbstractLiteralParser } = require('./AbstractLiteralParser')
const { TemplateParser } = require('./TemplateParser')

class InlineTemplateParser extends AbstractLiteralParser {
  constructor (root) {
    super(root)
  }

  parse (node) {
    const { value: template } = this.getValue(node)

    new TemplateParser(this.root, template).parse()
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
