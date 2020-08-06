/* eslint-disable max-len */
/* global describe */

const { ComponentTestCase } = require('./lib/TestUtils')

describe('TypeDoc', () => {
  ComponentTestCase({
    name: 'should successfully parse ProTypes definitions',
    options: {
      filecontent: `
        <script>
          import PropTypes from '@znck/prop-types';

          class Message {}

          export default {
            methods: {
              /**
               * @param text  Comment for parameter ´text´.
               */
              doSomething(target: any, text: string): number {}
            }
          }
        </script>
      `
    },
    expected: {
      methods: [
        {
          kind: 'method',
          name: 'doSomething',
          description: '',
          keywords: [],
          params: [
            {
              name: 'target',
              type: 'any',
              description: '',
              defaultValue: undefined,
              rest: false
            },
            {
              name: 'text',
              type: 'string',
              description: 'Comment for parameter ´text´.',
              defaultValue: undefined,
              rest: false
            },
          ],
          return: {
            type: 'number',
            description: ''
          },
          visibility: 'public' },
      ]
    }
  })
})
