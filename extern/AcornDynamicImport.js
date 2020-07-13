/**
 * This is a port of the originally ES6 Acorn plugin Dynamic import
 * written in ES6 written by Jordan Gensler (kesne)
 * and available on https://github.com/kesne/acorn-dynamic-import
 * The transpiled library is not compatible with Node.js
 * This is just a copy-paste of the original code with the Node.js
 * compatible syntax
 */

/* eslint-disable no-underscore-dangle */
/* istanbul ignore file */

'use strict'

const acorn = require('acorn')
const tt = acorn.tokTypes

const DynamicImportKey = 'Import';

// NOTE: This allows `yield import()` to parse correctly.
tt._import.startsExpr = true;

function parseDynamicImport() {
  const node = this.startNode();
  this.next();
  if (this.type !== tt.parenL) {
    this.unexpected();
  }
  return this.finishNode(node, DynamicImportKey);
}

function parenAfter() {
  return /^(\s|\/\/.*|\/\*[^]*?\*\/)*\(/.test(this.input.slice(this.pos));
}

module.exports = function dynamicImport(Parser) {
  return class extends Parser {
    parseStatement(context, topLevel, exports) {
      if (this.type === tt._import && parenAfter.call(this)) {
        return this.parseExpressionStatement(this.startNode(), this.parseExpression());
      }
      return super.parseStatement(context, topLevel, exports);
    }

    parseExprAtom(refDestructuringErrors) {
      if (this.type === tt._import) {
        return parseDynamicImport.call(this);
      }
      return super.parseExprAtom(refDestructuringErrors);
    }
  };
}
