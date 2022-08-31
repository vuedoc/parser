<script>
import { ref } from 'vue';

/**
 * Here we are reactively binding element attributes / properties to the state.
 * The :title syntax is short for v-bind:title.
 */
export default {
  setup() {
    const message = ref('Hello World!');
    const isRed = ref(true);
    const color = ref('green');

    function toggleRed() {
      isRed.value = !isRed.value;
    }

    function toggleColor() {
      color.value = color.value === 'green' ? 'blue' : 'green';
    }

    return {
      message,
      isRed,
      color,
      toggleRed,
      toggleColor,
    };
  },
};

</script>

<template>
<p>
  <span :title="message">
    Hover your mouse over me for a few seconds to see my dynamically bound title!
  </span>
</p>

<!--
class bindings have special support for objects and arrays
in addition to plain strings
-->
<p :class="{ red: isRed }" @click="toggleRed">
  This should be red... but click me to toggle it.
</p>

<!-- style bindings also support object and arrays -->
<p :style="{ color }" @click="toggleColor">
  This should be green, and should toggle between green and blue on click.
</p>

</template>

<style>
.red {
  color: red;
}
</style>