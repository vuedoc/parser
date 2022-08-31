<script>
import PolyGraph from './PolyGraph.vue';

export default {
  components: {
    PolyGraph,
  },
  data: () => ({
    newLabel: '',
    stats: [
      { label: 'A', value: 100 },
      { label: 'B', value: 100 },
      { label: 'C', value: 100 },
      { label: 'D', value: 100 },
      { label: 'E', value: 100 },
      { label: 'F', value: 100 },
    ],
  }),
  methods: {
    add(e) {
      e.preventDefault();
      if (!this.newLabel) return;
      this.stats.push({
        label: this.newLabel,
        value: 100,
      });
      this.newLabel = '';
    },
    remove(stat) {
      if (this.stats.length > 3) {
        this.stats.splice(this.stats.indexOf(stat), 1);
      } else {
        alert("Can't delete more!");
      }
    },
  },
};

</script>

<template>
<svg width="200" height="200">
  <PolyGraph :stats="stats"></PolyGraph>
</svg>

<!-- controls -->
<div v-for="stat in stats">
  <label>{{stat.label}}</label>
  <input type="range" v-model="stat.value" min="0" max="100"/>
  <span>{{stat.value}}</span>
  <button @click="remove(stat)" class="remove">X</button>
</div>

<form id="add">
  <input name="newlabel" v-model="newLabel"/>
  <button @click="add">Add a Stat</button>
</form>

<pre id="raw">{{ stats }}</pre>

</template>

<style>
polygon {
  fill: #42b983;
  opacity: 0.75;
}

circle {
  fill: transparent;
  stroke: #999;
}

text {
  font-size: 10px;
  fill: #666;
}

label {
  display: inline-block;
  margin-left: 10px;
  width: 20px;
}

#raw {
  position: absolute;
  top: 0;
  left: 300px;
}

</style>