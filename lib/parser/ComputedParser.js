import { AbstractExpressionParser } from './AbstractExpressionParser.js';
import { EventParser } from './EventParser.js';

import { ComputedEntry } from '../entity/ComputedEntry.js';
import { Value } from '../entity/Value.js';

import { Syntax, Tag, Type, Visibility } from '../Enum.js';
import { KeywordsUtils } from '../utils/KeywordsUtils.js';

const RE_THIS_EXPRESSION = /this\.([a-z0-9_$]+)/ig;
const RE_THIS_DESTRUCTURING_EXPRESSION = /\{(([a-z0-9_$.,\s]+)((\s*:\s*[a-z0-9_$.,\s]+)|(\s*=\s*.+))?)\}\s*=\s*this;?/ig;

function parseDependenciesFromThisExpression(source, dependencies) {
  let index = 0;

  while (index < source.length && index !== -1) {
    const matches = RE_THIS_EXPRESSION.exec(source);

    if (!matches) {
      break;
    }

    index = matches.index;

    dependencies.add(matches[1]);
  }
}

function parseDependenciesFromDestructuringThis(source, dependencies) {
  let index = 0;

  while (index < source.length && index !== -1) {
    const matches = RE_THIS_DESTRUCTURING_EXPRESSION.exec(source);

    if (!matches) {
      break;
    }

    index = matches.index;

    matches[1]
      .split(',')
      .map((item) => item.split(/[:=]/)[0])
      .map((item) => item.trim())
      .filter((item) => !item.startsWith('...'))
      .forEach((item) => dependencies.add(item));
  }
}

export class ComputedParser extends AbstractExpressionParser {
  getDependencies(node) {
    const dependencies = new Set();
    const source = this.source.content.substring(node.start, node.end - 1);

    parseDependenciesFromThisExpression(source, dependencies);
    parseDependenciesFromDestructuringThis(source, dependencies);

    return [...dependencies.values()];
  }

  getBlockStatement(node) {
    let block = null;
    let returnType = null;

    switch (node.type) {
      case Syntax.ObjectProperty:
        block = node.value;
        break;

      case Syntax.ObjectExpression:
        for (const item of node.properties) {
          switch (item.key.name) {
            case 'get':
              block = this.getBlockStatement(item).block;

              if (item.returnType) {
                returnType = item.returnType;
              }
              break;

            case 'set':
              new EventParser(this.root, this.scope).parse(item);
              break;
          }
        }
        break;

      case Syntax.BlockStatement:
        block = node;
        break;

      default:
        if (ComputedParser.isFunction(node)) {
          block = node.body;
        }
        break;
    }

    return { block, returnType };
  }

  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseCallExpression(node) {
    // ignore call expression on Computed Property
  }

  parseObjectExpressionProperty(property) {
    const name = this.parseKey(property);

    this.parseComputedValue({ name, node: property, nodeComment: property });
  }

  parseComputedValue({ name, node, nodeComment, nodeTyping = null }) {
    const entry = new ComputedEntry({ name });

    switch (node.type) {
      case Syntax.ObjectMethod:
      case Syntax.FunctionExpression:
      case Syntax.ArrowFunctionExpression:
        this.parseEntry(entry, node.body, node, nodeComment, nodeTyping);
        break;

      case Syntax.ObjectProperty:
        this.parseEntry(entry, node.value, node, nodeComment, nodeTyping);
        break;

      case Syntax.ObjectExpression:
        this.parseEntry(entry, node, node, nodeComment, nodeTyping);
        break;
    }
  }

  parseEntry(entry, body, node, nodeComment = node, nodeTyping = null) {
    if (body) {
      if (node.returnType) {
        entry.type = this.getTSType(node.returnType, Type.unknown);
      } else if (ComputedParser.isFunction(node)) {
        entry.type = this.parseReturnType(body);
      }

      // dependencies
      const { block, returnType } = this.getBlockStatement(body);

      if (returnType) {
        entry.type = this.getTSType(returnType, entry.type);
      }

      if (block) {
        const dependencies = this.getDependencies(block);

        entry.dependencies.push(...dependencies);
      }
    }

    if (nodeTyping) {
      entry.type = this.getTSType(nodeTyping, entry.type);
    }

    const value = new Value(Type.unknown, undefined, Type.undefined);

    value.member = true;

    this.root.setScopeValue(entry.name, body, value);
    this.parseEntryComment(entry, nodeComment);
    KeywordsUtils.mergeEntryKeyword(entry, Tag.type);
    KeywordsUtils.parseCommonEntryTags(entry);

    if (nodeComment.accessibility) {
      entry.visibility = nodeComment.accessibility;
    } else if (nodeComment.type === Syntax.ClassPrivateMethod) {
      entry.visibility = Visibility.private;
    }

    this.emit(entry);
  }

  parseReturnType(node) {
    const returnNode = node.body?.find(({ type }) => type === Syntax.ReturnStatement);

    if (returnNode) {
      switch (returnNode.argument.type) {
        case Syntax.BinaryExpression:
          return this.parseType(returnNode.argument.left);

        default:
          return this.parseType(returnNode.argument);
      }
    }

    return this.parseType(node);
  }
}
