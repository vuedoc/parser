/**
 * A simple checkbox component
 *
 * @contributor Sébastien
 */
export default {
  name: 'checkbox',
  props: {
    /**
     * The checkbox model
     * @model
     */
    model: {
      type: Array,
      required: true,
      twoWay: true
    },

    /**
     * Initial checkbox state
     */
    disabled: Boolean,

    /**
     * Initial checkbox value
     */
    checked: {
      type: Boolean,
      default: true
    },
  },

  data () {
    return {
      initialValue: null
    }
  },

  computed: {
    id () {
      return `checkbox-${this.initialValue}`
    }
  },

  mounted () {
    /**
     * Emit when the component has been loaded
     */
    this.$emit('loaded')
  },
}
