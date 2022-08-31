<script>
import { ref, computed } from 'vue';

export default {
  name: 'TreeItem', // necessary for self-reference
  props: {
    model: Object,
  },
  setup(props) {
    const isOpen = ref(false);
    const isFolder = computed(() => {
      return props.model.children && props.model.children.length;
    });

    function toggle() {
      isOpen.value = !isOpen.value;
    }

    function changeType() {
      if (!isFolder.value) {
        props.model.children = [];
        addChild();
        isOpen.value = true;
      }
    }

    function addChild() {
      props.model.children.push({ name: 'new stuff' });
    }

    return {
      isOpen,
      isFolder,
      toggle,
      changeType,
      addChild,
    };
  },
};

</script>

<template>
<li>
  <div
    :class="{ bold: isFolder }"
    @click="toggle"
    @dblclick="changeType">
    {{ model.name }}
    <span v-if="isFolder">[{{ isOpen ? '-' : '+' }}]</span>
  </div>
  <ul v-show="isOpen" v-if="isFolder">
    <!--
      A component can recursively render itself using its
      "name" option (inferred from filename if using SFC)
    -->
    <TreeItem
      class="item"
      v-for="model in model.children"
      :model="model">
    </TreeItem>
    <li class="add" @click="addChild">+</li>
  </ul>
</li>
</template>