import { describe, expect, it } from 'vitest';
import { PugLoader } from '../../src/loaders/pug.ts';
import { Loader } from '../../src/lib/Loader.ts';

describe('MarkupTemplateParser', () => {
  it('Pug', async () => {
    const options = {
      filecontent: `
        <template lang="pug">
          div
            label(:for='id')
              // Use this slot to set the label
              slot(name='label')
            .editor(contenteditable='true')
              // Use this slot to set the textarea value
              slot      
        </template>
      `,
      loaders: [
        Loader.extend('pug', PugLoader),
      ],
    };

    await expect(options).toParseAs({
      slots: [
        {
          kind: 'slot',
          name: 'label',
          visibility: 'public',
          description: 'Use this slot to set the label',
          keywords: [],
          props: [],
        },
        {
          kind: 'slot',
          name: 'default',
          visibility: 'public',
          description: 'Use this slot to set the textarea value',
          keywords: [],
          props: [],
        },
      ],
    });
  });

  it('slots', async () => {
    const options = {
      filecontent: `
        <template>
          <div>
            <label :for="id">
              <!-- Use this slot to set the label -->
              <slot name="label"></slot>
            </label>
            <div class="editor" contenteditable="true">
              <!-- Use this slot to set the textarea value -->
              <slot></slot>
            </div>
          </div>
        </template>
      `,
    };

    await expect(options).toParseAs({
      slots: [
        {
          kind: 'slot',
          name: 'label',
          visibility: 'public',
          description: 'Use this slot to set the label',
          keywords: [],
          props: [],
        },
        {
          kind: 'slot',
          name: 'default',
          visibility: 'public',
          description: 'Use this slot to set the textarea value',
          keywords: [],
          props: [],
        },
      ],
    });
  });

  it('#81 - Slot comment not parsed correctly', async () => {
    const options = {
      filecontent: `
        <template>
            <div>
                <div>
                    <!-- Slot A -->
                    <slot name="a">
                        <span>A</span>
                    </slot>
                </div>
                <div>
                    <!-- Slot B -->
                    <slot name="b">
                        <span>B</span>
                    </slot>
                </div>
            </div>
        </template>
      `,
    };

    await expect(options).toParseAs({
      slots: [
        {
          kind: 'slot',
          name: 'a',
          visibility: 'public',
          description: 'Slot A',
          keywords: [],
          props: [],
        },
        {
          kind: 'slot',
          name: 'b',
          visibility: 'public',
          description: 'Slot B',
          keywords: [],
          props: [],
        },
      ],
    });
  });

  it("#89 - dynamic slot names aren't supported", async () => {
    const options = {
      filecontent: `
        <template>
          <table>
            <tr>
                <th>Property name</th>
                <th>Property value</th>
            </tr>
            <tr v-for="(item, index) in items" :key="index">
              <td>
              {{ item.label }}
              </td>
              <td>
                <!--
                    @slot prop-value:xxxx - a slot description
                -->
                <slot
                :item="item"
                :name="'prop-value:' + item.key"
                >{{ item.value }}</slot>
              </td>
            </tr>
          </table>
          <slot name="this-works'">hi</slot>
          <slot :name="'this-does-not'">hi</slot>
          <slot v-bind:name="'this-does-not2'">hi</slot>
        </template>
      `,
    };

    await expect(options).toParseAs({
      slots: [
        {
          kind: 'slot',
          name: 'prop-value:xxxx',
          visibility: 'public',
          description: 'a slot description',
          keywords: [],
          props: [],
        },
        {
          kind: 'slot',
          name: "this-works'",
          visibility: 'public',
          keywords: [],
          props: [],
        },
        {
          kind: 'slot',
          name: "'this-does-not'",
          visibility: 'public',
          keywords: [],
          props: [],
        },
        {
          kind: 'slot',
          name: "'this-does-not2'",
          visibility: 'public',
          keywords: [],
          props: [],
        },
      ],
    });
  });
});
