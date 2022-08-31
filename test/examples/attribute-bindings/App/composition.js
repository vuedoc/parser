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
