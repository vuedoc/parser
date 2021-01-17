const { JSDoc } = require('../JSDoc');
const { KeywordsUtils } = require('../utils/KeywordsUtils');

const { AbstractExpressionParser } = require('./AbstractExpressionParser');
const { EventParser } = require('./EventParser');

const { MethodEntry, MethodParam, MethodParamGenerator } = require('../entity/MethodEntry');
const { Syntax, Feature, Properties, Type, Visibility, Tag } = require('../Enum');

const hasReturnStatementCallback = (node) => node.type === Syntax.ReturnStatement;

function getBlockStatement (node) {
  let block = null;

  switch (node.type) {
    case Syntax.ObjectMethod:
    case Syntax.ClassPrivateMethod:
    case Syntax.FunctionExpression:
    case Syntax.ArrowFunctionExpression:
      block = node.body;
      break;

    case Syntax.ObjectProperty:
      if (node.value.type === Syntax.ArrowFunctionExpression) {
        block = node.value.body.type === Syntax.BlockStatement
          ? node.value.body
          : node.value;
      } else {
        block = node.value;
      }
      break;
  }

  return block;
}

function parseMethodName (entry) {
  const [ keyword ] = KeywordsUtils.extract(entry.keywords, Tag.method, true);

  if (keyword && keyword.description) {
    entry.name = keyword.description;
  }
}

class MethodParser extends AbstractExpressionParser {
  constructor (root, { defaultVisibility = Visibility.public } = {}) {
    super(root);

    this.defaultVisibility = defaultVisibility;
  }

  static parseEntrySyntax (entry, node, { syntaxPrefix = '' } = {}) {
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

  getParam (node) {
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

  getParams (params = []) {
    return params.map((item) => this.getParam(item)).filter(({ name }) => name);
  }

  parseObjectExpressionProperty (property) {
    switch (property.type) {
      case Syntax.ObjectProperty:
        this.parseMethodProperty(property, property.value);
        break;

      case Syntax.ObjectMethod:
        this.parseMethodProperty(property, property);
        break;
    }
  }

  parseMethodProperty (node, property, parseEvents = true) {
    const name = this.parseKey(node);

    if (!Properties.hasOwnProperty(name)) { // ignore hooks
      const paramsNode = property.params ? property : node;
      const params = this.getParams(paramsNode.params);
      const entry = new MethodEntry(name, params);

      this.parseEntryComment(entry, node, this.defaultVisibility);
      parseMethodName(entry);
      KeywordsUtils.parseCommonEntryTags(entry);
      JSDoc.parseParams(this, entry.keywords, entry.params, MethodParamGenerator);
      this.parseEntryReturns(entry, node);
      entry.params.forEach(MethodParam.parse);
      MethodParser.parseEntrySyntax(entry, paramsNode);
      this.emit(entry);
    }

    if (parseEvents && this.features.includes(Feature.events)) {
      new EventParser(this.root, this.scope).parse(property);
    }
  }

  parseEntryReturns ({ keywords, returns }, node) {
    if (node.returnType) {
      returns.type = this.getValue(node.returnType.typeAnnotation).value;
    } else {
      const block = getBlockStatement(node);

      if (block) {
        switch (block.type) {
          case Syntax.BlockStatement:
            returns.type = block.body.some(hasReturnStatementCallback)
              ? Type.unknown
              : returns.type;
            break;

          case Syntax.ArrowFunctionExpression:
            returns.type = Type.unknown;
            break;

          case Syntax.Identifier:
          case Syntax.CallExpression:
            returns.type = Type.unknown;
            break;
        }

        if (node.async) {
          returns.type = block.type === Syntax.BlockStatement && returns.type !== Type.void
            ? `${Type.Promise}<${returns.type}>`
            : Type.Promise;
        }
      }
    }

    JSDoc.parseReturns(keywords, returns);
  }
}

module.exports.MethodParser = MethodParser;
