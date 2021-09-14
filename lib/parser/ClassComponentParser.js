const { ScriptParser } = require('./ScriptParser');

// eslint-disable-next-line max-len
const { DataParser } = require('./DataParser');
const { PropParser } = require('./PropParser');
const { EventParser } = require('./EventParser');
const { MethodParser } = require('./MethodParser');
const { ClassComponentComputedParser } = require('./ClassComponentComputedParser');
const { ClassComponentDataParser } = require('./ClassComponentDataParser');

const { NameEntry } = require('../entity/NameEntry');
const { PropEntry } = require('../entity/PropEntry');
const { ModelEntry } = require('../entity/ModelEntry');
const { EventEntry, EventArgument } = require('../entity/EventEntry');
const { ComputedEntry } = require('../entity/ComputedEntry');

const { StringUtils } = require('../utils/StringUtils');
const { Syntax, Type, Feature, Visibility, PropTypesTag } = require('../Enum');
const { Value } = require('../entity/Value');

function createFakeStringLiteralNode (value) {
  return {
    type: Syntax.StringLiteral,
    start: 0,
    end: 0,
    range: [ 0, 0 ],
    leadingComments: undefined,
    trailingComments: undefined,
    innerComments: undefined,
    extra: { rawValue: value, raw: `'${value}'` },
    value,
  };
}

class ClassComponentParser extends ScriptParser {
  constructor (root) {
    super(root, root.source);

    this.options = root.root.options;
  }

  parse (node) {
    this.parseName(node);
    this.parseCommentNode(node);

    node.body.body.forEach((property) => {
      if (property.static) {
        return; // ignore static members
      }

      switch (property.type) {
        case Syntax.ClassProperty:
          this.parseClassProperty(property);
          break;

        case Syntax.ClassMethod:
          this.parseClassMethod(property);
          break;

        case Syntax.ClassPrivateMethod:
          this.parseClassMethod(property, Visibility.private);
          break;
      }
    });
  }

  parseClassProperty (node) {
    const type = this.getTSType(node);
    const parsingResult = this.parseClassMember(type, node);

    if (!parsingResult && this.features.includes(Feature.data)) {
      new ClassComponentDataParser(this.root).parse(node);
    }
  }

  parseClassMethod (node, defaultVisibility = Visibility.public) {
    switch (node.kind) {
      case 'constructor':
        this.parseContructor(node.body);
        break;

      case 'get':
        if (this.features.includes(Feature.computed)) {
          new ClassComponentComputedParser(this.root).parse(node);
        }
        break;

      case 'method':
        if (!this.parseClassMember(Type.unknown, node)) {
          const ref = this.getValue(node.key);

          if (ref.value === Feature.data) {
            new DataParser(this.root).parse(node);
          } else {
            new MethodParser(this.root, { defaultVisibility }).parseMethodProperty(node, node.body);
          }
        }
        break;
    }
  }

  parseClassMember (type, node) {
    if (node.decorators) {
      return node.decorators.some((decorator) => {
        switch (decorator.expression.type) {
          case Syntax.CallExpression:
            switch (decorator.expression.callee.name) {
              case PropTypesTag.Prop:
                if (this.features.includes(Feature.props)) {
                  this.parsePropDecorator(node, decorator, type, node.key.name);
                }
                return true;

              case PropTypesTag.PropSync:
                this.parsePropSyncDecorator(node, decorator, type, node.key.name);
                return true;

              case PropTypesTag.Model:
                this.parseModelDecorator(node, decorator, type, node.key.name);
                return true;

              case PropTypesTag.ModelSync:
                this.parseModelSyncDecorator(node, decorator, type);
                return true;

              case PropTypesTag.VModel:
                this.parseModelVModelDecorator(node, decorator, type);
                return true;

              case PropTypesTag.Ref:
                this.parseRefDecorator(node, decorator, type, node.key.name);
                return true;

              case PropTypesTag.State:
                this.parseStateDecorator(node, decorator, type, node.key.name);
                return true;

              case PropTypesTag.Emit:
                this.parseEmitDecorator(node, decorator, node.key.name);
                return true;
            }
            break;
        }

        return false;
      });
    }

    return false;
  }

  parseName ({ id }) {
    if (this.features.includes(Feature.name)) {
      const entry = new NameEntry(id.name);

      this.emit(entry);
    }
  }

  parsePropDecoratorArgument (argument, prop) {
    switch (argument.type) {
      case Syntax.Identifier:
        prop.type = argument.name;
        break;

      case Syntax.ArrayExpression:
        prop.type = argument.elements.map(({ name }) => name);
        break;

      case Syntax.ObjectExpression: {
        const { value } = this.getValue(argument);

        if (value.type) {
          prop.type = value.type.value;
        }

        if (value.required) {
          prop.required = value.required.value;
        }

        if (value.default) {
          prop.defaultValue = value.default.value;

          if (prop.type === Type.any) {
            prop.type = value.default.type;
          }
        }
        break;
      }
    }
  }

  parsePropDecorator (node, decorator, type, name) {
    const prop = {
      type,
      required: false,
      defaultValue: undefined
    };

    if (decorator.expression.arguments.length) {
      const argument = decorator.expression.arguments[0];

      this.parsePropDecoratorArgument(argument, prop);
    }

    const entry = new PropEntry(StringUtils.toKebabCase(name), {
      type: prop.type,
      value: prop.defaultValue,
      required: prop.required
    });

    new PropParser(this.root).parseEntry(entry, node);
  }

