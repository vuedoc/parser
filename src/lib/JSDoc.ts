import { Entry } from '../../types/Entry.js';
import { Parser } from '../../types/Parser.js';
import { Type, TagAlias } from './Enum.js';
import { AbstractParser } from '../parsers/AbstractParser.js';
import { KeywordsUtils } from '../utils/KeywordsUtils.js';

const PARAM_NAME = '[a-zA-Z0-9$&\\.\\[\\]_\'"]+';

export const TYPE_LIMIT = 'a-zA-Z\\[\\]\\{\\}<>\\+\\-|!%^$&#\\.,;:=\'"\\s\\*\\?';
export const TYPE_MIDLE = '\\(\\)';
const TYPE = `[${TYPE_LIMIT}]*|[${TYPE_LIMIT}][${TYPE_LIMIT}${TYPE_MIDLE}]*[${TYPE_LIMIT}]`;
const PARAM_RE = new RegExp(`^\\s*(\\{\\(?(${TYPE})\\)?\\}\\s+)?(${PARAM_NAME}|\\[(${PARAM_NAME})(=(.*))?\\])\\s(\\s*-?\\s*)?(.*)?`);
const RETURNS_RE = new RegExp(`^\\s*(\\{\\(?(${TYPE})\\)?\\}\\s+)?-?\\s*(.*)`);
const TYPE_RE = new RegExp(`^(\\{\\((${TYPE})\\)\\}|\\{(${TYPE})\\}|\\((${TYPE})\\))$`);

function parseDescriptionText(text) {
  const index = text.indexOf('\n');

  return index > -1
    ? text.substring(index).split(/\n/g).map((item) => item.trim()).join('\n')
    : '';
}

function* paramGenerator(): Generator<Entry.Param> {
  while (true) {
    yield { name: '', type: Type.unknown };
  }
}

const paramGeneratorInstance = paramGenerator();

export const JSDoc = {
  parseTypeParam(type: Parser.Type, param: Pick<Entry.Param, 'type' | 'rest'>) {
    if (type.indexOf('|') > -1) {
      param.type = type.split('|').map((item) => item.trim());
    } else if (type === '*') {
      param.type = Type.any;
    } else if (type.startsWith('...')) {
      param.type = type.substring(3);
      param.rest = true;
    } else {
      param.type = type;
    }
  },
  parseParams(parser: AbstractParser<any, any>, keywords: Entry.Keyword[], params: Entry.Param[], generator) {
    let initialParamsAltered = false;

    KeywordsUtils.extract(keywords, TagAlias.param, true).forEach(({ description }) => {
      const param = JSDoc.parseParamKeyword(description || '', generator);

      if (param.name) {
        const entryIndex = params.findIndex((item) => item.name === param.name);

        if (entryIndex === -1) {
          params.push(param);
        } else {
          const entryParam = params[entryIndex];

          if (param.rest === false) {
            param.rest = entryParam.rest;
          }

          if (param.type === Type.unknown) {
            param.type = entryParam.type;
          }

          if (!param.defaultValue) {
            if (entryParam.defaultValue && entryParam.defaultValue !== undefined) {
              param.defaultValue = entryParam.defaultValue;
            }
          }

          params.splice(entryIndex, 1, param);
        }

        initialParamsAltered = true;
      } else {
        parser.emitWarning(`Invalid JSDoc syntax: '${description}'`);
      }
    });

    // Delete params like '{...}', '[...]', 'this.*' when dotlet has params
    if (initialParamsAltered) {
      const indexToRemove: number[] = [];

      params.forEach(({ name }, indexParam) => {
        if (name[0] === '{' || name[0] === '[' || name.startsWith('this.')) {
          indexToRemove.push(indexParam);
        }
      });

      indexToRemove.reverse().forEach((index) => params.splice(index, 1));
    }
  },
  parseReturns(keywords: Entry.Keyword[], returns: Entry.MethodReturns) {
    KeywordsUtils.extract(keywords, TagAlias.returns, true).forEach(({ description }) => {
      Object.assign(returns, JSDoc.parseReturnsKeyword(description || '', returns.type));
    });
  },
  parseType(description: string) {
    let type: Parser.Type | Parser.Type[] = `${description}`.trim();
    const matches = TYPE_RE.exec(type);

    if (matches) {
      type = matches[2] || matches[3] || matches[4];
    } else if (type[0] === '{' && type.endsWith('}')) {
      type = type.substring(1, type.length - 1);
    }

    switch (type[0]) {
      case '!':
        type = type.substring(1);
        break;

      case '?':
        type = type.length === 1
          ? Type.unknown
          : [type.substring(1), Type.null];
        break;
    }

    if (typeof type === 'string') {
      if (type.indexOf('|') > -1) {
        type = type.split('|').map((item) => item.trim());
      } else if (type === '*') {
        type = Type.any;
      } else {
        type = type.trim();
      }
    }

    return type;
  },
  parseParamKeyword(text: string, generator = paramGeneratorInstance, re = PARAM_RE) {
    const param = generator.next().value;
    const matches = re.exec(`${text}\n`);

    if (matches) {
      if (matches[2]) {
        JSDoc.parseTypeParam(matches[2], param);
      }

      if (matches[3][0] === '[') {
        param.optional = true;
        param.name = matches[4]
          || matches[3].substring(1, matches[3].length - 1);

        if (matches[6]) {
          param.defaultValue = matches[6];
        }
      } else {
        param.name = matches[3];
      }

      if (param.name[0] === '\'' && param.name.endsWith('\'')) {
        try {
          param.name = JSON.parse('"\\"' + param.name.substring(1, param.name.length - 1) + '\\""');
        } catch {
          // ignore this parsing error
        }
      }

      param.description = matches[8] || undefined;

      if (param.description) {
        param.description += parseDescriptionText(text);
      }
    }

    return param;
  },
  parseReturnsKeyword(text: string, type: Parser.Type | Parser.Type[] = Type.unknown) {
    const output: Entry.MethodReturns = { type, description: text };
    const matches = RETURNS_RE.exec(`${text}\n`);

    if (matches) {
      if (matches[2]) {
        JSDoc.parseTypeParam(matches[2], output);
      }

      output.description = matches[3] || undefined;

      if (output.description) {
        output.description += parseDescriptionText(text);
      }
    }

    return output;
  },
};
