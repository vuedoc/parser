import { Entry } from '../../types/Entry.js';
import { Parser } from '../../types/Parser.js';

export const ScalarType = {
  string: 'string',
  boolean: 'boolean',
  binary: 'binary',
  number: 'number',
  null: 'null',
  bigint: 'bigint',
  undefined: 'undefined',
} as const;

export const Type = {
  ...ScalarType,
  any: 'any',
  never: 'never',
  unknown: 'unknown',
  void: 'void',
  array: 'array',
  object: 'object',
  regexp: 'regexp',
  function: 'function',
  Promise: 'Promise',
  symbol: 'symbol',
} as const;

export const TypeList = Object.freeze(Object.values(Type));

export const Visibility: Record<Entry.Visibility, Entry.Visibility> = {
  public: 'public',
  protected: 'protected',
  private: 'private',
};

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

export const DEFAULT_IGNORED_VISIBILITIES = [
  Visibility.protected,
  Visibility.private,
];

export const DEFAULT_ENCODING = 'utf8';

export const Feature: Record<Parser.Feature, Parser.Feature> = Object.freeze({
  name: 'name',
  description: 'description',
  keywords: 'keywords',
  slots: 'slots',
  props: 'props',
  data: 'data',
  computed: 'computed',
  events: 'events',
  methods: 'methods',
});

export const CompositionFeature: Record<Parser.CompositionFeature, Parser.CompositionFeature> = Object.freeze({
  props: 'props',
  data: 'data',
  computed: 'computed',
  events: 'events',
  methods: 'methods',
});

export const FeatureEvent: Record<Parser.Feature, Entry.Kind> = Object.freeze({
  name: 'name',
  description: 'description',
  keywords: 'keyword',
  slots: 'slot',
  props: 'prop',
  data: 'data',
  computed: 'computed',
  events: 'event',
  methods: 'method',
});

export const Features = Object.values(Feature);

export const CompositionProperties = {
  mixins: 'mixins',
  setup: 'setup',
  extends: 'extends',
  expose: 'expose',
  emits: 'emits',
} as const;

export const Properties = {
  ...CompositionProperties,
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
} as const;

export const RouterKeys = {
  useRoute: 'useRoute',
  useRouter: 'useRouter',
  useLink: 'useLink',
} as const;

export const LegacyHooks = [
  Properties.beforeCreate,
  Properties.created,
  Properties.beforeMount,
  Properties.mounted,
  Properties.beforeUpdate,
  Properties.updated,
  Properties.beforeDestroy,
  Properties.destroyed,
  // router
  Properties.beforeRouteEnter,
  Properties.beforeRouteUpdate,
  Properties.beforeRouteLeave,
];

export const CompositionHooks = [
  'onMounted',
  'onUpdated',
  'onUnmounted',
  'onMounted',
  'onBeforeUpdate',
  'onBeforeUpdate',
  'onBeforeUnmount',
  'onErrorCaptured',
  'onRenderTracked',
  'onRenderTriggered',
  'onActivated',
  'onDeactivated',
  'onServerPrefetch',
  // router
  'onBeforeRouteLeave',
  'onBeforeRouteUpdate',
];

export const CompositionComputedTypes = [
  'ComputedRef',
];

export const CompositionTypes = [
  ...CompositionComputedTypes,
  'Ref',
  'ShallowRef',
  'ShallowReactive',
  'ToRef',
];

export const Syntax = Object.freeze({
  BinaryExpression: 'BinaryExpression',
  ClassDeclaration: 'ClassDeclaration',
  ClassExpression: 'ClassExpression',
  ClassProperty: 'ClassProperty',
  ClassMethod: 'ClassMethod',
  ClassPrivateMethod: 'ClassPrivateMethod',
  ClassPrivateProperty: 'ClassPrivateProperty',
  FunctionExpression: 'FunctionExpression',
  FunctionDeclaration: 'FunctionDeclaration',
  FunctionTypeParam: 'FunctionTypeParam',
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
  UpdateExpression: 'UpdateExpression',
  ReturnStatement: 'ReturnStatement',
  CallExpression: 'CallExpression',
  ConditionalExpression: 'ConditionalExpression',
  MemberExpression: 'MemberExpression',
  NewExpression: 'NewExpression',
  VariableDeclaration: 'VariableDeclaration',
  VariableDeclarator: 'VariableDeclarator',
  ExportAllDeclaration: 'ExportAllDeclaration',
  ExportNamedDeclaration: 'ExportNamedDeclaration',
  ExportDefaultDeclaration: 'ExportDefaultDeclaration',
  ImportDefaultSpecifier: 'ImportDefaultSpecifier',
  ImportNamespaceSpecifier: 'ImportNamespaceSpecifier',
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
  TSUnionType: 'TSUnionType',
  TSAsExpression: 'TSAsExpression',
  TSTypeReference: 'TSTypeReference',
  TSTypeAnnotation: 'TSTypeAnnotation',
  TSTypeParameterInstantiation: 'TSTypeParameterInstantiation',
  TSCallSignatureDeclaration: 'TSCallSignatureDeclaration',
  TSTypeAliasDeclaration: 'TSTypeAliasDeclaration',
  TSInterfaceDeclaration: 'TSInterfaceDeclaration',
  TSEnumDeclaration: 'TSEnumDeclaration',
  TSInterfaceBody: 'TSInterfaceBody',
  TSPropertySignature: 'TSPropertySignature',
  TSTypeLiteral: 'TSTypeLiteral',
  TSDeclareFunction: 'TSDeclareFunction',
  JSXElement: 'JSXElement',
});
