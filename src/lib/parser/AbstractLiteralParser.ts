import { AbstractParser } from './AbstractParser.js';
import { Syntax } from '../Enum.js';
import { Vuedoc } from '../../../types/index.js';
import * as Babel from '@babel/types';
import type { ScriptParser } from './ScriptParser.js';

export class AbstractLiteralParser<Source extends Vuedoc.Parser.Source> extends AbstractParser<Source, ScriptParser<any, any>> {
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
  parseObjectProperty(node: Babel.ObjectProperty) {}
}
