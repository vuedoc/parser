export const Type = Object.freeze({
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

export const TypeList = Object.freeze(Object.values(Type));

export const Visibility = Object.freeze({
  public: 'public',
  protected: 'protected',
  private: 'private',
});

export const JSDocTag = Object.freeze({
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

export const TypedocTag = Object.freeze({
  hidden: 'hidden',
  category: 'category',
});

export const PropTypesTag = Object.freeze({
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

export const Tag = Object.freeze({
  ...JSDocTag,
  ...TypedocTag,
  ...PropTypesTag,
  prop: 'prop',
  method: 'method',
  syntax: 'syntax',
  event: 'event',
  slot: 'slot',
  initialValue: 'initialValue',
});

export const TagAlias = Object.freeze({
  description: [JSDocTag.description, JSDocTag.desc],
  returns: [JSDocTag.returns, JSDocTag.return],
  param: [Tag.param, Tag.argument, Tag.arg, Tag.prop],
});

export const CommonTags = Object.freeze([
  {
    tag: TypedocTag.category,
    type: Type.string,
  },
  {
    tag: JSDocTag.version,
    type: Type.string,
  },
  {
    tag: JSDocTag.since,
    type: Type.string,
  },
  {
    tag: JSDocTag.author,
    type: Type.array,
  },
  {
    tag: JSDocTag.deprecated,
    type: Type.string,
  },
  {
    tag: JSDocTag.see,
    type: Type.string,
  },
]);

export const Visibilities = Object.freeze(Object.values(Visibility));

export const DEFAULT_IGNORED_VISIBILITIES = Object.freeze([
  Visibility.protected,
  Visibility.private,
]);

export const DEFAULT_ENCODING = 'utf8';

export const Feature = Object.freeze({
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

export const Features = Object.freeze(Object.values(Feature));

export const Properties = Object.freeze({
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

export const Syntax = Object.freeze({
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
