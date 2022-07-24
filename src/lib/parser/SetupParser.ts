import { DataParser, ParseDataValueOptions } from './DataParser.js';
import { ComputedParser } from './ComputedParser.js';
import { Feature, Syntax, Type } from '../Enum.js';
import { MethodParser } from './MethodParser.js';
import * as Babel from '@babel/types';

export class SetupParser extends DataParser {
  parseDataValue({ name, value, nodeTyping, nodeComment }: ParseDataValueOptions) {
    if (this.compositionComputedKeys.includes(value.$kind as any)) {
      this.parseDataValueComputed({ name, value, nodeTyping, nodeComment });
    } else if (value.type === Type.function) {
      this.parseDataValueMethod({ name, value, nodeTyping, nodeComment });
    } else {
      this.parseDataValueRaw({ name, value, nodeTyping, nodeComment });
    }
  }

  parseDataValueComputed({ name, nodeTyping, nodeComment }: ParseDataValueOptions) {
    if (this.features.includes(Feature.computed)) {
      new ComputedParser(this.root, this.emitter, this.source, this.scope).parseComputedValue({
        name,
        node: this.scope[name].node?.value,
        nodeTyping,
        nodeComment,
      });
    }
  }

  parseDataValueMethod({ name, nodeTyping, nodeComment }: ParseDataValueOptions) {
    if (this.features.includes(Feature.methods)) {
      const { value: node = nodeTyping, comment: nComment = nodeComment } = this.scope[name]?.node || {};

      if (!node.key) {
        node.key = node.id || nodeComment.key || nodeTyping.id;
      }

      new MethodParser(this.root).parseMethodProperty(node, node, nComment, {
        parseEvents: false,
        // FIXME Handle hooks: CompositionHooks,
        // hooks: CompositionHooks,
      });
    }
  }

  parseCallExpression(node) {
    if (node.callee.name === 'expose' && node.arguments.length) {
      const exposedValue = this.getValue(node.arguments[0]);

      if (exposedValue.type === Type.object) {
        Object.keys(exposedValue.value).forEach((name) => this.parseDataValue({
          name,
          value: this.scope[name].value,
          nodeComment: this.scope[name].node?.comment,
          nodeTyping: this.scope[name].node?.type,
        }));
      }
    }
  }

  parseExpressionStatement(node) {
    if (node.expression.type === Syntax.CallExpression) {
      this.parseCallExpression(node.expression);
    }
  }

  parseReturnStatement(node) {
    switch (node.argument.type) {
      case Syntax.ObjectExpression:
        this.parseObjectExpression(node.argument);
        break;
    }
  }
}
