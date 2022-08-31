<script>
import { ref } from 'vue';
import { cells, evalCell } from './store.js';

export default {
  props: {
    c: Number,
    r: Number,
  },
  setup(props) {
    const editing = ref(false);

    function update(e) {
      editing.value = false;
      cells[props.c][props.r] = e.target.value.trim();
    }

    return {
      cells,
      editing,
      /**
       * @hidden
       */
      evalCell,
      update,
    };
  },
};

</script>

<template>
<div class="cell" :title="cells[c][r]" @click="editing = true">
  <input
    v-if="editing"
    :value="cells[c][r]"
    @change="update"
    @blur="update"
    @vnode-mounted="({ el }) => el.focus()"
  />
  <span v-else>{{ evalCell(cells[c][r]) }}</span>
</div>

</template>

<style>
.cell, .cell input {
  height: 1.5em;
  line-height: 1.5;
  font-size: 15px;
}

.cell span {
  padding: 0 6px;
}

.cell input {
  width: 100%;
  box-sizing: border-box;
}
</style>