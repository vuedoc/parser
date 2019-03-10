const acorn = require('acorn')

const { AbstractParser } = require('./AbstractParser')
const { NameParser } = require('./NameParser')
const { PropParser } = require('./PropParser')
const { DataParser } = require('./DataParser')
const { ComputedParser } = require('./ComputedParser')
const { MethodParser } = require('./MethodParser')
const { EventParser } = require('./EventParser')

const {
  VariableDeclaration,
  ExportDefaultDeclaration,
  ObjectExpression,
  CallExpression,
  PROPERTY_NAME,
  PROPERTY_PROPS,
  PROPERTY_DATA,
  PROPERTY_COMPUTED,
  PROPERTY_METHODS,
  PROPERTIES
} = require('../Enum')

class ScriptParser extends AbstractParser {
  /**
   * @param {Parser} parser - The Parser object
   */
  constructor (root) {
    super(root)

    this.source = root.script
    this.ast = acorn.parse(this.source, root.options)
  }

  parse () {
    this.ast.body.forEach((node) => {
      switch (node.type) {
        case VariableDeclaration:
          this.parseVariableDeclaration(node)
          break

        case ExportDefaultDeclaration:
          this.parseExportDefaultDeclaration(node.declaration)
          break

        default:
          throw new Error(`Unknow walker type: ${node.key.name}`)
      }
    })
  }

  parseExportDefaultDeclaration (node) {
    switch (node.type) {
      case ObjectExpression:
        node.properties
          .filter(({ key }) => PROPERTIES.includes(key.name))
          .forEach((property) => this.parseFeature(property))
        break

      case CallExpression:
        if (node.arguments.length) {
          this.parseExportDefaultDeclaration(node.arguments[0])
        }
        break

      default:
        throw new Error(`Unknow ExportDefaultDeclaration node: ${node.type}`)
    }
  }

  parseFeature (property) {
    let parser = null

    switch (property.key.name) {
      case PROPERTY_NAME:
        parser = new NameParser(this)
        break

      case PROPERTY_DATA:
        parser = new DataParser(this)
        break

      case PROPERTY_PROPS:
        parser = new PropParser(this)
        break

      case PROPERTY_COMPUTED:
        parser = new ComputedParser(this)
        break

      case PROPERTY_METHODS:
        parser = new MethodParser(this)
        break

      default:
        parser = new EventParser(this)
        break
    }

    parser.parse(property.value)
  }
}

module.exports.ScriptParser = ScriptParser
