<script>
import { shuffle as _shuffle } from 'lodash-es';
import { ref } from 'vue';

export default {
  setup() {
    const getInitialItems = () => [1, 2, 3, 4, 5];
    const items = ref(getInitialItems());
    let id = items.value.length + 1;

    function insert() {
      const i = Math.round(Math.random() * items.value.length);

      items.value.splice(i, 0, id++);
    }

    function reset() {
      items.value = getInitialItems();
    }

    function shuffle() {
      items.value = _shuffle(items.value);
    }

    function remove(item) {
      const i = items.value.indexOf(item);

      if (i > -1) {
        items.value.splice(i, 1);
      }
    }

    return {
      items,
      insert,
      reset,
      shuffle,
      remove,
    };
  },
};

</script>

<template>
<button @click="insert">insert at random index</button>
<button @click="reset">reset</button>
<button @click="shuffle">shuffle</button>

<TransitionGroup tag="ul" name="fade" class="container">
  <div v-for="item in items" class="item" :key="item">
    {{ item }}
    <button @click="remove(item)">x</button>
  </div>
</TransitionGroup>

</template>

<style>
.container {
  position: relative;
  padding: 0;
}

.item {
  width: 100%;
  height: 30px;
  background-color: #f3f3f3;
  border: 1px solid #666;
  box-sizing: border-box;
}

/* 1. declare transition */
.fade-move,
.fade-enter-active,
.fade-leave-active {
  transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
  transform: scaleY(0.01) translate(30px, 0);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.fade-leave-active {
  position: absolute;
}

</style>