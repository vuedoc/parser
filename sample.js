const vuedoc = require('.')
const options = {
  filename: 'test/fixtures/checkbox.vue'
}

vuedoc.parse(options)
  .then((component) => console.log(JSON.stringify(component, null, 2)))
  .catch((err) => console.error(err))
