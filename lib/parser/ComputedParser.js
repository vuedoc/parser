const { AbstractExpressionParser } = require('./AbstractExpressionParser');
const { EventParser } = require('./EventParser');

const { ComputedEntry } = require('../entity/ComputedEntry');
const { Value } = require('../entity/Value');

const { Syntax, Type, Visibility } = require('../Enum');
const { KeywordsUtils } = require('../utils/KeywordsUtils');

const RE_THIS_EXPRESSION = /this\.([a-z0-9_$]+)/ig;
const RE_THIS_DESTRUCTURING_EXPRESSION = /\{(([a-z0-9_$.,\s]+)((\s*:\s*[a-z0-9_$.,\s]+)|(\s*=\s*.+))?)\}\s*=\s*this;?/ig;

function parseDependenciesFromThisExpression (source, dependencies) {
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

function parseDependenciesFromDestructuringThis (source, dependencies) {
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

class ComputedParser extends AbstractExpressionParser {
  getDependencies (node) {
    const dependencies = new Set();
    const source = this.source.substring(node.start, node.end - 1);

    parseDependenciesFromThisExpression(source, dependencies);
    parseDependenciesFromDestructuringThis(source, dependencies);

    return [ ...dependencies.values() ];
  }

  getBlockStatement (node) {
    let block = null;

    switch (node.type) {
      case Syntax.ObjectProperty:
        block = node.value;
        break;

      case Syntax.ObjectMethod:
      case Syntax.ClassPrivateMethod:
      case Syntax.FunctionExpression:
      case Syntax.ArrowFunctionExpression:
        block = node.body;
        break;

      case Syntax.ObjectExpression:
        for (const item of node.properties) {
          switch (item.key.name) {
            case 'get':
              block = this.getBlockStatement(item);
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
    }

    return block;
  }

  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parseCallExpression (node) {
    // ignore call expression on Computed Property
  }

  parseObjectExpressionProperty (property) {
    const name = this.parseKey(property);
    const entry = new ComputedEntry({ name });

    switch (property.type) {
      case Syntax.ObjectMethod:
      case Syntax.FunctionExpression:
      case Syntax.ArrowFunctionExpression:
        this.parseEntry(entry, property.body, property);
        break;

      case Syntax.ObjectProperty:
        this.parseEntry(entry, property.value, property);
        break;
    }
  }

  parseEntry (entry, node, parent) {
    if (node) {
      switch (parent.type) {
        case Syntax.ObjectMethod:
        case Syntax.ClassMethod:
        case Syntax.ClassPrivateMethod:
          entry.type = this.parseReturnType(node, parent);
          break;
      }

      // dependencies
      const block = this.getBlockStatement(node);

      if (block) {
        const dependencies = this.getDependencies(block);

        entry.dependencies.push(...dependencies);
      }
    }

    const value = new Value(Type.unknown, undefined, Type.undefined);

    value.member = true;

    this.root.setScopeValue(entry.name, node, value);
    this.parseEntryComment(entry, parent);
    KeywordsUtils.parseCommonEntryTags(entry);

    if (parent.accessibility) {
      entry.visibility = parent.accessibility;
    } else if (parent.type === Syntax.ClassPrivateMethod) {
      entry.visibility = Visibility.private;
    }

    this.emit(entry);
  }

  parseReturnType (node, parent) {
    if (parent.returnType) {
      return this.getTSType(parent.returnType, Type.unknown);
    }

    const returnNode = node.body.find(({ type }) => type === Syntax.ReturnStatement);

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

module.exports.ComputedParser = ComputedParser;
