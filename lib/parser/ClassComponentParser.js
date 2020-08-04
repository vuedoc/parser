const { ScriptParser } = require('./ScriptParser')

// eslint-disable-next-line max-len
const { DataParser } = require('./DataParser')
const { PropParser } = require('./PropParser')
const { EventParser } = require('./EventParser')
const { MethodParser } = require('./MethodParser')
const { ClassComponentComputedParser } = require('./ClassComponentComputedParser')
const { ClassComponentDataParser } = require('./ClassComponentDataParser')

const { NameEntry } = require('../entity/NameEntry')
const { PropEntry } = require('../entity/PropEntry')
const { DataEntry } = require('../entity/DataEntry')
const { ModelEntry } = require('../entity/ModelEntry')
const { EventEntry } = require('../entity/EventEntry')
const { ComputedEntry } = require('../entity/ComputedEntry')

const { StringUtils } = require('../StringUtils')
const { Syntax, DEFAULT_TYPE, Features } = require('../Enum')

class ClassComponentParser extends ScriptParser {
  constructor (root) {
    super(root, root.source)

    this.options = root.root.options
  }

  parse (node) {
    this.parseName(node)
    this.parseCommentNode(node)

    node.body.body.forEach((property) => {
      if (property.static) {
        return // ignore static members
      }

      switch (property.type) {
        case Syntax.ClassProperty:
          this.parseClassProperty(property)
          break

        case Syntax.ClassMethod:
          this.parseClassMethod(property)
          break

        case Syntax.ClassPrivateMethod:
          this.parseClassMethod(property, 'private')
          break
      }
    })
  }

  parseClassProperty (node) {
    const type = this.getTSType(node)
    const parsingResult = this.parseClassMember(type, node)

    if (!parsingResult && this.features.includes(Features.data)) {
      const ref = this.getValue(node.value)
      const dataEntry = new DataEntry(node.key.name, {
        type: type || ref.type,
        value: ref.value
      })

      DataParser.mergeEntryKeywords(dataEntry)
      this.emit(dataEntry)
    }
  }

  parseClassMethod (node, defaultVisibility = this.emitter.options.defaultMethodVisibility) {
    switch (node.kind) {
      case 'constructor':
        this.parseContructor(node.body)
        break

      case 'get':
        if (this.features.includes(Features.computed)) {
          new ClassComponentComputedParser(this.root).parse(node)
        }
        break

      case 'method':
        if (!this.parseClassMember(DEFAULT_TYPE, node)) {
          const ref = this.getValue(node.key)

          if (ref.value === Features.data) {
            new DataParser(this.root).parse(node)
          } else {
            new MethodParser(this.root, { defaultVisibility }).parseMethodProperty(node, node.body)
          }
        }
        break
    }
  }

  parseClassMember (type, node) {
    if (node.decorators) {
      return node.decorators.some((decorator) => {
        switch (decorator.expression.type) {
          case Syntax.CallExpression:
            switch (decorator.expression.callee.name) {
              case 'Prop':
                if (this.features.includes(Features.props)) {
                  this.parsePropDecorator(node, decorator, type, node.key.name)
                }
                return true

              case 'PropSync':
                this.parsePropSyncDecorator(node, decorator, type, node.key.name)
                return true

              case 'Model':
                this.parseModelDecorator(node, decorator, type, node.key.name)
                return true

              case 'Emit':
                this.parseEmitDecorator(node, decorator, type, node.key.name)
                return true
            }
            break
        }

        return false
      })
    }

    return false
  }

  parseName ({ id }) {
    if (this.features.includes(Features.name)) {
      const entry = new NameEntry(id.name)

      this.emit(entry)
    }
  }

  parsePropDecoratorArgument (argument, prop) {
    switch (argument.type) {
      case Syntax.Identifier:
        prop.type = argument.name
        break

      case Syntax.ArrayExpression:
        prop.type = argument.elements.map(({ name }) => name)
        break

      case Syntax.ObjectExpression: {
        const { value } = this.getValue(argument)

        if (value.type) {
          prop.type = value.type.value
        }

        if (value.required) {
          prop.required = value.required.value
        }

        if (value.default) {
          prop.defaultValue = value.default.value

          if (prop.type === DEFAULT_TYPE) {
            prop.type = value.default.type
          }
        }
        break
      }
    }
  }

