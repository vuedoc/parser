import { AbstractLiteralParser } from './AbstractLiteralParser';
import { MarkupTemplateParser } from './MarkupTemplateParser';

export class InlineTemplateParser extends AbstractLiteralParser {
  parseObjectProperty (node) {
    const { value: template } = this.getValue(node.value);
    const parser = new MarkupTemplateParser(this.root, template);

    parser.parse();
  }
}
