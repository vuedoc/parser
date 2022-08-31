import { AbstractParser } from './AbstractParser.js';
import { ScriptParser } from './ScriptParser.js';
import { Syntax } from '../lib/Enum.js';
import { Parser } from '../../types/Parser.js';

import * as Babel from '@babel/types';

export class AbstractLiteralParser<Source extends Parser.Source> extends AbstractParser<Source, ScriptParser<any, any>> {
  parse(node) {
    switch (node.type) {
      case Syntax.ObjectProperty:
        this.parseObjectProperty(node);
        break;
    }
  }

  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  /* istanbul ignore next */
  parseObjectProperty(_node: Babel.ObjectProperty) {}
}
