import { AbstractParser } from './AbstractParser';
import { Syntax } from '../Enum';

export class AbstractLiteralParser extends AbstractParser {
  parse (node) {
    switch (node.type) {
      case Syntax.ObjectProperty:
        this.parseObjectProperty(node);
        break;
    }
  }

  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  /* istanbul ignore next */
  parseObjectProperty (node) {}
}
