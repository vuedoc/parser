<template>
  <input :disabled="disabled" type="text"/>
</template>

<script>
  export default {
    name: 'checkbox',
    props: [
      /**
       * The checkbox model
       * @model
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
