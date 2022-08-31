import { JSDoc } from '../lib/JSDoc.js';
import { KeywordsUtils } from '../utils/KeywordsUtils.js';
import { Entry } from '../../types/Entry.js';

import { AbstractExpressionParser } from './AbstractExpressionParser.js';
import { ScriptParser } from './ScriptParser.js';

import { MethodEntry, MethodParam, MethodParamGenerator } from '../entity/MethodEntry.js';
import { Syntax, Feature, Type, Visibility, Tag, LegacyHooks } from '../lib/Enum.js';
import { Value } from '../entity/Value.js';

import * as Babel from '@babel/types';

function parseMethodName(entry) {
  const [keyword] = KeywordsUtils.extract(entry.keywords, Tag.method, true);

  if (keyword && keyword.description) {
    entry.name = keyword.description;
  }
}

export class MethodParser extends AbstractExpressionParser {
  defaultVisibility: Entry.Visibility;

  constructor(root: ScriptParser<any, any>, { defaultVisibility = Visibility.public } = {}) {
    super(root, root.emitter, root.source, root.scope);

    this.defaultVisibility = defaultVisibility;
  }

  static parseEntrySyntax(entry: Entry.PropFunction, node, { syntaxPrefix = '' } = {}) {
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
      param.type = this.getTSType(node);
    }

    if (param.type instanceof Array && param.type.at(-1) === Type.undefined) {
      param.optional = true;
      param.type.splice(param.type.length - 1, 1);

      if (param.type.length === 1) {
        param.type = param.type[0];
      }
    }

    if (node.optional) {
      param.optional = node.optional;
    }

    return param;
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
      this.parseMethodProperty(node, ref.node.value);
    } else {
      this.parseMethodProperty(node, {
        params: [],
      });
    }
  }

  parseObjectExpressionProperty(property: Babel.ObjectProperty | Babel.ObjectMethod) {
    switch (property.type) {
      case Syntax.ObjectProperty:
        this.parseMethodProperty(property, property.value);
        break;

      case Syntax.ObjectMethod:
        this.parseMethodProperty(property, property);
        break;
    }
  }

  parseMethodProperty(
    node,
    property,
    nodeComment = node,
    {
      parseEvents = true,
      defaultVisibility = this.defaultVisibility,
      hooks = LegacyHooks as string[],
    } = {}
  ) {
    this.scope = { ...this.root.scope };

    if (this.root.features.includes(Feature.methods)) {
      const name = this.parseKey(node);

      if (!hooks.includes(name)) { // ignore hooks
        const paramsNode = MethodParser.isTsFunction(node)
          ? node.typeAnnotation.typeAnnotation
          : property.params ? property : node;
        const parametersNodes = paramsNode.params || paramsNode.parameters || [];
        const paramsList = parametersNodes.map((item) => this.getParam(item));
        const params = paramsList.filter(({ name }) => name);
        const entry = new MethodEntry(name, params);
        const fnNode = MethodParser.isFunction(property) ? property : node;

        entry.returns.type = this.getReturnType(fnNode, Type.unknown);

        paramsList.forEach((param, index) => {
          const ref = new Value(param.type, param.defaultValue);

          this.setScopeValue(param.name, parametersNodes[index], ref, {
            forceType: true,
          });
        });

        this.parseEntryComment(entry, nodeComment, defaultVisibility);
        parseMethodName(entry);
        KeywordsUtils.parseCommonEntryTags(entry);
        JSDoc.parseParams(this, entry.keywords, entry.params, MethodParamGenerator);
        JSDoc.parseReturns(entry.keywords, entry.returns);
        entry.params.forEach(MethodParam.parse);
        MethodParser.parseEntrySyntax(entry, paramsNode);
        this.emit(entry);
      }
    }

    if (parseEvents && this.features.includes(Feature.events) && this.root.enableNestedEventsParsing) {
      this.root.parsers.events.sync(this.scope).parse(property);
    }

    this.scope = { ...this.root.scope };
  }
}
