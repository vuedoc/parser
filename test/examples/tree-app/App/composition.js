import { ref } from 'vue';
import TreeItem from './TreeItem.vue';

export default {
  components: {
    TreeItem,
  },
  setup() {
    const treeData = ref({
      name: 'My Tree',
      children: [
        { name: 'hello' },
        { name: 'world' },
        {
          name: 'child folder',
          children: [
          {
            name: 'child folder',
            children: [{ name: 'hello' }, { name: 'wat' }],
          },
          { name: 'hello' },
          { name: 'wat' },
          {
            name: 'child folder',
            children: [{ name: 'hello' }, { name: 'wat' }],
          },
          ],
        },
      ],
    });

    return {
      treeData,
    };
  },
};
