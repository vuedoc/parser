const parser = require('..')

/* global describe it expect */
/* eslint-disable max-len */
/* eslint-disable indent */

describe('#43 - InheritAttrs Field', () => {
  it('should successfully parse inheritAttrs === true with stringify === true', () => {
    const options = {
      stringify: true,
      filecontent: `
        <script>
          export default Vue.extends({
            inheritAttrs: true
          })
        </script>
      `
    }

    const expected = true

    return parser.parse(options).then(({ inheritAttrs }) => {
      expect(inheritAttrs).toEqual(expected)
    })
  })

  it('should successfully parse inheritAttrs === false with stringify === true', () => {
    const options = {
      stringify: true,
      filecontent: `
        <script>
          export default Vue.extends({
            inheritAttrs: false
          })
        </script>
      `
    }

    const expected = false

    return parser.parse(options).then(({ inheritAttrs }) => {
      expect(inheritAttrs).toEqual(expected)
    })
  })

  it('should successfully parse inheritAttrs === false with stringify === false', () => {
    const options = {
      stringify: false,
      filecontent: `
        <script>
          export default Vue.extends({
            inheritAttrs: false
          })
        </script>
      `
    }

    const expected = false

    return parser.parse(options).then(({ inheritAttrs }) => {
      expect(inheritAttrs).toEqual(expected)
    })
  })

  it('should successfully parse inheritAttrs === false with default stringify value', () => {
    const options = {
      filecontent: `
        <script>
          export default Vue.extends({
            inheritAttrs: false
          })
        </script>
      `
    }

    const expected = false

    return parser.parse(options).then(({ inheritAttrs }) => {
      expect(inheritAttrs).toEqual(expected)
    })
  })

  it('should successfully parse default inheritAttrs with default stringify value', () => {
    const options = {
      filecontent: `
        <script>
          export default Vue.extends({})
        </script>
      `
    }

    const expected = true

    return parser.parse(options).then(({ inheritAttrs }) => {
      expect(inheritAttrs).toEqual(expected)
    })
  })

  it('should successfully parse inheritAttrs === true', () => {
    const options = {
      filecontent: `
        <script>
          export default Vue.extends({
            inheritAttrs: true
          })
        </script>
      `
    }

    const expected = true

    return parser.parse(options).then(({ inheritAttrs }) => {
      expect(inheritAttrs).toEqual(expected)
    })
  })

  it('should successfully parse inheritAttrs === false', () => {
    const options = {
      filecontent: `
        <script>
          export default Vue.extends({
            inheritAttrs: false
          })
        </script>
      `
    }

    const expected = false

    return parser.parse(options).then(({ inheritAttrs }) => {
      expect(inheritAttrs).toEqual(expected)
    })
  })

  it('should successfully parse missing inheritAttrs', () => {
    const options = {
      filecontent: `
        <script>
          export default Vue.extends({})
        </script>
      `
    }

    const expected = true

    return parser.parse(options).then(({ inheritAttrs }) => {
      expect(inheritAttrs).toEqual(expected)
    })
  })
})
