import { get } from '@b613/utils/lib/object.js';
import { Parser } from '../../types/Parser.js';
import { Value } from '../entity/Value.js';
import { Syntax } from './Enum.js';

const CompositionFunctionValue: Record<Parser.CompositionFeature, string[]> = {
  data: [
    'ref',
    '$ref',
    'shallowRef',
    '$shallowRef',
  ],
  computed: [
    'computed',
    '$computed',
  ],
  events: [],
  methods: [],
  props: [],
};

const CompositionFunction: Record<Parser.CompositionFeature, string[]> = {
  data: [
    'reactive',
    'readonly',
    'shallowReactive',
    'shallowReadonly',
    'triggerRef',
    'toRaw',
    'markRaw',
    'unref',
  ],
  computed: [
    'computed',
    '$computed',
  ],
  events: [],
  methods: [],
  props: [],
};

const ToRefComposition: Parser.CompiledComposition = {
  fname: 'toRef',
  feature: 'data',
  parseEntryValue(node, context) {
    if (node.arguments.length > 1) {
      const sourceNode = node.arguments.at(0);
      const keyNode = node.arguments.at(1);
      const path = context.getValue(keyNode);

      if (sourceNode.type === Syntax.Identifier && sourceNode.name in context.scope) {
        const ref = context.scope[sourceNode.name];

        if (!('$ns' in ref)) {
          const value = get<Value>(ref.value.rawObject, path.value);

          return value;
        }
      }
    }

    return undefined;
  },
};

const DefaultComposition: Parser.CompiledComposition[] = [
  ...Object.entries(CompositionFunctionValue)
    .map(([feature, fns]: [Parser.CompositionFeature, string[]]) => fns.map((fname): Parser.CompiledComposition => ({
      fname,
      valueIndex: 0,
      typeParameterIndex: 0,
      identifierSuffixes: ['value'],
      feature,
    }))).flat(),
  ...Object.entries(CompositionFunction)
    .map(([feature, fns]: [Parser.CompositionFeature, string[]]) => fns.map((fname): Parser.CompiledComposition => ({
      fname,
      valueIndex: 0,
      typeParameterIndex: 0,
      feature,
    }))).flat(),
  {
    fname: 'useAttrs',
    feature: 'data',
    valueIndex: 0,
    typeParameterIndex: 0,
    ignoreVariableIdentifier: true,
  },
  {
    fname: 'useSlots',
    feature: 'data',
    valueIndex: 0,
    typeParameterIndex: 0,
    ignoreVariableIdentifier: true,
  },
  {
    fname: 'defineProps',
    feature: 'props',
    valueIndex: 0,
    typeParameterIndex: 0,
    valueCanBeUndefined: true,
    ignoreVariableIdentifier: false,
  },
  {
    fname: 'defineEmits',
    feature: 'events',
    valueIndex: 0,
    typeParameterIndex: 0,
    valueCanBeUndefined: true,
    ignoreVariableIdentifier: false,
  },
  {
    fname: 'effectScope',
    feature: 'data',
    valueCanBeUndefined: true,
    ignoreVariableIdentifier: true,
  },
  ToRefComposition,
  { ...ToRefComposition, fname: '$toRef' },
];

export class Composition {
  protected items: Parser.CompiledComposition[];

  constructor(composition: Partial<Parser.ParsingComposition> = {}) {
    this.items = [
      ...Composition.parse(composition),
      ...DefaultComposition,
    ];
  }

  static parse(composition: Partial<Parser.ParsingComposition>): Parser.CompiledComposition[] {
    return Object.entries(composition)
      .map(([feature, compositions]: [Parser.CompositionFeature, Parser.CompositionDeclaration[]]) => {
        return compositions.map((composition) => Object.freeze({ ...composition, feature }));
      })
      .flat();
  }

  createAlias(fname: string, aliasName: string) {
    const compositions = this.getDeclarations(fname);

    for (const composition of compositions.reverse()) {
      this.items.unshift(Object.freeze({ ...composition, fname: aliasName }));
    }
  }

  unshift(composition: Partial<Parser.ParsingComposition>) {
    this.items.unshift(...Composition.parse(composition));
  }

  push(composition: Partial<Parser.ParsingComposition>) {
    this.items.push(...Composition.parse(composition));
  }

  getDeclarations(fname: string) {
    const foundFeatures = [];

    return this.items
      .filter((item) => {
        if (item.fname === fname && !foundFeatures.includes(item.feature)) {
          foundFeatures.push(item.feature);

          return true;
        }

        return false;
      });
  }

  get(fname: string, features: Parser.CompositionFeature[]) {
    return this.items.find((item) => item.fname === fname && features.includes(item.feature));
  }
}
