const { AbstractExpressionParser } = require('./AbstractExpressionParser');

const { Value } = require('../entity/Value');
const { EventEntry, EventArgumentGenerator } = require('../entity/EventEntry');

const { JSDoc } = require('../JSDoc');
const { Syntax, Type, Tag } = require('../Enum');
const { KeywordsUtils } = require('../utils/KeywordsUtils');

const UNHANDLED_EVENT_NAME = '***unhandled***';
const UnhandledValue = new Value(Type.string, UNHANDLED_EVENT_NAME, UNHANDLED_EVENT_NAME);

class EventParser extends AbstractExpressionParser {
  emit (entry) {
    if (!this.root.eventsEmmited[entry.name]) {
      super.emit(entry);

      this.root.eventsEmmited[entry.name] = true;
    }
  }

  getValue (node) {
    switch (node.type) {
      case Syntax.Identifier:
        return this.scope.hasOwnProperty(node.name)
          ? this.scope[node.name]
          : UnhandledValue;

      case Syntax.ObjectExpression:
      case Syntax.MemberExpression:
        return this.getSourceValue(node);
    }

    return super.getValue(node);
  }

  getArgument (node, argument = EventArgumentGenerator.next().value) {
    switch (node.type) {
      case Syntax.Identifier:
        argument.name = node.name;
        break;

      case Syntax.SpreadElement:
        argument.name = this.getValue(node.argument).value;
        argument.rest = true;
        break;

      case Syntax.AssignmentExpression:
        argument.name = this.getValue(node.left).value;
        break;

      case Syntax.ObjectExpression:
        argument.name = this.getInlineSourceString(node);
        argument.type = Type.object;
        break;

      case Syntax.MemberExpression:
        argument.name = node.property.name;
        break;

      default: {
        const ref = this.getValue(node);

        argument.name = ref.raw;
        argument.type = ref.type;
        break;
      }
    }

    return argument;
  }

  /**
   * @param {CallExpression} node
   */
  parseCallExpression (node, parent = node) {
    switch (node.callee.type) {
      case Syntax.Identifier:
        node.arguments.forEach((argument) => this.parse(argument));
        break;

      case Syntax.MemberExpression:
        switch (node.callee.property.name) {
          case '$emit':
            if (node.arguments.length) {
              const name = this.getValue(node.arguments[0]);
              const args = node.arguments.slice(1);

              this.parseEventNode(node, name.value, args, parent);
            }
            break;

          case 'then':
          case 'catch':
          case 'finally':
          case 'nextTick':
          case '$nextTick':
            node.arguments.forEach((argument) => this.parse(argument));
            break;
        }
        break;
    }
  }

  parseEventNode (node, name, args, parent = node) {
    const parsedArgs = args.map((arg) => this.getArgument(arg));

    this.parseEntryNode(parent, name, parsedArgs);
  }

  parseEntryNode (node, name, args) {
    const entry = new EventEntry(name, args);

    this.parseEntryComment(entry, node);
    JSDoc.parseParams(entry.keywords, entry.arguments, EventArgumentGenerator);
    KeywordsUtils.parseCommonEntryTags(entry);

    const [ keyword ] = KeywordsUtils.extract(entry.keywords, Tag.event, true);

    if (keyword && keyword.description) {
      entry.name = keyword.description;
    }

    this.emit(entry);
  }

  parseExpressionStatement (node) {
    switch (node.expression.type) {
      case Syntax.CallExpression:
        this.parseCallExpression(node.expression, node);
        break;

      case Syntax.AssignmentExpression:
        this.parseAssignmentExpression(node.expression);
        break;

      default:
        super.parseExpressionStatement(node);
    }
  }
}

module.exports.EventParser = EventParser;
module.exports.UNHANDLED_EVENT_NAME = UNHANDLED_EVENT_NAME;
