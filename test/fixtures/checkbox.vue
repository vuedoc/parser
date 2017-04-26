<template>
  <label>
    <input :disabled="disabled" type="text" v-model="checkbox">
    <!-- Default slot -->
    <slot></slot>
    <!-- Use this slot to set the checkbox label -->
    <slot name="label">Unamed checkbox</slot>
    <!-- 
      This
      is multiline description
    -->
    <slot name="multiline">Unamed checkbox</slot>
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
    }
  },
  
  data () {
    return {}
  },
  
  created () {
    /**
     * Emit when the component has been loaded
     */
    this.$emit('loaded')
  },
  
  methods: {
    /**
     * Check the checkbox
     */
    check () {
      console.log('check')
    }
  }
};
</script>

<style lang="css" scoped>
</style>
