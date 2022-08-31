import { ScriptParser } from './ScriptParser.js';
import { AbstractExpressionParser } from './AbstractExpressionParser.js';
import { EventEntry, EventArgumentGenerator } from '../entity/EventEntry.js';

import { JSDoc } from '../lib/JSDoc.js';
import { Syntax, Type, Tag } from '../lib/Enum.js';
import { KeywordsUtils } from '../utils/KeywordsUtils.js';
import { Parser } from '../../types/Parser.js';
import { Entry } from '../../types/Entry.js';

import * as Babel from '@babel/types';

const VMODEL_EVENT_NAME = 'update:modelValue';

function normalizeType(type: string) {
  return type in Syntax ? Type.unknown : type;
}

export class EventParser extends AbstractExpressionParser {
  eventsEmmited: string[];

  constructor(root: ScriptParser<any, any>, emitter: Parser.Interface, source: Parser.Script, scope: Parser.Scope<any, any>) {
    super(root, emitter, source, scope);

    this.eventsEmmited = [];
  }

  emit(entry: Entry.EventEntry) {
    if (!this.eventsEmmited.includes(entry.name)) {
      super.emit(entry);
      this.eventsEmmited.push(entry.name);
    }
  }

  parse(node) {
    if (node.typeParameters) {
      this.parseTSTypeParameterInstantiation(node.typeParameters);
    } else if (this.source.attrs.setup) {
      switch (node.type) {
        case Syntax.StringLiteral:
          this.parseArrayExpressionElement(node);
          break;

        case Syntax.ObjectProperty:
          this.parseObjectExpressionProperty(node);
          break;

        default:
          super.parse(node);
          break;
      }
    } else {
      super.parse(node);
    }
  }

  parseArrayExpression(node) {
    for (const item of node.elements) {
      if (item.value === VMODEL_EVENT_NAME) {
        break;
      }

      this.parseEntryNode(item, item.value, []);
    }
  }

  parseTSTypeParameterInstantiation(node) {
    const param = node.params[0];

    switch (param?.type) {
      case Syntax.TSTypeLiteral:
        this.parseTSTypeLiteral(param);
        break;

      case Syntax.TSTypeReference: {
        const ref = this.getScopeValue(param.typeName.name);

        if (ref) {
          this.parseTSTypeReference(ref.node.type);
        }
        break;
      }
    }
  }

  parseTSTypeReference(node) {
    switch (node.type) {
      case Syntax.TSTypeLiteral:
        this.parseTSTypeLiteral(node);
        break;

      case Syntax.TSInterfaceBody:
        this.parseTSInterfaceBody(node);
        break;
    }
  }

  parseTSTypeLiteral(node) {
    node.members.forEach((member) => this.parseTypedMember(member));
  }

  parseTSInterfaceBody(node) {
    node.body.forEach((member) => this.parseTypedMember(member));
  }

  parseTypedMember(member) {
    switch (member.type) {
      case Syntax.TSCallSignatureDeclaration: {
        const [eventNode, argNode] = member.parameters;
        const eventName = eventNode.typeAnnotation.typeAnnotation.literal.value;
        const args: Entry.Param[] = [];

        if (argNode) {
          const arg = EventArgumentGenerator.next().value;

          arg.name = argNode.name;
          arg.type = this.getTSType(argNode);

          args.push(arg);
        }

        this.parseEntryNode(member, eventName, args);
        break;
      }
    }
  }

  parseArrayExpressionElement(node) {
    const ref = this.getValue(node);

    this.parseEntryNode(node, ref.value, []);
  }

  parseObjectExpressionProperty(property) {
    const camelName = this.parseKey(property);

    if (camelName === VMODEL_EVENT_NAME) {
      return;
    }

    if (property.value) {
      if (EventParser.isFunction(property.value) && property.value.params.length > 0) {
        const paramValue = this.getValue(property.value.params[0]);
        const arg = EventArgumentGenerator.next().value;

        arg.name = paramValue.raw;
        arg.type = paramValue.type;

        this.parseEntryNode(property, camelName, [arg]);
      } else {
        this.parseEntryNode(property, camelName, []);
      }
    }
  }

  getValue(node: Babel.Node | null) {
    switch (node?.type) {
      case Syntax.ObjectPattern:
      case Syntax.ObjectExpression:
        return this.getSourceValue(node, Type.object);

      case Syntax.MemberExpression:
        return this.getSourceValue(node);
    }

    return super.getValue(node);
  }

  getArgument(node: Babel.Node, argument = EventArgumentGenerator.next().value) {
    switch (node.type) {
      case Syntax.Identifier: {
        const ref = this.getScopeValue(node.name);

        if (ref) {
          if (ref.value.member === false) {
            argument.name = node.name;
            argument.type = ref.value.type;
          } else {
            argument.name = node.name;
          }

          argument.type = argument.type instanceof Array ? argument.type.map(normalizeType) : normalizeType(argument.type);
        } else {
          argument.name = node.name;
        }
        break;
      }

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
        if ('name' in node.property) {
          if (node.object.type === Syntax.ThisExpression) {
            const ref = this.getScopeValue(node.property.name);

            if (ref) {
              argument.type = ref.value.kind;
            }
          }

          argument.name = node.property.name;
        }
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

  parseCallExpression(node: Babel.CallExpression, parent: Babel.ExpressionStatement | Babel.CallExpression = node) {
    switch (node.callee.type) {
      case Syntax.Identifier:
        node.arguments.forEach((argument) => this.parse(argument));
        break;

      case Syntax.MemberExpression:
        if ('name' in node.callee.property) {
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
        }
        break;
    }
  }

  parseEventNode(
    node: Babel.CallExpression,
    name: string,
    args: Array<Babel.Expression | Babel.SpreadElement | Babel.JSXNamespacedName | Babel.ArgumentPlaceholder>,
    parent: Babel.ExpressionStatement | Babel.CallExpression = node
  ) {
    const parsedArgs = args.map((arg) => this.getArgument(arg));

    this.parseEntryNode(parent as Babel.CallExpression, name, parsedArgs);
  }

  parseEntryNode(node: Babel.CallExpression, name: string, args: Entry.Param[]) {
    const entry = new EventEntry(name, args);

    this.parseEntryComment(entry, node);
    JSDoc.parseParams(this, entry.keywords, entry.arguments, EventArgumentGenerator);
    KeywordsUtils.parseCommonEntryTags(entry);

    const [keyword] = KeywordsUtils.extract(entry.keywords, Tag.event, true);

    if (keyword && keyword.description) {
      entry.name = keyword.description;
    }

    this.emit(entry);
  }

  parseExpressionStatement(node: Babel.ExpressionStatement) {
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
