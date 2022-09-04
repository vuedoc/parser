import { describe, expect, it } from 'vitest';

describe('EventParser', () => {
  it('$emit without arguments', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      events: [],
    });
  });

  it('$emit without arguments', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      events: [
        {
          kind: 'event',
          name: 'input',
          keywords: [],
          visibility: 'public',
          arguments: [],
        },
      ],
    });
  });

  it('Rest argument', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      events: [
        {
          kind: 'event',
          name: 'input',
          keywords: [],
          visibility: 'public',
          arguments: [
            {
              name: 'this.values',
              rest: true,
              type: 'unknown',
            },
          ],
        },
      ],
    });
  });

  it('Rest argument with JSDoc', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      events: [
        {
          kind: 'event',
          name: 'input',
          keywords: [],
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
        },
      ],
    });
  });

  it('Destructuring object argument', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      events: [
        {
          kind: 'event',
          name: 'input',
          keywords: [],
          description: 'Emit the input event',
          visibility: 'public',
          arguments: [
            {
              name: '{ value: this.value }',
              rest: false,
              type: 'object',
            },
          ],
        },
      ],
    });
  });

  it('Destructuring object argument with JSDoc', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      events: [
        {
          kind: 'event',
          name: 'input',
          keywords: [],
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
        },
      ],
    });
  });

  it('Destructuring array argument', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      events: [
        {
          kind: 'event',
          name: 'input',
          keywords: [],
          description: 'Emit the input event',
          visibility: 'public',
          arguments: [
            {
              name: '[this.value]',
              rest: false,
              type: 'array',
            },
          ],
        },
      ],
    });
  });

  it('Destructuring array argument with JSDoc', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      events: [
        {
          kind: 'event',
          name: 'input',
          keywords: [],
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
        },
      ],
    });
  });

  it('Assignment argument', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      events: [
        {
          kind: 'event',
          name: 'input',
          keywords: [],
          description: 'Emit the input event',
          visibility: 'public',
          arguments: [
            {
              name: 'this.cache',
              rest: false,
              type: 'unknown',
            },
          ],
        },
      ],
    });
  });

  it('Assignment argument with unhandled name', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      events: [
        {
          kind: 'event',
          name: 'input',
          keywords: [],
          description: 'Emit the input event',
          visibility: 'public',
          arguments: [
            {
              name: 'value',
              rest: false,
              type: 'unknown',
            },
          ],
        },
      ],
    });
  });

  it('Assignment argument with unhandled name', async () => {
    const options = {
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      computed: [
        {
          kind: 'computed',
          name: 'oven',
          type: 'unknown',
          dependencies: [
            'value',
          ],
          keywords: [],
          visibility: 'public',
        },
      ],
      events: [
        {
          kind: 'event',
          name: 'input',
          keywords: [],
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
        },
      ],
    });
  });

  it('Event in watchers', async () => {
    const options = {
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
            },
            fooProp2: (newVal) => {
              /**
               * Emitted when fooProp changes
               *
               * @arg {Boolean} newVal - The new value
               */
              this.$emit("foo-changed2", newVal)
              this.sendEvent2(newVal)
            },
            fooProp3: function (newVal) {
              /**
               * Emitted when fooProp changes
               *
               * @arg {Boolean} newVal - The new value
               */
              this.$emit("foo-changed3", newVal)
              this.sendEvent2(newVal)
            },
            ['fooProp4']: function (newVal) {
              /**
               * Emitted when fooProp changes
               *
               * @arg {Boolean} newVal - The new value
               */
              this.$emit("foo-changed4", newVal)
              this.sendEvent2(newVal)
            },
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
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      computed: [],
      events: [
        {
          kind: 'event',
          name: 'foo-changed',
          keywords: [],
          description: 'Emitted when fooProp changes',
          visibility: 'public',
          arguments: [
            {
              name: 'newVal',
              type: 'boolean',
              description: 'The new value',
              rest: false,
            },
          ],
        },
        {
          kind: 'event',
          name: 'foo-changed2',
          keywords: [],
          description: 'Emitted when fooProp changes',
          visibility: 'public',
          arguments: [
            {
              name: 'newVal',
              type: 'boolean',
              description: 'The new value',
              rest: false,
            },
          ],
        },
        {
          kind: 'event',
          name: 'foo-changed3',
          keywords: [],
          description: 'Emitted when fooProp changes',
          visibility: 'public',
          arguments: [
            {
              name: 'newVal',
              type: 'boolean',
              description: 'The new value',
              rest: false,
            },
          ],
        },
        {
          kind: 'event',
          name: 'foo-changed4',
          keywords: [],
          description: 'Emitted when fooProp changes',
          visibility: 'public',
          arguments: [
            {
              name: 'newVal',
              type: 'boolean',
              description: 'The new value',
              rest: false,
            },
          ],
        },
        {
          kind: 'event',
          name: 'event2',
          keywords: [],
          description: 'Also emitted when fooProp changes',
          visibility: 'public',
          arguments: [
            {
              name: 'newVal',
              type: 'boolean',
              description: 'The new value',
              rest: false,
            },
          ],
        },
      ],
    });
  });
});
