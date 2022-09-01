import { describe } from 'vitest';
import { ComponentTestCase } from '../../src/test/utils.ts';

describe('ComputedParser', () => {
  ComponentTestCase({
    name: 'property function',
    // only: true,
    options: {
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
    },
    expected: {
      errors: [],
      computed: [
        {
          kind: 'computed',
          name: 'pages',
          type: 'unknown',
          dependencies: ['links', 'site'],
          category: undefined,
          description: undefined,
          keywords: [],
          visibility: 'public',
        },
      ],
    },
  });

  ComponentTestCase({
    name: 'getter, setter and event (property function)',
    // only: true,
    options: {
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
    },
    expected: {
      errors: [],
      computed: [
        {
          kind: 'computed',
          name: 'pages',
          type: 'unknown',
          dependencies: ['links', 'site'],
          category: undefined,
          description: undefined,
          keywords: [],
          visibility: 'public',
        },
      ],
      events: [
        {
          kind: 'event',
          name: 'update:pages',
          keywords: [],
          category: undefined,
          description: undefined,
          visibility: 'public',
          arguments: [
            {
              description: undefined,
              name: 'value',
              rest: false,
              type: 'unknown',
            },
          ],
        },
      ],
    },
  });

  ComponentTestCase({
    name: 'getter, setter and event (object method)',
    // only: true,
    options: {
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
    },
    expected: {
      errors: [],
      computed: [
        {
          kind: 'computed',
          name: 'pages',
          type: 'unknown',
          dependencies: ['links', 'site'],
          category: undefined,
          description: undefined,
          keywords: [],
          visibility: 'public',
        },
      ],
      events: [
        {
          kind: 'event',
          name: 'update:pages',
          keywords: [],
          category: undefined,
          description: undefined,
          visibility: 'public',
          arguments: [
            {
              description: undefined,
              name: 'value',
              rest: false,
              type: 'unknown',
            },
          ],
        },
      ],
    },
  });

  ComponentTestCase({
    name: 'dynamic object key',
    options: {
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
    },
    expected: {
      errors: [],
      computed: [
        {
          kind: 'computed',
          name: 'computedProp1',
          type: 'number',
          category: undefined,
          description: undefined,
          keywords: [],
          dependencies: [],
          visibility: 'public' },
        {
          kind: 'computed',
          name: 'computedProp2Value',
          type: 'number',
          category: undefined,
          description: undefined,
          keywords: [],
          dependencies: [],
          visibility: 'public' },
      ],
    },
  });

  ComponentTestCase({
    name: 'dependancies',
    options: {
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
    },
    expected: {
      errors: [],
      computed: [
        {
          kind: 'computed',
          visibility: 'public',
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'classes',
          type: 'array',
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
          type: 'object',
          category: undefined,
          description: undefined,
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
          category: undefined,
          description: undefined,
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
          category: undefined,
          description: undefined,
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
          category: undefined,
          description: undefined,
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
          category: undefined,
          description: undefined,
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
          category: undefined,
          description: undefined,
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
          category: undefined,
          description: undefined,
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
          category: undefined,
          description: undefined,
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
          category: undefined,
          description: undefined,
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
          category: undefined,
          description: undefined,
          keywords: [],
          name: 'nullx',
          dependencies: [],
        },
      ],
    },
  });
});
