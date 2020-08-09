module.exports.GenericVisibilities = Object.freeze({
  public: 'public',
  protected: 'protected',
  private: 'private'
})

module.exports.TypedocVisibilities = Object.freeze({
  ignore: 'ignore',
  hidden: 'hidden'
})

module.exports.Visibilities = Object.freeze({
  ...this.GenericVisibilities,
  ...this.TypedocVisibilities
})

module.exports.VisibilitiesList = Object.freeze(Object.values(this.Visibilities))

module.exports.DEFAULT_IGNORED_VISIBILITIES = Object.freeze([
  ...Object.values(this.TypedocVisibilities),
  this.GenericVisibilities.protected,
  this.GenericVisibilities.private
])

module.exports.DEFAULT_ENCODING = 'utf8'

module.exports.Features = Object.freeze({
  name: 'name',
  description: 'description',
  keywords: 'keywords',
  model: 'model',
  slots: 'slots',
  props: 'props',
  data: 'data',
  computed: 'computed',
  events: 'events',
  methods: 'methods'
})

module.exports.FeaturesList = Object.freeze(Object.values(this.Features))

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
  methods: 'methods'
})

module.exports.Type = Object.freeze({
  any: 'any',
  unknow: 'unknow',
  void: 'void',
  string: 'string',
  boolean: 'boolean',
  number: 'number',
  null: 'null',
  array: 'array',
  object: 'object',
  bigint: 'bigint',
  regexp: 'regexp',
  function: 'function',
  undefined: 'undefined',
  Promise: 'Promise'
})

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
  SpreadElement: 'SpreadElement'
})
