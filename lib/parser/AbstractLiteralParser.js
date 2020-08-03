const { AbstractParser } = require('./AbstractParser')
const { Syntax } = require('../Enum')

class AbstractLiteralParser extends AbstractParser {
  parse (node) {
    switch (node.type) {
      case Syntax.ObjectProperty:
        this.parseObjectProperty(node)
        break
    }
  }

  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  /* istanbul ignore next */
  parseObjectProperty (node) {
    throw new Error('Call AbstractLiteralParser.abstract parse() method')
  }
}

module.exports.AbstractLiteralParser = AbstractLiteralParser
