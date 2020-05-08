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
})
