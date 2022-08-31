<script>
export default {
  data() {
    return {
      count: 0,
    };
  },
};

</script>

<template>
{{ count }}
<button @click="count++">Count</button>
</template>