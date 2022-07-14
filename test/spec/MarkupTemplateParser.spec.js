import { ComponentTestCase } from '../lib/TestUtils.js';

/* global describe */

describe('MarkupTemplateParser', () => {
  ComponentTestCase({
    name: 'slots',
    options: {
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
    },
    expected: {
      slots: [
        {
          kind: 'slot',
          name: 'label',
          visibility: 'public',
          category: undefined,
          description: 'Use this slot to set the label',
          keywords: [],
          props: [],
        },
        {
          kind: 'slot',
          name: 'default',
          visibility: 'public',
          category: undefined,
          description: 'Use this slot to set the textarea value',
          keywords: [],
          props: [],
        },
      ],
    },
  });

  ComponentTestCase({
    name: '#81 - Slot comment not parsed correctly',
    options: {
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
    },
    expected: {
      slots: [
        {
          kind: 'slot',
          name: 'a',
          visibility: 'public',
          category: undefined,
          description: 'Slot A',
          keywords: [],
          props: [],
        },
        {
          kind: 'slot',
          name: 'b',
          visibility: 'public',
          category: undefined,
          description: 'Slot B',
          keywords: [],
          props: [],
        },
      ],
    },
  });

  ComponentTestCase({
    name: '#89 - dynamic slot names aren\'t supported',
    options: {
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
    },
    expected: {
      slots: [
        {
          kind: 'slot',
          name: 'prop-value:xxxx',
          visibility: 'public',
          category: undefined,
          version: undefined,
          description: 'a slot description',
          keywords: [],
          props: [],
        },
        {
          kind: 'slot',
          name: 'this-works\'',
          visibility: 'public',
          category: undefined,
          version: undefined,
          description: undefined,
          keywords: [],
          props: [],
        },
        {
          kind: 'slot',
          name: '\'this-does-not\'',
          visibility: 'public',
          category: undefined,
          version: undefined,
          description: undefined,
          keywords: [],
          props: [],
        },
        {
          kind: 'slot',
          name: '\'this-does-not2\'',
          visibility: 'public',
          category: undefined,
          version: undefined,
          description: undefined,
          keywords: [],
          props: [],
        },
      ],
    },
  });
});
