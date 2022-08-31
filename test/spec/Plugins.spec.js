import { describe } from 'vitest';
import { ComponentTestCase } from '../../src/test/utils.ts';
import { EntryEvent } from '../../src/parsers/VuedocParser.ts';
import { KeywordsEntry } from '../../src/entity/KeywordsEntry.ts';
import { Keyword } from '../../src/entity/Keyword.ts';

describe('Plugins', () => {
  ComponentTestCase({
    name: 'plugin without parser modification',
    options: {
      filecontent: `
        <script setup>
          /**
           * My custom component
           * @name MyCustomComponent
           */

          /**
           * Message value
           */
           const message = myCustomRef('Hello World!');
        </script>
      `,
      plugins: [
        (_parser) => {},
      ],
    },
    expected: {
      errors: [],
      warnings: [],
      name: 'MyCustomComponent',
      data: [
        {
          kind: 'data',
          name: 'message',
          type: 'unknown',
          category: undefined,
          version: undefined,
          description: 'Message value',
          initialValue: 'myCustomRef(\'Hello World!\')',
          keywords: [],
          visibility: 'public' },
      ],
    },
  });

  ComponentTestCase({
    name: 'plugin with additional composition',
    options: {
      filecontent: `
        <script setup>
          /**
           * Message value
           */
          const message = myCustomRef('Hello World!');
        </script>
      `,
      plugins: [
        (_parser) => ({
          composition: {
            data: [
              {
                fname: 'myCustomRef',
                valueIndex: 0,
              },
            ],
          },
        }),
      ],
    },
    expected: {
      errors: [],
      warnings: [],
      data: [
        {
          kind: 'data',
          name: 'message',
          type: 'string',
          category: undefined,
          version: undefined,
          description: 'Message value',
          initialValue: '"Hello World!"',
          keywords: [],
          visibility: 'public' },
      ],
    },
  });

  ComponentTestCase({
    name: 'intercept and edit EntryEvent<NameEntry>',
    options: {
      filecontent: `
        <script setup>
          /**
           * My custom component
           * @name MyCustomComponent
           */

          import { ref } from 'vue'

          /**
           * Message value
           */
          const message = 'Hello World!';
        </script>
      `,
      plugins: [
        (parser) => {
          parser.addEventListener('name', (event) => {
            event.entry.value += 'X';
          });
        },
      ],
    },
    expected: {
      errors: [],
      warnings: [],
      name: 'MyCustomComponentX',
    },
  });

  ComponentTestCase({
    name: 'intercept and stop propagation of EntryEvent<NameEntry>',
    options: {
      filecontent: `
        <script setup>
          /**
           * My custom component
           * @name MyCustomComponent
           */

          import { ref } from 'vue'

          /**
           * Message value
           */
          const message = 'Hello World!';
        </script>
      `,
      plugins: [
        (parser) => {
          parser.addEventListener('name', (event) => event.stopImmediatePropagation());
        },
      ],
    },
    expected: {
      errors: [],
      warnings: [],
      name: undefined,
      version: undefined,
      author: undefined,
      keywords: [],
    },
  });

  ComponentTestCase({
    name: 'inject additional EntryEvent<KeywordsEntry> on EntryEvent<NameEntry>',
    options: {
      filecontent: `
        <script setup>
          /**
           * My custom component
           * @name MyCustomComponent
           */

          import { ref } from 'vue'

          /**
           * Message value
           */
          const message = 'Hello World!';
        </script>
      `,
      plugins: [
        (parser) => {
          parser.addEventListener('name', () => parser.dispatchEvent(new EntryEvent(new KeywordsEntry([
            new Keyword('version', '1.0.0'),
            new Keyword('author', 'Demanou'),
            new Keyword('copyleft', '2022'),
          ]))));
        },
      ],
    },
    expected: {
      errors: [],
      warnings: [],
      name: 'MyCustomComponent',
      version: '1.0.0',
      author: ['Demanou'],
      keywords: [
        {
          name: 'copyleft',
          description: '2022',
        },
      ],
    },
  });
});
