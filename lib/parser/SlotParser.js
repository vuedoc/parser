const { AbstractParser } = require('./AbstractParser')
const { SlotProp } = require('../entity/SlotProp')
const { SlotEntry } = require('../entity/SlotEntry')
const { JSDoc } = require('../JSDoc')

module.exports.SlotParser = {
  parseTemplateSlots (entry, attrsList, comment) {
    JSDoc.parseParams(comment.keywords, entry, 'props')

    const keywordsProps = entry.props.map(({ name }) => name)
    const definedProps = attrsList
      .filter(({ name }) => name.startsWith('v-bind:'))
      .map(({ name }) => name.substring(7))
      .filter((name) => !keywordsProps.includes(name))
      .map((name) => new SlotProp(name))

    entry.props.push(...definedProps)
  },

  extractSlotKeywords (keywords) {
    return AbstractParser.extractKeywords(keywords, 'slot').map((keyword) => {
      const param = JSDoc.parseParamKeyword(keyword.description)
      const slot = new SlotEntry(param.name, param.description)

      return slot
    })
  }
}
