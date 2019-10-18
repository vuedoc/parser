const parser = require('..')

/* global describe it expect */

const filecontent = `
  <script>
    export default {
      name: 'my-checkbox',
      /**
        * Use v-model to define a reactive model
        */
      model: {
        prop: 'checked',
        event: 'change'
      },
      props: {
        // value: String,
        checked: {
          type: Number,
          default: 0
        }
      },
      // ...
    }
  </script>
`

describe('#42 - Model', () => {
  it('should successfully parse component with a model field', () => {
    const options = { filecontent }
    const expected = {
      kind: 'model',
      visibility: 'public',
      description: 'Use v-model to define a reactive model',
      keywords: [],
      prop: 'checked',
      event: 'change'
    }

    return parser.parse(options).then(({ model }) => {
      expect(model).toEqual(expected)
    })
  })

  it('should ignore the model feature', () => {
    const features = []
    const options = { filecontent, features }
    const expected = undefined

    return parser.parse(options).then(({ model }) => {
      expect(model).toEqual(expected)
    })
  })
})
