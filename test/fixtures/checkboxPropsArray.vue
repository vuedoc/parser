<template>
  <input :disabled="disabled" type="text"/>
</template>

<script>
  export default {
    name: 'checkbox',
    model: {
      prop: 'model',
    },
    props: [
      /**
       * The checkbox model
       */
      'model',
      'disabled',
      /**
       * Initial checkbox value
       */
      'checked',
      'propWithCamel'
    ],
  }
</script>
