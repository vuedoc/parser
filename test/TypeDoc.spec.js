/* eslint-disable max-len */
/* global describe */

const { ComponentTestCase } = require('./lib/TestUtils')

describe('TypeDoc', () => {
  ComponentTestCase({
    name: '@param <param name>',
    options: {
      filecontent: `
        <script>
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
      errors: [],
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

  ComponentTestCase({
    name: '@return(s)',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * @returns      Comment for special return value.
               */
              doSomething(target: any, value: number): number {}
            }
          }
        </script>
      `
    },
    expected: {
      errors: [],
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
              name: 'value',
              type: 'number',
              description: '',
              defaultValue: undefined,
              rest: false
            },
          ],
          return: {
            type: 'number',
            description: 'Comment for special return value.'
          },
          visibility: 'public' },
      ]
    }
  })

  ComponentTestCase({
    name: '@hidden and @ignore',
    options: {
      filecontent: `
        <script>
          export default {
            methods: {
              /**
               * @hidden
               */
              doSomething(target: any, value: number): number {},
              /**
               * @ignore
               */
              doSomething2(target: any, value: number): number {},
            }
          }
        </script>
      `
    },
    expected: {
      errors: [],
      methods: []
    }
  })
})
