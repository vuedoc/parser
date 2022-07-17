import { DataParser } from './DataParser.js';
import { ComputedParser } from './ComputedParser.js';
import { CompositionHooks, Feature, Syntax, Type } from '../Enum.js';
import { MethodParser } from './MethodParser.js';

export class SetupParser extends DataParser {
  parseDataValue({ name, value, nodeTyping, nodeComment }) {
    if (this.compositionComputedKeys.includes(value.$kind)) {
      this.parseDataValueComputed({ name, value, nodeTyping, nodeComment });
    } else if (value.type === Type.function) {
      this.parseDataValueMethod({ name, value, nodeTyping, nodeComment });
    } else {
      this.parseDataValueRaw({ name, value, nodeTyping, nodeComment });
    }
  }

  parseDataValueComputed({ name, nodeTyping, nodeComment }) {
    if (this.features.includes(Feature.computed)) {
      new ComputedParser(this.root).parseComputedValue({
        name,
        node: this.nodes[name].node,
        nodeTyping,
        nodeComment,
      });
    }
  }

  parseDataValueMethod({ name, nodeTyping, nodeComment }) {
    if (this.features.includes(Feature.methods)) {
      const { node = nodeTyping, nodeComment: nComment = nodeComment } = this.nodes[name] || {};

      if (!node.key) {
        node.key = node.id || nodeComment.key || nodeTyping.id;
      }

      new MethodParser(this.root).parseMethodProperty(node, node, nComment, {
        parseEvents: false,
        hooks: CompositionHooks,
      });
    }
  }

  parseCallExpression(node) {
    if (node.callee.name === 'expose' && node.arguments.length) {
      const exposedValue = this.getValue(node.arguments[0]);

      if (exposedValue.type === Type.object) {
        Object.keys(exposedValue.value).forEach((name) => this.parseDataValue({
          name,
          value: this.scope[name],
          nodeComment: this.nodes[name].nodeComment,
          nodeTyping: this.nodes[name].nodeTyping,
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
