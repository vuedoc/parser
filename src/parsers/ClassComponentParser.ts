import { Options, ScriptParser } from './ScriptParser.js';

import { ClassComponentComputedParser } from './ClassComponentComputedParser.js';
import { ClassComponentDataParser } from './ClassComponentDataParser.js';

import { NameEntry } from '../entity/NameEntry.js';
import { PropEntry } from '../entity/PropEntry.js';
import { ModelEntry } from '../entity/ModelEntry.js';
import { EventEntry, EventArgument } from '../entity/EventEntry.js';
import { ComputedEntry } from '../entity/ComputedEntry.js';

import { Syntax, Type, Feature, Visibility, PropTypesTag } from '../lib/Enum.js';
import { Parser } from '../../types/Parser.js';
import { Value } from '../entity/Value.js';

import * as Babel from '@babel/types';
import { File } from '../../types/FileSystem.js';

type ArgumentNode = Babel.Expression | Babel.SpreadElement | Babel.JSXNamespacedName | Babel.ArgumentPlaceholder;

function createFakeStringLiteralNode(value: string): Babel.StringLiteral {
  return {
    type: Syntax.StringLiteral,
    start: 0,
    end: 0,
    range: [0, 0],
    leadingComments: undefined,
    trailingComments: undefined,
    innerComments: undefined,
    extra: { rawValue: value, raw: `'${value}'` },
    value,
  };
}

export class ClassComponentParser extends ScriptParser<Babel.ClassDeclaration, any> {
  dataParser: ClassComponentDataParser;
  computerParser: ClassComponentComputedParser;

  constructor(
    parent: ScriptParser<any, any>,
    root: Parser.Interface,
    source: Required<Parser.Script>,
    file: Readonly<File>,
    options: Options
  ) {
    super(root, source, file, options, parent.createRegister);

    this.root = parent;
    this.dataParser = new ClassComponentDataParser(this.root, this.emitter, this.source, this.scope);
    this.computerParser = new ClassComponentComputedParser(this.root, this.emitter, this.source, this.scope);
  }

  parse(node: Babel.ClassDeclaration) {
    this.parseName(node);

    node.body.body.forEach((property) => {
      if ('static' in property) {
        if (property.static) {
          return; // ignore static members
        }

        switch (property.type) {
          case Syntax.ClassProperty:
            this.parseClassProperty(property);
            break;

          case Syntax.ClassPrivateProperty:
            this.parseClassProperty(property, Visibility.private);
            break;

          case Syntax.ClassMethod:
            this.parseClassMethod(property);
            break;

          case Syntax.ClassPrivateMethod:
            this.parseClassMethod(property, Visibility.private);
            break;
        }
      }
    });

    this.parseComponentDecorators(node);
    this.parseCommentNode(node);
  }

  parseComponentDecorators(node) {
    if (node.decorators) {
      node.decorators.forEach(({ expression }) => {
        if (expression.type === Syntax.CallExpression && expression.arguments.length) {
          this.parseExportDefaultDeclaration(expression.arguments[0]);
        }
      });
    }
  }

  parseClassProperty(node, defaultVisibility = Visibility.public) {
    const type = this.getTSType(node);
    const parsingResult = this.parseClassMember(type, node);

    if (!parsingResult && this.features.includes(Feature.data)) {
      // TODO Handle defaultVisibility for private properties
      this.dataParser.sync(this.scope).parse(node);
    }
  }

  parseClassMethod(node: Babel.ClassMethod | Babel.ClassPrivateMethod, defaultVisibility = Visibility.public) {
    switch (node.kind) {
      case 'constructor':
        this.parseContructor(node.body);
        break;

      case 'get':
        if (this.features.includes(Feature.computed)) {
          this.computerParser.sync(this.scope).parseNode(node);
        }
        break;

      case 'method':
        if (!this.parseClassMember(Type.unknown, node)) {
          const ref = this.getValue(node.key);

          if (ref.value === Feature.data) {
            this.parsers.data.sync().parse(node);
          } else {
            this.parsers.methods.sync().parseMethodProperty(node, node.body, node, { defaultVisibility });
          }
        }
        break;
    }
  }

