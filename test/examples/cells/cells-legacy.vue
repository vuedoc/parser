<script>
import { cells, evalCell } from './store.js';

export default {
  props: {
    c: Number,
    r: Number,
  },
  data() {
    return {
      cells,
      editing: false,
    };
  },
  methods: {
    /**
     * @hidden
     */
    evalCell,
    update(e) {
      this.editing = false;
      cells[this.c][this.r] = e.target.value.trim();
    },
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