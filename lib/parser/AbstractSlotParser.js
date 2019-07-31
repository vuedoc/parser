const { SlotProp } = require('../entity/SlotProp')
const { JSDoc } = require('../JSDoc')

class AbstractSlotParser {
  static parseTemplateSlots (entry, attrsList, comment) {
    JSDoc.parseParams(comment.keywords, entry, 'props')

    const keywordsProps = entry.props.map(({ name }) => name)
    const definedProps = attrsList
      .filter(({ name }) => name.startsWith('v-bind:'))
      .map(({ name }) => name.substring(7))
      .filter((name) => !keywordsProps.includes(name))
      .map((name) => new SlotProp(name))

    entry.props.push(...definedProps)
  }
}

module.exports.AbstractSlotParser = AbstractSlotParser