  parseClassMember(type: Parser.Type, node) {
    if (node.decorators) {
      return node.decorators.some((decorator: Babel.Decorator) => {
        if (decorator.expression.type === Syntax.CallExpression && 'name' in decorator.expression.callee) {
          switch (decorator.expression.callee.name) {
            case PropTypesTag.Prop:
              if (this.features.includes(Feature.props)) {
                this.parsePropDecorator(node, decorator.expression.arguments, type, node.key.name);
              }

              return true;

            case PropTypesTag.PropSync:
              this.parsePropSyncDecorator(node, decorator.expression.arguments, type, node.key.name);

              return true;

            case PropTypesTag.Model:
              this.parseModelDecorator(node, decorator.expression.arguments, type, node.key.name);

              return true;

            case PropTypesTag.ModelSync:
              this.parseModelSyncDecorator(node, decorator.expression.arguments, type);

              return true;

            case PropTypesTag.VModel:
              this.parseModelVModelDecorator(node, decorator.expression.arguments, type);

              return true;

            case PropTypesTag.Ref:
              this.parseRefDecorator(node, decorator.expression.arguments, type);

              return true;

            case PropTypesTag.State:
              this.parseStateDecorator(node, decorator.expression.arguments, type);

              return true;

            case PropTypesTag.Emit:
              this.parseEmitDecorator(node, decorator.expression.arguments, node.key.name);

              return true;
          }
        }

        return false;
      });
    }

    return false;
  }

  parseName({ id }) {
    if (this.features.includes(Feature.name)) {
      const entry = new NameEntry(id.name);

      this.emit(entry);
    }
  }

  parsePropDecoratorArgument(argument, prop) {
    switch (argument.type) {
      case Syntax.Identifier:
        prop.type = argument.name;
        break;

      case Syntax.ArrayExpression:
        prop.type = argument.elements.map(({ name }) => name);
        break;

      case Syntax.ObjectExpression: {
        const ref = this.getValue(argument);

        if (ref.value.required) {
          prop.required = ref.value.required;
        }

        if ('default' in ref.value) {
          prop.defaultValue = ref.rawObject?.default.raw || JSON.stringify(ref.value.default);

          if (prop.type === Type.any) {
            prop.type = typeof ref.value.default;
          }
        }
        break;
      }
    }
  }

  parsePropDecorator(node, [argument]: ArgumentNode[], type: Parser.Type, name: string) {
    if (this.features.includes(Feature.props)) {
      const prop = {
        type,
        required: false,
        defaultValue: undefined,
      };

      if (argument) {
        this.parsePropDecoratorArgument(argument, prop);
      }

      const entry = new PropEntry({
        name,
        type: prop.type,
        defaultValue: prop.defaultValue,
        required: prop.required,
      });

      this.parsers.props.sync(this.scope).parseEntry(entry, node, name);
    }
  }

  parsePropSyncDecorator(node, [propNameArg, propObjectArg]: ArgumentNode[], type: Parser.Type, computedName: string) {
    const propName = this.getValue(propNameArg);

    if (this.features.includes(Feature.props)) {
      const prop = {
        type,
        required: false,
        defaultValue: undefined,
      };

      if (propObjectArg) {
        this.parsePropDecoratorArgument(propObjectArg, prop);
      }

      const propEntry = new PropEntry({
        name: propName.value,
        type: prop.type || type,
        defaultValue: prop.defaultValue,
        required: prop.required,
      });

      this.parsers.props.sync(this.scope).parseEntry(propEntry, node, propName.value);
    }

    if (this.features.includes(Feature.computed)) {
      const computedEntry = new ComputedEntry({
        type,
        name: computedName,
        dependencies: [propName.value],
      });

      this.emit(computedEntry);
    }

    if (this.features.includes(Feature.events)) {
      const eventArg = new EventArgument(propName.value, type);
      const eventEntry = new EventEntry(`update:${propName.value}`, [eventArg]);

      this.emit(eventEntry);
    }
  }

