<template>
  <label>
    <input :disabled="disabled" type="text" v-model="checkbox"/>
    <!-- Default slot -->
    <slot></slot>
    <!-- Use this slot to set the checkbox label -->
    <slot name="label">Unamed checkbox</slot>
    <!--
      This
      is multiline description
    -->
    <slot name="multiline">Unamed checkbox</slot>
    <slot name="undescribed"></slot>
    <template></template>
  </label>
</template>

<script>
  const dynamic2 = 'dynamicMode'

  /**
   * A simple checkbox component
   *
   * @contributor Sébastien
   */
  export default Vue.extends({
    name: 'checkbox',
    model: {
      prop: 'model',
    },
    props: {
      /**
       * The checkbox model
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

      // Prop with camel name
      propWithCamel: {
        type: Object,
        default: () => ({ name: 'X'})
      }
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

    created () {
      /**
       * Emit when the component has been loaded
       */
      this.$emit('loaded')
    },

    methods: {
      /**
       * @private
       */
      privateMethod () {
        console.log('check')

        const name = 'check'
        const value = 'event value'

        if (name) {
          console.log('>', name)
        }

        /**
         * Event with identifier name
         */
        this.$emit(name, value)
      },

      /**
       * Check the checkbox
       */
      check () {
        console.log('check')

        let eventName = 'check'
        const value = 'event value'

        if (eventName) {
          console.log('>', eventName)
        }

        eventName = 'renamed'

        /**
         * Event with renamed identifier name
         */
        this.$emit(eventName, value)
      },

      /**
       * @protected
       */
      recursiveIdentifierValue () {
        console.log('check')

        let recursiveValue = 'recursive'
        const value = 'event value'

        if (eventName) {
          console.log('>', eventName)
        }

        eventName = recursiveValue

        /**
         * Event with recursive identifier name
         */
        this.$emit(eventName, value)
      },

      uncommentedMethod () {}
    }
  })
</script>

<style scoped>
  label {
    font-size: .9em
  }
</style>
