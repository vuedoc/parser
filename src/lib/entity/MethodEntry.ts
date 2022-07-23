import { AbstractCategorizeEntry } from './AbstractCategorizeEntry.js';
import { Type } from '../Enum.js';
import { Value } from './Value.js';
import { Vuedoc } from '../../../types/index.js';

const ARRAY_BRAKET = '[]';

export class MethodEntry extends AbstractCategorizeEntry<'method'> implements Vuedoc.Entry.MethodEntry {
  name: string;
  params: MethodParam[];
  syntax: string[];
  returns: MethodReturns;

  constructor(name: string, params: MethodParam[]) {
    super('method');

    this.name = name;
    this.params = params;
    this.syntax = [];
    this.returns = new MethodReturns();
  }
}

export class MethodParam implements Vuedoc.Entry.Param {
  name: string;
  type: string;
  description?: string;
  defaultValue?: string;
  rest: boolean;

  constructor() {
    this.name = '';
    this.type = Type.unknown;
    this.rest = false;
  }

  static parse(param) {
    if (param.rest && !param.type.endsWith(ARRAY_BRAKET) && param.type[0] !== ARRAY_BRAKET[0]) {
      param.type += ARRAY_BRAKET;
    }
  }

  static toString(param) {
    let name = param.name;
    let type = param.type;

    if (param.optional) {
      name += '?';
    }

    if (param.type instanceof Array) {
      type = type.join(' | ');
    }

    if (param.rest) {
      return `...${param.name}: ${type}`;
    }

    return param.defaultValue
      ? `${name}: ${type} = ${param.defaultValue}`
      : `${name}: ${type}`;
  }
}

export function* methodParamGenerator(): Generator<MethodParam, MethodParam> {
  while (true) {
    yield new MethodParam();
  }
}

export class MethodReturns {
  type: string;
  description: undefined;

  constructor(type: Vuedoc.Parser.Type | Vuedoc.Parser.Type[] = Type.void) {
    this.type = type instanceof Array ? type.map(Value.parseNativeType) : Value.parseNativeType(type);
    this.description = undefined;
  }
}

export const MethodParamGenerator = methodParamGenerator();
