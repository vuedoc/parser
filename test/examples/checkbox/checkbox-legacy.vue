<script>
/**
 * A simple checkbox component
 *
 * @contributor Sébastien
 */
export default {
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

</script>

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
  <template v-for=""></template>
</label>

</template>