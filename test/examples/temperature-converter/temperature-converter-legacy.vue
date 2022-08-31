<script>
export default {
  data() {
    return {
      c: 0,
      f: 32,
    };
  },
  methods: {
    setC(e, v = +e.target.value) {
      this.c = v;
      this.f = v * (9 / 5) + 32;
    },
    setF(e, v = +e.target.value) {
      this.f = v;
      this.c = (v - 32) * (5 / 9);
    },
  },
};

</script>

<template>
<input type="number" :value="c" @change="setC"/> Celsius =
<input type="number" :value="f" @change="setF"/> Fahrenheit

</template>