  parseModelDecorator(node, [eventNameArg, propObjectArg]: ArgumentNode[], type: Parser.Type, propName: string) {
    if (this.features.includes(Feature.props)) {
      const { value: eventName } = this.getValue(eventNameArg);
      const modelEntry = new ModelEntry(propName, eventName);

      this.emit(modelEntry);

      const prop = {
        type,
        required: false,
        defaultValue: undefined,
      };

      if (propObjectArg) {
        this.parsePropDecoratorArgument(propObjectArg, prop);
      }

      const propEntry = new PropEntry({
        name: propName,
        type: prop.type,
        defaultValue: prop.defaultValue,
        required: prop.required,
        describeModel: true,
      });

      this.parsers.props.sync(this.scope).parseEntry(propEntry, node, propName);
    }
  }

  parseModelSyncDecorator(node, args: ArgumentNode[], type: Parser.Type) {
    const [propNameNode, eventNameArgNode, propObjectArgNode] = args;
    const { value: propName } = this.getValue(propNameNode);
    const { value: eventName } = this.getValue(eventNameArgNode);

    this.parseModelDecorator(node, [eventNameArgNode, propObjectArgNode], type, propName);

    if (this.features.includes(Feature.computed)) {
      this.computerParser.sync(this.scope).parseNode(node, type, [propName]);
    }

    if (this.features.includes(Feature.events)) {
      this.setScopeValue('value', node, new Value(type, 'value', '"value"'));
      this.root.parsers.events.sync(this.scope).parseEventNode(node, eventName, [
        {
          type: Syntax.Identifier,
          start: node.start,
          end: node.end,
          range: [node.start, node.end],
          name: 'value',
        },
      ]);
    }
  }

  parseModelVModelDecorator(node, [propObjectArgNode]: ArgumentNode[], type: Parser.Type) {
    const propNameNode = createFakeStringLiteralNode('value');
    const eventNameArgNode = createFakeStringLiteralNode('input');

    this.parseModelSyncDecorator(node, [propNameNode, eventNameArgNode, propObjectArgNode], type);
  }

  parseRefDecorator(node, args: ArgumentNode[], type: Parser.Type) {
    if (this.features.includes(Feature.data)) {
      new ClassComponentDataParser(this.root, this.emitter, this.source, this.scope).parse(node, type);
    }
  }

  parseStateDecorator(node, args: ArgumentNode[], type: Parser.Type) {
    if (this.features.includes(Feature.data)) {
      new ClassComponentDataParser(this.root, this.emitter, this.source, this.scope).parse(node, type);
    }
  }

  parseEmitDecorator(node, [eventNameArg]: ArgumentNode[], methodName: string) {
    const { params } = node;

    if (this.features.includes(Feature.methods)) {
      this.root.parsers.methods.sync(this.scope).parseMethodProperty(node, node.body, node, {
        parseEvents: false,
      });
    }

    if (this.features.includes(Feature.events)) {
      const eventName = eventNameArg
        ? this.getValue(eventNameArg).value
        : methodName;

      this.root.parsers.events.sync(this.scope)
        .parseEventNode(node, eventName, params);
    }
  }

  parseContructor({ body }) {
    body.forEach((node) => {
      switch (node.expression.type) {
        case Syntax.CallExpression:
          this.root.parsers.events.sync(this.scope).parse(node);
          break;

        case Syntax.AssignmentExpression:
          if (this.features.includes(Feature.data)) {
            this.parseAssignmentExpression(node.expression, node);
          }
          break;
      }
    });
  }

  parseAssignmentExpression(node, parent = node) {
    switch (node.left.type) {
      case Syntax.MemberExpression:
        this.parseAssignmentMemberExpression(node, parent);
        break;

      default:
        super.parseAssignmentExpression(node);
    }
  }

  parseAssignmentMemberExpression(node, parent = node) {
    if (node.left.object.type === Syntax.ThisExpression) {
      new ClassComponentDataParser(this.root, this.emitter, this.source, this.scope).parse(parent);
    }
  }
}
