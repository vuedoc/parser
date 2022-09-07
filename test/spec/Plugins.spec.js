import { describe, expect, it, test } from 'vitest';
import { EntryEvent } from '../../src/parsers/VuedocParser.ts';
import { KeywordsEntry } from '../../src/entity/KeywordsEntry.ts';
import { Keyword } from '../../src/entity/Keyword.ts';
// import { createVuexPlugin } from '/home/demsking/Workspace/projects/vuedoc-plugin-vuex/src/index.ts';

describe('Plugins', () => {
  it('plugin without parser modification', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      name: 'MyCustomComponent',
      data: [
        {
          kind: 'data',
          name: 'message',
          type: 'unknown',
          description: 'Message value',
          initialValue: "myCustomRef('Hello World!')",
          keywords: [],
          visibility: 'public',
        },
      ],
    });
  });

  it('plugin with additional composition', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      data: [
        {
          kind: 'data',
          name: 'message',
          type: 'string',
          description: 'Message value',
          initialValue: '"Hello World!"',
          keywords: [],
          visibility: 'public',
        },
      ],
    });
  });

  it('intercept and edit EntryEvent<NameEntry>', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      name: 'MyCustomComponentX',
    });
  });

  it('intercept and stop propagation of EntryEvent<NameEntry>', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      keywords: [],
    });
  });

  it('inject additional EntryEvent<KeywordsEntry> on EntryEvent<NameEntry>', async () => {
    const options = {
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
    };

    await expect(options).toParseAs({
      errors: [],
      warnings: [],
      name: 'MyCustomComponent',
      version: '1.0.0',
      author: [
        'Demanou',
      ],
      keywords: [
        {
          name: 'copyleft',
          description: '2022',
        },
      ],
    });
  });
});
