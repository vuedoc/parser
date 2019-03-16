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

/**
 * A simple checkbox component
 * 
 * @author Sébastien
 */
export default {
  name: 'checkbox',

  methods: {
    /**
     * @private
     */
    privateMethod () {},

    /**
     * @public
     */
    publicMethod () {},

    /**
     * Check the checkbox
     */
    defaultMethod () {},

    /**
     * @protected
     */
    protectedMethod () {},

    uncommentedMethod () {}
  }
}
</script>

<style lang="css" scoped></style>
