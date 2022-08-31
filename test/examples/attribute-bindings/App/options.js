/**
 * Here we are reactively binding element attributes / properties to the state.
 * The :title syntax is short for v-bind:title.
 */
export default {
  data() {
    return {
      message: 'Hello World!',
      isRed: true,
      color: 'green',
    };
  },
  methods: {
    toggleRed() {
      this.isRed = !this.isRed;
    },
    toggleColor() {
      this.color = this.color === 'green' ? 'blue' : 'green';
    },
  },
};
