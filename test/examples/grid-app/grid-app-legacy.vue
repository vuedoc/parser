<script>
import DemoGrid from './Grid.vue';

export default {
  components: {
    DemoGrid,
  },
  data: () => ({
    searchQuery: '',
    gridColumns: ['name', 'power'],
    gridData: [
      { name: 'Chuck Norris', power: Infinity },
      { name: 'Bruce Lee', power: 9000 },
      { name: 'Jackie Chan', power: 7000 },
      { name: 'Jet Li', power: 8000 },
    ],
  }),
};

</script>

<template>
<form id="search">
  Search <input name="query" v-model="searchQuery"/>
</form>
<DemoGrid
  :data="gridData"
  :columns="gridColumns"
  :filter-key="searchQuery">
</DemoGrid>
</template>