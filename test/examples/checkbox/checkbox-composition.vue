<script>
import { computed, onMounted, ref } from 'vue'

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
     */
    modelValue: {
      type: Array,
      required: true,
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
  emits: [
    /**
     * Emit when the component has been loaded
     */
    'loaded',
  ],
  setup (props, { emit }) {
    const initialValue = ref(null);
    const id = computed(() => `checkbox-${initialValue.value}`)

    onMounted(() => emit('loaded'));

    return {
      initialValue,
      id
    }
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