  parsePropDecorator (node, decorator, type, name) {
    const prop = {
      type,
      required: false,
      defaultValue: undefined
    }

    if (decorator.expression.arguments.length) {
      const argument = decorator.expression.arguments[0]

      this.parsePropDecoratorArgument(argument, prop)
    }

    const entry = new PropEntry(StringUtils.toKebabCase(name), {
      type: prop.type,
      value: prop.defaultValue,
      required: prop.required
    })

    new PropParser(this.root).parseEntry(entry, node)
  }

  parsePropSyncDecorator (node, decorator, type, computedName) {
    const [ propNameArg, propObjectArg ] = decorator.expression.arguments
    const propName = this.getValue(propNameArg)

    if (this.features.includes(Features.props)) {
      const prop = {
        type,
        required: false,
        defaultValue: undefined
      }

      if (propObjectArg) {
        this.parsePropDecoratorArgument(propObjectArg, prop)
      }

      const propEntry = new PropEntry(StringUtils.toKebabCase(propName.value), {
        type: prop.type,
        value: prop.defaultValue,
        required: prop.required
      })

      new PropParser(this.root).parseEntry(propEntry, node)
    }

    if (this.features.includes(Features.computed)) {
      const computedEntry = new ComputedEntry(computedName, [ propName.value ])

      this.emit(computedEntry)
    }

    if (this.features.includes(Features.events)) {
      const eventEntry = new EventEntry(`update:${propName.value}`, [ propName.value ])

      this.emit(eventEntry)
    }
  }

  parseModelDecorator (node, decorator, type, propName) {
    const [ eventNameArg, propObjectArg ] = decorator.expression.arguments

    if (this.features.includes(Features.props)) {
      const prop = {
        type,
        required: false,
        defaultValue: undefined
      }

      if (propObjectArg) {
        this.parsePropDecoratorArgument(propObjectArg, prop)
      }

      const propEntry = new PropEntry(StringUtils.toKebabCase(propName), {
        type: prop.type,
        value: prop.defaultValue,
        required: prop.required,
        describeModel: true
      })

      new PropParser(this.root).parseEntry(propEntry, node)
    }

    if (this.features.includes(Features.model)) {
      const { value: eventName } = this.getValue(eventNameArg)
      const modelEntry = new ModelEntry(propName, eventName)

      this.emit(modelEntry)
    }
  }

  parseEmitDecorator (node, decorator, type, methodName) {
    const { params } = node

    new MethodParser(this.root, {
      defaultVisibility: this.emitter.options.defaultMethodVisibility
    }).parseMethodProperty(node, node.body, false)

    if (this.features.includes(Features.events)) {
      const [ eventNameArg ] = decorator.expression.arguments
      const eventName = eventNameArg
        ? this.getValue(eventNameArg).value
        : methodName

      const eventNameKebab = StringUtils.toKebabCase(eventName)

      new EventParser(this.root, this.scope)
        .parseEventNode(node, eventNameKebab, params)
    }
  }

  getTSType (node) {
    return node.typeAnnotation
      ? this.getSourceString(node.typeAnnotation.typeAnnotation)
      : DEFAULT_TYPE
  }

  parseContructor ({ body }) {
    body.forEach((node) => {
      switch (node.expression.type) {
        case Syntax.CallExpression:
          new EventParser(this.root).parse(node)
          break

        case Syntax.AssignmentExpression:
          if (this.features.includes(Features.data)) {
            this.parseAssignmentExpression(node.expression, node)
          }
          break
      }
    })
  }

  parseAssignmentExpression (node, parent = node) {
    switch (node.left.type) {
      case Syntax.MemberExpression:
        this.parseAssignmentMemberExpression(node, parent)
        break

      default:
        super.parseAssignmentExpression(node)
    }
  }

  parseAssignmentMemberExpression (node, parent = node) {
    switch (node.left.object.type) {
      case Syntax.ThisExpression:
        new ClassComponentDataParser(this.root).parse(parent)
        break

      default:
        super.parseAssignmentMemberExpression(node)
    }
  }
}

module.exports.ClassComponentParser = ClassComponentParser
