const { ComponentTestCase } = require('./lib/TestUtils')

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
      `
    },
    expected: {
      slots: [
        {
          kind: 'slot',
          name: 'label',
          visibility: 'public',
          description: 'Use this slot to set the label',
          keywords: [],
          props: []
        },
        {
          kind: 'slot',
          name: 'default',
          visibility: 'public',
          description: 'Use this slot to set the textarea value',
          keywords: [],
          props: []
        }
      ]
    }
  })

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
      `
    },
    expected: {
      slots: [
        {
          kind: 'slot',
          name: 'a',
          visibility: 'public',
          description: 'Slot A',
          keywords: [],
          props: []
        },
        {
          kind: 'slot',
          name: 'b',
          visibility: 'public',
          description: 'Slot B',
          keywords: [],
          props: []
        }
      ]
    }
  })
})
