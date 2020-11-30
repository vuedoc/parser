const { ComponentTestCase } = require('./lib/TestUtils');

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
  });

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
          category: undefined,
          description: undefined,
          visibility: 'public',
          arguments: [],
        }
      ]
    }
  });

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
          category: undefined,
          description: undefined,
          visibility: 'public',
          arguments: [
            {
              description: undefined,
              name: 'this.values',
              rest: true,
              type: 'any',
            },
          ],
        }
      ]
    }
  });

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
          category: undefined,
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
  });

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
          category: undefined,
          description: 'Emit the input event',
          visibility: 'public',
          arguments: [
            {
              description: undefined,
              name: '{ value: this.value }',
              rest: false,
              type: 'object',
            },
          ],
        }
      ]
    }
  });

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
          category: undefined,
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
  });

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
          category: undefined,
          description: 'Emit the input event',
          visibility: 'public',
          arguments: [
            {
              description: undefined,
              name: '[ this.value ]',
              rest: false,
              type: 'array',
            },
          ],
        }
      ]
    }
  });

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
          category: undefined,
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
  });

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
          category: undefined,
          description: 'Emit the input event',
          visibility: 'public',
          arguments: [
            {
              description: undefined,
              name: 'this.cache',
              rest: false,
              type: 'any',
            },
          ],
        }
      ]
    }
  });

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
          category: undefined,
          description: 'Emit the input event',
          visibility: 'public',
          arguments: [
            {
              description: undefined,
              name: '***unhandled***',
              rest: false,
              type: 'any',
            },
          ],
        }
      ]
    }
  });

  ComponentTestCase({
    name: 'Assignment argument with unhandled name',
    options: {
      filecontent: `
        <script>
          export default {
            computed: {
              oven: {
                get() {
                  return this.value
                },

                set(oven) {
                  /**
                   * Emitted when an oven is selected.
                   *
                   * @param {Oven} oven = The selected oven
                   */
                  this.$emit('input', oven)
                }
              }
            }
          };
        </script>
      `
    },
    expected: {
      errors: [],
      computed: [
        {
          kind: 'computed',
          name: 'oven',
          dependencies: [ 'value' ],
          keywords: [],
          category: undefined,
          version: undefined,
          visibility: 'public',
        }
      ],
      events: [
        {
          kind: 'event',
          name: 'input',
          keywords: [],
          category: undefined,
          description: 'Emitted when an oven is selected.',
          visibility: 'public',
          arguments: [
            {
              name: 'oven',
              type: 'Oven',
              description: '= The selected oven',
              rest: false,
            },
          ],
        }
      ]
    }
  });

  ComponentTestCase({
    name: 'Event in watchers',
    options: {
      filecontent: `
        <template>
          <button @click="fooProp = !fooProp">click me</button>
        </template>

        <script>
        /**
         * Test component
         */
        export default {
          data() {
            return {
              fooProp: false
            }
          },
          watch: {
            fooProp(newVal) {
              /**
               * Emitted when fooProp changes
               *
               * @arg {Boolean} newVal - The new value
               */
              this.$emit("foo-changed", newVal)
              this.sendEvent2(newVal)
            }
          },
          methods: {
            /**
             * @private
             */
            sendEvent2(val) {
              /**
               * Also emitted when fooProp changes
               *
               * @arg {Boolean} newVal - The new value
               */
              this.$emit("event2", newVal)
            }
          }
        }
        </script>
      `
    },
    expected: {
      errors: [],
      warnings: [],
      computed: [],
      events: [
        {
          kind: 'event',
          name: 'foo-changed',
          keywords: [],
          category: undefined,
          version: undefined,
          description: 'Emitted when fooProp changes',
          visibility: 'public',
          arguments: [
            {
              name: 'newVal',
              type: 'Boolean',
              description: 'The new value',
              rest: false,
            },
          ],
        },
        {
          kind: 'event',
          name: 'event2',
          keywords: [],
          category: undefined,
          version: undefined,
          description: 'Also emitted when fooProp changes',
          visibility: 'public',
          arguments: [
            {
              name: 'newVal',
              type: 'Boolean',
              description: 'The new value',
              rest: false,
            },
          ],
        },
      ]
    }
  });
});
