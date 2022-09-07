import { describe, expect, it } from 'vitest';

describe('ComputedParser', () => {
  it('property function', async () => {
    const options = {
      filecontent: `
        <script>
          export default {
            computed: {
              pages: function () {
                var _this = this;
                return this.links.map(function (pageId) {
                  return _this.site.getPage(pageId);
                });
              }
            }
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      computed: [
        {
          kind: 'computed',
          name: 'pages',
          type: 'unknown',
          dependencies: [
            'links',
            'site',
          ],
          keywords: [],
          visibility: 'public',
        },
      ],
    });
  });

  it('getter, setter and event (property function)', async () => {
    const options = {
      filecontent: `
        <script>
          export default {
            computed: {
              pages: {
                get: function () {
                  var _this = this;
                  return this.links.map(function (pageId) {
                    return _this.site.getPage(pageId);
                  });
                },
                set: function (value) {
                  this._pages = value

                  this.$emit('update:pages', value)
                  }
              }
            }
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      computed: [
        {
          kind: 'computed',
          name: 'pages',
          type: 'unknown',
          dependencies: [
            'links',
            'site',
          ],
          keywords: [],
          visibility: 'public',
        },
      ],
      events: [
        {
          kind: 'event',
          name: 'update:pages',
          keywords: [],
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

  it('getter, setter and event (object method)', async () => {
    const options = {
      filecontent: `
        <script>
          export default {
            computed: {
              pages: {
                get () {
                  var _this = this;
                  return this.links.map(function (pageId) {
                    return _this.site.getPage(pageId);
                  });
                },
                set (value) {
                  this._pages = value

                  this.$emit('update:pages', value)
                }
              }
            }
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      computed: [
        {
          kind: 'computed',
          name: 'pages',
          type: 'unknown',
          dependencies: [
            'links',
            'site',
          ],
          keywords: [],
          visibility: 'public',
        },
      ],
      events: [
        {
          kind: 'event',
          name: 'update:pages',
          keywords: [],
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

  it('dynamic object key', async () => {
    const options = {
      filecontent: `
        <script>
          const computedProp2 = 'computedProp2Value'

          export default {
            computed: {
              ['computedProp1']() { return 1 },
              [computedProp2]() { return 2 }
            }
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      computed: [
        {
          kind: 'computed',
          name: 'computedProp1',
          type: 'number',
          keywords: [],
          dependencies: [],
          visibility: 'public',
        },
        {
          kind: 'computed',
          name: 'computedProp2Value',
          type: 'number',
          keywords: [],
          dependencies: [],
          visibility: 'public',
        },
      ],
    });
  });

  it('dependancies', async () => {
    const options = {
      filecontent: `
        <script>
          export default {
            computed: {
              classes() {
                  return [
                      \`ui-autocomplete--type-\${this.type}\`,
                      \`ui-autocomplete--icon-position-\${this.iconPosition}\`,
                      { 'is-active': this.isActive },
                      { 'is-invalid': this.invalid },
                      { 'is-touched': this.isTouched },
                      { 'is-disabled': this.disabled },
                      { 'has-label': this.hasLabel },
                      { 'has-floating-label': this.hasFloatingLabel }
                  ];
              },

              labelClasses() {
                  return {
                      'is-inline': this.hasFloatingLabel && this.isLabelInline,
                      'is-floating': this.hasFloatingLabel && !this.isLabelInline
                  };
              },

              hasLabel() {
                  return Boolean(this.label) || Boolean(this.$slots.default);
              },

              hasFloatingLabel() {
                  return this.hasLabel && this.floatingLabel;
              },

              isLabelInline() {
                  return this.valueLength === 0 && !this.isActive;
              },

              valueLength() {
                  return this.value ? this.value.length : 0;
              },

              hasFeedback() {
                  return Boolean(this.help) || Boolean(this.error) || Boolean(this.$slots.error);
              },

              showError() {
                  return this.invalid && (Boolean(this.error) || Boolean(this.$slots.error));
              },

              showHelp() {
                  return !this.showError && (Boolean(this.help) || Boolean(this.$slots.help));
              },

              matchingSuggestions() {
                  return this.suggestions
                      .filter((suggestion, index) => {
                          if (this.filter) {
                              return this.filter(suggestion, this.value);
                          }

                          return this.defaultFilter(suggestion, index);
                      })
                      .slice(0, this.limit);
              },

              nullx() {
                  return null;
              },
            }
          }
        </script>
      `,
    };

    await expect(options).toParseAs({
      errors: [],
      computed: [
        {
          kind: 'computed',
          visibility: 'public',
          keywords: [],
          name: 'classes',
          type: "Array<string | { 'is-active': unknown; } | { 'is-invalid': unknown; } | { 'is-touched': unknown; } | { 'is-disabled': unknown; } | { 'has-label': unknown; } | { 'has-floating-label': unknown; }>",
          dependencies: [
            'type',
            'iconPosition',
            'isActive',
            'invalid',
            'isTouched',
            'disabled',
            'hasLabel',
            'hasFloatingLabel',
          ],
        },
        {
          kind: 'computed',
          visibility: 'public',
          type: "{ 'is-inline': boolean; 'is-floating': boolean; }",
          keywords: [],
          name: 'labelClasses',
          dependencies: [
            'hasFloatingLabel',
            'isLabelInline',
          ],
        },
        {
          kind: 'computed',
          visibility: 'public',
          type: 'boolean',
          keywords: [],
          name: 'hasLabel',
          dependencies: [
            'label',
            '$slots',
          ],
        },
        {
          kind: 'computed',
          visibility: 'public',
          type: 'boolean',
          keywords: [],
          name: 'hasFloatingLabel',
          dependencies: [
            'hasLabel',
            'floatingLabel',
          ],
        },
        {
          kind: 'computed',
          visibility: 'public',
          type: 'boolean',
          keywords: [],
          name: 'isLabelInline',
          dependencies: [
            'valueLength',
            'isActive',
          ],
        },
        {
          kind: 'computed',
          visibility: 'public',
          type: 'number',
          keywords: [],
          name: 'valueLength',
          dependencies: [
            'value',
          ],
        },
        {
          kind: 'computed',
          visibility: 'public',
          type: 'boolean',
          keywords: [],
          name: 'hasFeedback',
          dependencies: [
            'help',
            'error',
            '$slots',
          ],
        },
        {
          kind: 'computed',
          visibility: 'public',
          type: 'boolean',
          keywords: [],
          name: 'showError',
          dependencies: [
            'invalid',
            'error',
            '$slots',
          ],
        },
        {
          kind: 'computed',
          visibility: 'public',
          type: 'boolean',
          keywords: [],
          name: 'showHelp',
          dependencies: [
            'showError',
            'help',
            '$slots',
          ],
        },
        {
          kind: 'computed',
          visibility: 'public',
          type: 'unknown',
          keywords: [],
          name: 'matchingSuggestions',
          dependencies: [
            'suggestions',
            'filter',
            'value',
            'defaultFilter',
            'limit',
          ],
        },
        {
          kind: 'computed',
          visibility: 'public',
          type: 'unknown',
          keywords: [],
          name: 'nullx',
          dependencies: [],
        },
      ],
    });
  });
});
