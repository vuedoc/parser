<script>
import { ref } from 'vue';

export default {
  setup() {
    const count = ref(0);

    return {
      count,
    };
  },
};

</script>

<template>
{{ count }}
<button @click="count++">Count</button>
</template>