import { Vuedoc } from '../../../types/index.js';
import { AbstractLiteralParser } from './AbstractLiteralParser.js';
import { MarkupTemplateParser } from './MarkupTemplateParser.js';
import * as Babel from '@babel/types';

export class InlineTemplateParser extends AbstractLiteralParser<Vuedoc.Parser.Script> {
  parseObjectProperty(node: Babel.ObjectProperty) {
    const { value: template } = this.getValue(node.value);
    const parser = new MarkupTemplateParser(this.emitter, {
      attrs: {
        lang: 'html',
      },
      content: template,
    });

    parser.parse();
  }
}
