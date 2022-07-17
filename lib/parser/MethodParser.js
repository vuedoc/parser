import { JSDoc } from '../JSDoc.js';
import { KeywordsUtils } from '../utils/KeywordsUtils.js';

import { AbstractExpressionParser } from './AbstractExpressionParser.js';
import { EventParser } from './EventParser.js';

import { MethodEntry, MethodParam, MethodParamGenerator } from '../entity/MethodEntry.js';
import { Syntax, Feature, Type, Visibility, Tag, LegacyHooks } from '../Enum.js';
import { Value } from '../entity/Value.js';

const hasReturnStatementCallback = (node) => node.type === Syntax.ReturnStatement;

function getBlockStatement(node) {
  let block = null;

  switch (node.type) {
    case Syntax.ObjectProperty:
      if (node.value.type === Syntax.ArrowFunctionExpression) {
        block = node.value.body.type === Syntax.BlockStatement
          ? node.value.body
          : node.value;
      } else {
        block = node.value;
      }
      break;

    default:
      if (MethodParser.isFunction(node)) {
        block = node.body;
      }
      break;
  }

  return block;
}

function parseMethodName(entry) {
  const [keyword] = KeywordsUtils.extract(entry.keywords, Tag.method, true);

  if (keyword && keyword.description) {
    entry.name = keyword.description;
  }
}

export class MethodParser extends AbstractExpressionParser {
  constructor(root, { defaultVisibility = Visibility.public } = {}) {
    super(root);

    this.defaultVisibility = defaultVisibility;
  }

  static parseEntrySyntax(entry, node, { syntaxPrefix = '' } = {}) {
    KeywordsUtils.mergeEntryKeyword(entry, Tag.syntax, Type.array);

    if (entry.syntax.length === 0) {
      const args = entry.params
        .filter(({ name }) => name.indexOf('.') === -1)
        .map(MethodParam.toString);

      if (node.params && entry.params.length !== node.params.length) {
        const restParamIndex = entry.params.findIndex(({ rest }) => rest);

        if (restParamIndex > -1) {
          args.push(...args.splice(restParamIndex, 1));
          entry.params.push(...entry.params.splice(restParamIndex, 1));
        }
      }

      const returnType = entry.returns.type instanceof Array
        ? entry.returns.type.join(' | ')
        : entry.returns.type;

      let chunk = syntaxPrefix;

      if (node.generator) {
        chunk += '*';
      }

      chunk += node.async ? `async ${entry.name}` : entry.name;
      chunk += `(${args.join(', ')}): ${returnType}`;

      entry.syntax.push(chunk);
    }
  }

  getParam(node) {
    const param = MethodParamGenerator.next().value;

    switch (node.type) {
      case Syntax.Identifier:
        param.name = node.name;
        break;

      case Syntax.RestElement:
        param.name = node.argument.name;
        param.rest = true;
        break;

      case Syntax.AssignmentPattern: {
        const ref = this.getValue(node.right);

        param.name = node.left.name;
        param.type = ref.kind;
        param.defaultValue = ref.raw;
        break;
      }

      case Syntax.ObjectPattern:
      case Syntax.ObjectExpression:
        param.name = this.getSourceString(node);
        break;
    }

    if (node.typeAnnotation) {
      param.type = this.getValue(node.typeAnnotation.typeAnnotation).value;
    }

    return param;
  }

  parseObjectExpressionProperty(property) {
    switch (property.type) {
      case Syntax.ObjectProperty:
        this.parseMethodProperty(property, property.value);
        break;

      case Syntax.ObjectMethod:
        this.parseMethodProperty(property, property);
        break;
    }
  }

  parseMethodProperty(node, property, nodeComment = node, { parseEvents = true, hooks = LegacyHooks } = {}) {
    if (this.root.features.includes(Feature.methods)) {
      const name = this.parseKey(node);

      if (!hooks.includes(name)) { // ignore hooks
        const paramsNode = property.params ? property : node;
        const paramsList = paramsNode.params ? paramsNode.params.map((item) => this.getParam(item)) : [];
        const params = paramsList.filter(({ name }) => name);
        const entry = new MethodEntry(name, params);

        paramsList.forEach((param, index) => this.setScopeValue(
          param.name,
          paramsNode.params[index],
          new Value(param.type, param.defaultValue),
          { forceType: true }
        ));

        this.parseEntryComment(entry, nodeComment, this.defaultVisibility);
        parseMethodName(entry);
        KeywordsUtils.parseCommonEntryTags(entry);
        JSDoc.parseParams(this, entry.keywords, entry.params, MethodParamGenerator);
        this.parseEntryReturns(entry, node, property);
        entry.params.forEach(MethodParam.parse);
        MethodParser.parseEntrySyntax(entry, paramsNode);
        this.emit(entry);
      }
    }

    if (parseEvents && this.features.includes(Feature.events)) {
      new EventParser(this.root, this.scope).parse(property);
    }
  }

  parseEntryReturns({ keywords, returns }, node, property) {
    if (node.returnType) {
      returns.type = this.getValue(node.returnType.typeAnnotation).value;
    } else {
      const block = getBlockStatement(node) || getBlockStatement(property);

      if (block) {
        switch (block.type) {
          case Syntax.BlockStatement: {
            const returnNode = block.body.find(hasReturnStatementCallback);

            if (returnNode) {
              const returnValue = this.getValue(returnNode.argument);

              if (returnValue.type !== Type.object) {
                returns.type = returnValue.type;
              }
            }
            break;
          }

          case Syntax.ArrowFunctionExpression:
            returns.type = Type.unknown;
            break;

          case Syntax.Identifier:
          case Syntax.CallExpression:
            returns.type = Type.unknown;
            break;

          case Syntax.UpdateExpression:
            returns.type = Type.number;
            break;

          case Syntax.BinaryExpression:
            returns.type = this.getBinaryExpression(block).type;
            break;
        }

        if (node.async) {
          returns.type = block.type === Syntax.BlockStatement && returns.type !== Type.void
            ? `${Type.Promise}<${returns.type}>`
            : Type.Promise;
        }
      } else if (node.type === Syntax.Identifier || node.type === Syntax.CallExpression) {
        returns.type = Type.unknown;
      }
    }

    JSDoc.parseReturns(keywords, returns);
  }
}
