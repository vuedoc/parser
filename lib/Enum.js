module.exports.Type = Object.freeze({
  any: 'any',
  unknown: 'unknown',
  void: 'void',
  string: 'string',
  boolean: 'boolean',
  binary: 'binary',
  number: 'number',
  null: 'null',
  array: 'array',
  object: 'object',
  bigint: 'bigint',
  regexp: 'regexp',
  function: 'function',
  undefined: 'undefined',
  Promise: 'Promise',
  symbol: 'symbol',
});

module.exports.TypeList = Object.freeze(Object.values(this.Type));

module.exports.Visibility = Object.freeze({
  public: 'public',
  protected: 'protected',
  private: 'private',
});

module.exports.JSDocTag = Object.freeze({
  name: 'name',
  mixin: 'mixin',
  type: 'type',
  default: 'default',
  ignore: 'ignore',
  description: 'description',
  desc: 'desc',
  returns: 'returns',
  return: 'return',
  param: 'param',
  argument: 'argument',
  arg: 'arg',
  version: 'version',
  since: 'since',
  author: 'author',
  deprecated: 'deprecated',
  see: 'see',
  kind: 'kind',
  example: 'example',
});

module.exports.TypedocTag = Object.freeze({
  hidden: 'hidden',
  category: 'category',
});

module.exports.PropTypesTag = Object.freeze({
  Component: 'Component',
  Prop: 'Prop',
  PropSync: 'PropSync',
  Model: 'Model',
  ModelSync: 'ModelSync',
  VModel: 'VModel',
  Ref: 'Ref',
  State: 'State',
  Emit: 'Emit',
});

module.exports.Tag = Object.freeze({
  ...this.JSDocTag,
  ...this.TypedocTag,
  ...this.PropTypesTag,
  prop: 'prop',
  method: 'method',
  syntax: 'syntax',
  event: 'event',
  slot: 'slot',
  initialValue: 'initialValue',
});

module.exports.TagAlias = Object.freeze({
  description: [ this.JSDocTag.description, this.JSDocTag.desc ],
  returns: [ this.JSDocTag.returns, this.JSDocTag.return ],
  param: [ this.Tag.param, this.Tag.argument, this.Tag.arg, this.Tag.prop ],
});

module.exports.CommonTags = Object.freeze([
  {
    tag: this.TypedocTag.category,
    type: this.Type.string
  },
  {
    tag: this.JSDocTag.version,
    type: this.Type.string
  },
  {
    tag: this.JSDocTag.since,
    type: this.Type.string
  },
  {
    tag: this.JSDocTag.author,
    type: this.Type.array
  },
  {
    tag: this.JSDocTag.deprecated,
    type: this.Type.string
  },
  {
    tag: this.JSDocTag.see,
    type: this.Type.string
  },
]);

module.exports.Visibilities = Object.freeze(Object.values(this.Visibility));

module.exports.DEFAULT_IGNORED_VISIBILITIES = Object.freeze([
  this.Visibility.protected,
  this.Visibility.private,
]);

module.exports.DEFAULT_ENCODING = 'utf8';

module.exports.Feature = Object.freeze({
  name: 'name',
  description: 'description',
  keywords: 'keywords',
  model: 'model',
  slots: 'slots',
  props: 'props',
  data: 'data',
  computed: 'computed',
  events: 'events',
  methods: 'methods',
});

module.exports.Features = Object.freeze(Object.values(this.Feature));

module.exports.Properties = Object.freeze({
  name: 'name',
  model: 'model',
  props: 'props',
  data: 'data',
  computed: 'computed',
  template: 'template',
  inheritAttrs: 'inheritAttrs',
  beforeRouteEnter: 'beforeRouteEnter',
  beforeRouteUpdate: 'beforeRouteUpdate',
  beforeRouteLeave: 'beforeRouteLeave',
  beforeCreate: 'beforeCreate',
  created: 'created',
  beforeMount: 'beforeMount',
  mounted: 'mounted',
  beforeUpdate: 'beforeUpdate',
  updated: 'updated',
  beforeDestroy: 'beforeDestroy',
  destroyed: 'destroyed',
  render: 'render',
  methods: 'methods',
  watch: 'watch',
});

module.exports.Syntax = Object.freeze({
  BinaryExpression: 'BinaryExpression',
  ClassDeclaration: 'ClassDeclaration',
  ClassExpression: 'ClassExpression',
  ClassProperty: 'ClassProperty',
  ClassMethod: 'ClassMethod',
  ClassPrivateMethod: 'ClassPrivateMethod',
  FunctionExpression: 'FunctionExpression',
  FunctionDeclaration: 'FunctionDeclaration',
  ImportDeclaration: 'ImportDeclaration',
  Super: 'Super',
  StringLiteral: 'StringLiteral',
  NumericLiteral: 'NumericLiteral',
  BooleanLiteral: 'BooleanLiteral',
  LogicalExpression: 'LogicalExpression',
  NullLiteral: 'NullLiteral',
  RegExpLiteral: 'RegExpLiteral',
  BigIntLiteral: 'BigIntLiteral',
  RegularExpression: 'RegularExpression',
  Template: 'Template',
  Identifier: 'Identifier',
  PrivateName: 'PrivateName',
  ArrayPattern: 'ArrayPattern',
  ArrayExpression: 'ArrayExpression',
  ObjectExpression: 'ObjectExpression',
  ObjectMethod: 'ObjectMethod',
  ArrowFunctionExpression: 'ArrowFunctionExpression',
  UnaryExpression: 'UnaryExpression',
  ReturnStatement: 'ReturnStatement',
  CallExpression: 'CallExpression',
  MemberExpression: 'MemberExpression',
  NewExpression: 'NewExpression',
  VariableDeclaration: 'VariableDeclaration',
  VariableDeclarator: 'VariableDeclarator',
  ExportAllDeclaration: 'ExportAllDeclaration',
  ExportNamedDeclaration: 'ExportNamedDeclaration',
  ExportDefaultDeclaration: 'ExportDefaultDeclaration',
  ObjectProperty: 'ObjectProperty',
  BlockStatement: 'BlockStatement',
  TemplateLiteral: 'TemplateLiteral',
  TaggedTemplateExpression: 'TaggedTemplateExpression',
  ThisExpression: 'ThisExpression',
  AssignmentPattern: 'AssignmentPattern',
  RestElement: 'RestElement',
  ObjectPattern: 'ObjectPattern',
  ExpressionStatement: 'ExpressionStatement',
  IfStatement: 'IfStatement',
  SwitchStatement: 'SwitchStatement',
  SwitchCase: 'SwitchCase',
  BreakStatement: 'BreakStatement',
  ContinueStatement: 'ContinueStatement',
  LabeledStatement: 'LabeledStatement',
  ThrowStatement: 'ThrowStatement',
  TryStatement: 'TryStatement',
  CatchClause: 'CatchClause',
  AssignmentExpression: 'AssignmentExpression',
  WhileStatement: 'WhileStatement',
  DoWhileStatement: 'DoWhileStatement',
  ForStatement: 'ForStatement',
  ForInStatement: 'ForInStatement',
  ForOfStatement: 'ForOfStatement',
  SpreadElement: 'SpreadElement',
  TSFunctionType: 'TSFunctionType',
  TSAsExpression: 'TSAsExpression',
  TSTypeReference: 'TSTypeReference',
  TSTypeAnnotation: 'TSTypeAnnotation',
  TSTypeParameterInstantiation: 'TSTypeParameterInstantiation',
  JSXElement: 'JSXElement',
});
