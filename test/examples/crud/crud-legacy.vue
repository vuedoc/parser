<script>
export default {
  data() {
    return {
      names: ['Emil, Hans', 'Mustermann, Max', 'Tisch, Roman'],
      selected: '',
      prefix: '',
      first: '',
      last: '',
    };
  },
  computed: {
    filteredNames() {
      return this.names.filter((n) => n.toLowerCase().startsWith(this.prefix.toLowerCase()));
    },
  },
  watch: {
    selected(name) {
      [this.last, this.first] = name.split(', ');
    },
  },
  methods: {
    create() {
      if (this.hasValidInput()) {
        const fullName = `${this.last}, ${this.first}`;

        if (!this.names.includes(fullName)) {
          this.names.push(fullName);
          this.first = this.last = '';
        }
      }
    },
    update() {
      if (this.hasValidInput() && this.selected) {
        const i = this.names.indexOf(this.selected);

        this.names[i] = this.selected = `${this.last}, ${this.first}`;
      }
    },
    del() {
      if (this.selected) {
        const i = this.names.indexOf(this.selected);

        this.names.splice(i, 1);
        this.selected = this.first = this.last = '';
      }
    },
    hasValidInput() {
      return this.first.trim() && this.last.trim();
    },
  },
};

</script>

<template>
<div><input v-model="prefix" placeholder="Filter prefix"/></div>

<select size="5" v-model="selected">
  <option v-for="name in filteredNames">{{ name }}</option>
</select>

<label>Name: <input v-model="first"/></label>
<label>Surname: <input v-model="last"/></label>

<div class="buttons">
  <button @click="create">Create</button>
  <button @click="update">Update</button>
  <button @click="del">Delete</button>
</div>

</template>

<style>
* {
  font-size: inherit;
}

input {
  display: block;
  margin-bottom: 10px;
}

select {
  float: left;
  margin: 0 1em 1em 0;
  width: 14em;
}

.buttons {
  clear: both;
}

button + button {
  margin-left: 5px;
}

</style>