const { AbstractParser } = require('./AbstractParser')

class AbstractLiteralParser extends AbstractParser {
  /* eslint-disable no-unused-vars */
  /* eslint-disable class-methods-use-this */
  parse (node) {
    throw new Error('Call AbstractLiteralParser.abstract parse() method')
  }
}

module.exports.AbstractLiteralParser = AbstractLiteralParser
