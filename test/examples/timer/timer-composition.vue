<script>
import { ref, onUnmounted } from 'vue';

export default {
  setup() {
    const duration = ref(15 * 1000);
    const elapsed = ref(0);

    let lastTime = performance.now();
    let handle;
    const update = () => {
      const time = performance.now();

      elapsed.value += Math.min(time - lastTime, duration.value - elapsed.value);
      lastTime = time;
      handle = requestAnimationFrame(update);
    };

    update();
    onUnmounted(() => {
      cancelAnimationFrame(handle);
    });

    return {
      duration,
      elapsed,
    };
  },
};

</script>

<template>
<label
  >Elapsed Time: <progress :value="elapsed / duration"></progress
></label>

<div>{{ (elapsed / 1000).toFixed(1) }}s</div>

<div>
  Duration: <input type="range" v-model="duration" min="1" max="30000"/>
  {{ (duration / 1000).toFixed(1) }}s
</div>

<button @click="elapsed = 0">Reset</button>

</template>

<style>
.elapsed-container {
  width: 300px;
}

.elapsed-bar {
  background-color: red;
  height: 10px;
}
</style>