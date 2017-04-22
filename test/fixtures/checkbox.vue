<template>
  <label>
    <input :disabled="disabled" type="text" v-model="checkbox">
    <slot></slot>
    <slot name="label" description="Use this slot to set the checbox label"></slot>
  </label>
</template>

<script>
const dynamic2 = 'dynamicMode'

/**
 * A simple checkbox component
 */
export default {
  name: 'checkbox',
  props: {
    /**
     * The checbox model
     */
    model: {
      type: Array,
      required: true,
      twoWay: true
    },
    
    /** 
     * Initial checbox state
     */
    disabled: Boolean,
    
    /**
     * Initial checbox value
     */
    checked: {
      type: Boolean,
      default: true
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
     * Check the checbox
     */
    check () {
      console.log('check')
    }
  }
};
</script>

<style lang="css" scoped>
</style>
