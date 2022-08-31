<script>
  export const myMixin = {
    props: {
      name: String,
    },
    created: function() {
      this.hello();
    },
    methods: {
      hello: function() {
        console.log('hello from mixin!');
      },
    },
  };

  export default 'MyComponentName';
</script>

<template>
  <p>Hello {{name}}!</p>
</template>
