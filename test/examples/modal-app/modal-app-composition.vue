<script>
import Modal from './Modal.vue';
import { ref } from 'vue';

export default {
  components: {
    Modal,
  },
  setup() {
    const showModal = ref(false);

    return {
      showModal,
    };
  },
};

</script>

<template>
<button id="show-modal" @click="showModal = true">Show Modal</button>

<Teleport to="body">
  <!-- use the modal component, pass in the prop -->
  <modal :show="showModal" @close="showModal = false">
    <template #header>
      <h3>custom header</h3>
    </template>
  </modal>
</Teleport>

</template>