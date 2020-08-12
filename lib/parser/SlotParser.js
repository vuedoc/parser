const { SlotEntry, SlotProp, SlotPropGenerator } = require('../entity/SlotEntry')

const { Tag } = require('../Enum')
const { JSDoc } = require('../JSDoc')
const { KeywordsUtils } = require('../utils/KeywordsUtils')

module.exports.SlotParser = {
  parseTemplateSlots (entry, attrsList, comment) {
    JSDoc.parseParams(comment.keywords, entry.props, SlotPropGenerator)

    const keywordsProps = entry.props.map(({ name }) => name)
    const definedProps = attrsList
      .filter(({ name }) => name.startsWith('v-bind:'))
      .map(({ name }) => name.substring(7))
      .filter((name) => !keywordsProps.includes(name))
      .map((name) => new SlotProp(name))

    entry.props.push(...definedProps)
  },

  extractSlotKeywords (keywords) {
    return KeywordsUtils.extract(keywords, Tag.slot).map((keyword) => {
      const param = JSDoc.parseParamKeyword(keyword.description, SlotPropGenerator)
      const entry = new SlotEntry(param.name, param.description)

      KeywordsUtils.parseCommonEntryTags(entry)

      return entry
    })
  }
}
