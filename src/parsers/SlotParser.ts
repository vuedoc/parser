import { SlotEntry, SlotProp, SlotPropGenerator } from '../entity/SlotEntry.js';

import { Tag } from '../lib/Enum.js';
import { KeywordsUtils } from '../utils/KeywordsUtils.js';
import { JSDoc, TYPE_LIMIT, TYPE_MIDLE } from '../lib/JSDoc.js';
import { Entry } from '../../types/Entry.js';

const PARAM_NAME = '[a-zA-Z0-9:$&\\.\\[\\]_-]+';
const TYPE = `[${TYPE_LIMIT}]*|[${TYPE_LIMIT}][${TYPE_LIMIT}${TYPE_MIDLE}]*[${TYPE_LIMIT}]`;
const SLOT_RE = new RegExp(`^\\s*(\\{\\(?(${TYPE})\\)?\\}\\s+)?(${PARAM_NAME}|\\[(${PARAM_NAME})(=(.*))?\\])\\s(\\s*-?\\s*)?(.*)?`);

const VBindPrefix = 'v-bind:';
const VBindName = VBindPrefix + 'name';

export const SlotParser = {
  parseTemplateSlots(entry: Entry.SlotEntry, attrsList: Array<{ name: string }>, comment) {
    JSDoc.parseParams(this, comment.keywords, entry.props, SlotPropGenerator);

    const keywordsProps = entry.props.map(({ name }) => name);
    const definedProps = attrsList
      .filter(({ name }) => name.startsWith(VBindPrefix) && name !== VBindName)
      .map(({ name }) => name.substring(7))
      .filter((name) => !keywordsProps.includes(name))
      .map((name) => new SlotProp(name));

    entry.props.push(...definedProps);
  },

  extractSlotKeywords(keywords: Entry.Keyword[]) {
    return KeywordsUtils.extract(keywords, Tag.slot).map((keyword) => {
      const param = JSDoc.parseParamKeyword(keyword.description || '', SlotPropGenerator, SLOT_RE);
      const entry = new SlotEntry(param.name, param.description);

      KeywordsUtils.parseCommonEntryTags(entry);

      return entry;
    });
  },
};