  parsePropSyncDecorator (node, decorator, type, computedName) {
    const [ propNameArg, propObjectArg ] = decorator.expression.arguments;
    const propName = this.getValue(propNameArg);

    if (this.features.includes(Feature.props)) {
      const prop = {
        type,
        required: false,
        defaultValue: undefined
      };

      if (propObjectArg) {
        this.parsePropDecoratorArgument(propObjectArg, prop);
      }

      const propEntry = new PropEntry(StringUtils.toKebabCase(propName.value), {
        type: prop.type,
        value: prop.defaultValue,
        required: prop.required
      });

      new PropParser(this.root).parseEntry(propEntry, node);
    }

    if (this.features.includes(Feature.computed)) {
      const computedEntry = new ComputedEntry({
        type,
        name: computedName,
        dependencies: [ propName.value ],
      });

      this.emit(computedEntry);
    }

    if (this.features.includes(Feature.events)) {
      const eventArg = new EventArgument(propName.value, type);
      const eventEntry = new EventEntry(`update:${propName.value}`, [ eventArg ]);

      this.emit(eventEntry);
    }
  }

  parseModelDecorator (node, decorator, type, propName) {
    const [ eventNameArg, propObjectArg ] = decorator.expression.arguments;

    if (this.features.includes(Feature.props)) {
      const prop = {
        type,
        required: false,
        defaultValue: undefined
      };

      if (propObjectArg) {
        this.parsePropDecoratorArgument(propObjectArg, prop);
      }

      const propEntry = new PropEntry(StringUtils.toKebabCase(propName), {
        type: prop.type,
        value: prop.defaultValue,
        required: prop.required,
        describeModel: true
      });

      new PropParser(this.root).parseEntry(propEntry, node);
    }

    if (this.features.includes(Feature.model)) {
      const { value: eventName } = this.getValue(eventNameArg);
      const modelEntry = new ModelEntry(propName, eventName);

      this.emit(modelEntry);
    }
  }

  parseModelSyncDecorator (node, decorator, type) {
    const [ propNameNode, eventNameArgNode, propObjectArgNode ] = decorator.expression.arguments;
    const { value: propName } = this.getValue(propNameNode);
    const { value: eventName } = this.getValue(eventNameArgNode);

    const alteredDecorator = {
      ...decorator,
      expression: {
        ...decorator.expression,
        arguments: [ eventNameArgNode, propObjectArgNode ],
      },
    };

    this.parseModelDecorator(node, alteredDecorator, type, propName);

    if (this.features.includes(Feature.computed)) {
      new ClassComponentComputedParser(this.root).parse(node, { type, dependencies: [ propName ] });
    }

    if (this.features.includes(Feature.events)) {
      const eventNameKebab = StringUtils.toKebabCase(eventName);
      const params = [
        {
          type: Syntax.Identifier,
          start: node.start,
          end: node.end,
          range: [ node.start, node.end ],
          leadingComments: undefined,
          trailingComments: undefined,
          innerComments: undefined,
          extra: undefined,
          name: 'value'
        },
      ];

      this.scope.value = new Value(type, 'value');

      new EventParser(this.root, this.scope)
        .parseEventNode(node, eventNameKebab, params);
    }
  }

  parseModelVModelDecorator (node, decorator, type) {
    const [ propObjectArgNode ] = decorator.expression.arguments;
    const propNameNode = createFakeStringLiteralNode('value');
    const eventNameArgNode = createFakeStringLiteralNode('input');

    const alteredDecorator = {
      ...decorator,
      expression: {
        ...decorator.expression,
        arguments: [ propNameNode, eventNameArgNode, propObjectArgNode ],
      },
    };

    this.parseModelSyncDecorator(node, alteredDecorator, type);
  }

  parseRefDecorator (node, decorator, type) {
    if (this.features.includes(Feature.data)) {
      new ClassComponentDataParser(this.root).parse(node, { type });
    }
  }

  parseStateDecorator (node, decorator, type) {
    if (this.features.includes(Feature.data)) {
      new ClassComponentDataParser(this.root).parse(node, { type });
    }
  }

  parseEmitDecorator (node, decorator, methodName) {
    const { params } = node;

    if (this.features.includes(Feature.methods)) {
      new MethodParser(this.root).parseMethodProperty(node, node.body, false);
    }

    if (this.features.includes(Feature.events)) {
      const [ eventNameArg ] = decorator.expression.arguments;
      const eventName = eventNameArg
        ? this.getValue(eventNameArg).value
        : methodName;

      const eventNameKebab = StringUtils.toKebabCase(eventName);

      new EventParser(this.root, this.scope)
        .parseEventNode(node, eventNameKebab, params);
    }
  }

  parseContructor ({ body }) {
    body.forEach((node) => {
      switch (node.expression.type) {
        case Syntax.CallExpression:
          new EventParser(this.root).parse(node);
          break;

        case Syntax.AssignmentExpression:
          if (this.features.includes(Feature.data)) {
            this.parseAssignmentExpression(node.expression, node);
          }
          break;
      }
    });
  }

  parseAssignmentExpression (node, parent = node) {
    switch (node.left.type) {
      case Syntax.MemberExpression:
        this.parseAssignmentMemberExpression(node, parent);
        break;

      default:
        super.parseAssignmentExpression(node);
    }
  }

  parseAssignmentMemberExpression (node, parent = node) {
    switch (node.left.object.type) {
      case Syntax.ThisExpression:
        new ClassComponentDataParser(this.root).parse(parent);
        break;

      default:
        super.parseAssignmentMemberExpression(node);
    }
  }
}

module.exports.ClassComponentParser = ClassComponentParser;
