const { SlotEntry, SlotProp, SlotPropGenerator } = require('../entity/SlotEntry');

const { Tag } = require('../Enum');
const { KeywordsUtils } = require('../utils/KeywordsUtils');
const { JSDoc, TYPE_LIMIT, TYPE_MIDLE } = require('../JSDoc');

const PARAM_NAME = '[a-zA-Z0-9:$&\\.\\[\\]_-]+';
const TYPE = `[${TYPE_LIMIT}]*|[${TYPE_LIMIT}][${TYPE_LIMIT}${TYPE_MIDLE}]*[${TYPE_LIMIT}]`;
const SLOT_RE = new RegExp(`^\\s*(\\{\\(?(${TYPE})\\)?\\}\\s+)?(${PARAM_NAME}|\\[(${PARAM_NAME})(=(.*))?\\])\\s(\\s*-?\\s*)?(.*)?`);

const VBindPrefix = 'v-bind:';
const VBindName = VBindPrefix + 'name';

module.exports.SlotParser = {
  parseTemplateSlots (entry, attrsList, comment) {
    JSDoc.parseParams(this, comment.keywords, entry.props, SlotPropGenerator);

    const keywordsProps = entry.props.map(({ name }) => name);
    const definedProps = attrsList
      .filter(({ name }) => name.startsWith(VBindPrefix) && name !== VBindName)
      .map(({ name }) => name.substring(7))
      .filter((name) => !keywordsProps.includes(name))
      .map((name) => new SlotProp(name));

    entry.props.push(...definedProps);
  },

  extractSlotKeywords (keywords) {
    return KeywordsUtils.extract(keywords, Tag.slot).map((keyword) => {
      const param = JSDoc.parseParamKeyword(keyword.description, SlotPropGenerator, SLOT_RE);
      const entry = new SlotEntry(param.name, param.description);

      KeywordsUtils.parseCommonEntryTags(entry);

      return entry;
    });
  }
};
