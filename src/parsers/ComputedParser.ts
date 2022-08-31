import { AbstractExpressionParser } from './AbstractExpressionParser.js';

import { ComputedEntry } from '../entity/ComputedEntry.js';
import { Value } from '../entity/Value.js';

import { Syntax, Tag, Type, Visibility } from '../lib/Enum.js';
import { KeywordsUtils } from '../utils/KeywordsUtils.js';
import { Entry } from '../../types/Entry.js';

import * as Babel from '@babel/types';

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
  getDependencies(node): string[] {
    const dependencies = new Set<string>();
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

  parse(node: Babel.Node) {
    switch (node.type) {
      case Syntax.ArrayExpression:
        this.parseArrayExpression(node);
        break;

      default:
        super.parse(node);
        break;
    }
  }

  parseArrayExpression(node: Babel.ArrayExpression) {
    for (const element of node.elements) {
      switch (element.type) {
        case Syntax.Identifier:
          this.parseIdentifierNode(element.name, element);
          break;

        case Syntax.StringLiteral:
          this.parseIdentifierNode(element.value, element);
          break;
      }
    }
  }

  parseIdentifierNode(name: string, node) {
    node.key = { name };

    const ref = this.getScopeValue(name);

    if (ref) {
      this.parseComputedValue({
        name,
        node: ref.node.value,
        nodeComment: node,
      });
    } else {
      this.parseComputedValue({
        name,
        node,
        nodeComment: node,
      });
    }
  }

  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseCallExpression(_node: Babel.CallExpression) {
    // ignore call expression on Computed Property
  }

  parseObjectExpressionProperty(property) {
    const name = this.parseKey(property);

    this.parseComputedValue({ name, node: property, nodeComment: property });
  }

  parseComputedValue({ name, node, nodeComment, nodeTyping = null, type = null }) {
    const entry = new ComputedEntry({ name });

    switch (node.type) {
      case Syntax.ObjectProperty:
        if (ComputedParser.isFunction(node.value)) {
          this.parseEntry(entry, node, node.value.body, nodeComment, nodeTyping, type);
        } else if ('properties' in node.value) {
          this.parseComputedValue({ name, node: node.value, nodeComment, nodeTyping, type });
        } else {
          this.parseEntry(entry, node, node, nodeComment, nodeTyping, type);
        }
        break;

      case Syntax.ObjectExpression: {
        let foundGetOrSet = false;

        for (const property of node.properties) {
          if (property.type === Syntax.SpreadElement) {
            continue;
          }

          switch (this.parseKey(property)) {
            case 'get':
              foundGetOrSet = true;
              this.parseEntry(entry, node, property.value || property, nodeComment, nodeTyping, type);
              break;

            case 'set':
              foundGetOrSet = true;

              if (this.root.enableNestedEventsParsing) {
                this.root.parsers.events.sync(this.scope).parse(property.value || property);
              }
              break;
          }
        }

        if (!foundGetOrSet) {
          this.parseEntry(entry, node, node, nodeComment, nodeTyping, type);
        }
        break;
      }

      default:
        if (ComputedParser.isFunction(node)) {
          this.parseEntry(entry, node, node.body, nodeComment, nodeTyping, type);
        } else {
          this.parseEntry(entry, node, node, nodeComment, nodeTyping, type);
        }
        break;
    }
  }

  parseEntry(entry: Entry.ComputedEntry, node, body, nodeComment = node, nodeTyping = null, type = null) {
    if (ComputedParser.isFunction(node)) {
      entry.type = type || this.getReturnType(node);
    }

    if (body) {
      // dependencies
      const { block, returnType } = this.getBlockStatement(body);

      if (!node.returnType && returnType) {
        entry.type = type || this.getTSType(returnType, entry.type);
      }

      if (block) {
        const dependencies = this.getDependencies(block);

        entry.dependencies.push(...dependencies);
      }
    }

    if (entry.type === Type.unknown && nodeTyping) {
      entry.type = type || this.getTSType(nodeTyping, entry.type);
    }

    if (entry.type === Type.void) {
      entry.type = Type.unknown;
    }

    const value = new Value(entry.type, undefined, Type.undefined);

    value.member = true;

    this.setScopeValue(entry.name, body, value, { global: true });
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
}
