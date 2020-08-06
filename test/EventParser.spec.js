const { ComponentTestCase } = require('./lib/TestUtils')

/* global describe */

describe('EventParser', () => {
  ComponentTestCase({
    name: '$emit without arguments',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              someMethod() {
                this.$emit()
              }
            }
          };
        </script>
      `
    },
    expected: {
      errors: [],
      events: []
    }
  })

  ComponentTestCase({
    name: '$emit without arguments',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              someMethod() {
                this.$emit('input')
              }
            }
          };
        </script>
      `
    },
    expected: {
      errors: [],
      events: [
        {
          kind: 'event',
          name: 'input',
          keywords: [],
          category: null,
          description: '',
          visibility: 'public',
          arguments: [],
        }
      ]
    }
  })

  ComponentTestCase({
    name: 'Rest argument',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              someMethod() {
                this.$emit('input', ...this.values)
              }
            }
          };
        </script>
      `
    },
    expected: {
      errors: [],
      events: [
        {
          kind: 'event',
          name: 'input',
          keywords: [],
          category: null,
          description: '',
          visibility: 'public',
          arguments: [
            {
              description: '',
              name: 'this.values',
              rest: true,
              type: 'any',
            },
          ],
        }
      ]
    }
  })

  ComponentTestCase({
    name: 'Rest argument with JSDoc',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              someMethod() {
                /**
                 * Emit the input event
                 * @arg {...string[]} values - List of values
                 */
                this.$emit('input', ...this.values)
              }
            }
          };
        </script>
      `
    },
    expected: {
      errors: [],
      events: [
        {
          kind: 'event',
          name: 'input',
          keywords: [],
          category: null,
          description: 'Emit the input event',
          visibility: 'public',
          arguments: [
            {
              description: 'List of values',
              name: 'values',
              rest: true,
              type: 'string[]',
            },
          ],
        }
      ]
    }
  })

  ComponentTestCase({
    name: 'Destructuring object argument',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              someMethod() {
                /**
                 * Emit the input event
                 */
                this.$emit('input', { value: this.value })
              }
            }
          };
        </script>
      `
    },
    expected: {
      errors: [],
      events: [
        {
          kind: 'event',
          name: 'input',
          keywords: [],
          category: null,
          description: 'Emit the input event',
          visibility: 'public',
          arguments: [
            {
              description: '',
              name: '{ value: this.value }',
              rest: false,
              type: 'object',
            },
          ],
        }
      ]
    }
  })

  ComponentTestCase({
    name: 'Destructuring object argument with JSDoc',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              someMethod() {
                /**
                 * Emit the input event
                 * @arg {object} value - Input value
                 */
                this.$emit('input', { value: this.value })
              }
            }
          };
        </script>
      `
    },
    expected: {
      errors: [],
      events: [
        {
          kind: 'event',
          name: 'input',
          keywords: [],
          category: null,
          description: 'Emit the input event',
          visibility: 'public',
          arguments: [
            {
              description: 'Input value',
              name: 'value',
              rest: false,
              type: 'object',
            },
          ],
        }
      ]
    }
  })

  ComponentTestCase({
    name: 'Destructuring array argument',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              someMethod() {
                /**
                 * Emit the input event
                 */
                this.$emit('input', [ this.value ])
              }
            }
          };
        </script>
      `
    },
    expected: {
      errors: [],
      events: [
        {
          kind: 'event',
          name: 'input',
          keywords: [],
          category: null,
          description: 'Emit the input event',
          visibility: 'public',
          arguments: [
            {
              description: '',
              name: '[ this.value ]',
              rest: false,
              type: 'array',
            },
          ],
        }
      ]
    }
  })

  ComponentTestCase({
    name: 'Destructuring array argument with JSDoc',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              someMethod() {
                /**
                 * Emit the input event
                 * @arg {array} values - Input value
                 */
                this.$emit('input', [ this.value ])
              }
            }
          };
        </script>
      `
    },
    expected: {
      errors: [],
      events: [
        {
          kind: 'event',
          name: 'input',
          keywords: [],
          category: null,
          description: 'Emit the input event',
          visibility: 'public',
          arguments: [
            {
              description: 'Input value',
              name: 'values',
              rest: false,
              type: 'array',
            },
          ],
        }
      ]
    }
  })

  ComponentTestCase({
    name: 'Assignment argument',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              someMethod() {
                /**
                 * Emit the input event
                 */
                this.$emit('input', this.cache = this.value)
              }
            }
          };
        </script>
      `
    },
    expected: {
      errors: [],
      events: [
        {
          kind: 'event',
          name: 'input',
          keywords: [],
          category: null,
          description: 'Emit the input event',
          visibility: 'public',
          arguments: [
            {
              description: '',
              name: 'this.cache',
              rest: false,
              type: 'any',
            },
          ],
        }
      ]
    }
  })

  ComponentTestCase({
    name: 'Assignment argument with unhandled name',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              someMethod() {
                /**
                 * Emit the input event
                 */
                this.$emit('input', value = this.value)
              }
            }
          };
        </script>
      `
    },
    expected: {
      errors: [],
      events: [
        {
          kind: 'event',
          name: 'input',
          keywords: [],
          category: null,
          description: 'Emit the input event',
          visibility: 'public',
          arguments: [
            {
              description: '',
              name: '***unhandled***',
              rest: false,
              type: 'any',
            },
          ],
        }
      ]
    }
  })
})
