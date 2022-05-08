import { AbstractLiteralParser } from './AbstractLiteralParser.js';
import { MarkupTemplateParser } from './MarkupTemplateParser.js';

export class InlineTemplateParser extends AbstractLiteralParser {
  parseObjectProperty (node) {
    const { value: template } = this.getValue(node.value);
    const parser = new MarkupTemplateParser(this.root, template);

    parser.parse();
  }
}
