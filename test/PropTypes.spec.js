/* eslint-disable max-len */
/* global describe */

import { ComponentTestCase } from './lib/TestUtils';

describe('@znck/prop-types', () => {
  ComponentTestCase({
    name: 'should successfully parse ProTypes definitions',
    options: {
      filecontent: `
        <script>
          import PropTypes from '@znck/prop-types';

          class Message {}

          export default {
            props: {
              // You can declare that a prop is a specific JS primitive. By default, these
              // are all optional.
              optionalArray: PropTypes.array,
              optionalBool: PropTypes.bool,
              optionalFunc: PropTypes.func,
              optionalNumber: PropTypes.number,
              optionalObject: PropTypes.object,
              optionalString: PropTypes.string,
              optionalSymbol: PropTypes.symbol,

              // You can also declare that a prop is an instance of a class. This uses
              // JS's instanceof operator.
              optionalMessage: PropTypes.instanceOf(Message),

              // You can ensure that your prop is limited to specific values by treating
              // it as an enum.
              optionalEnum: PropTypes.oneOf(['News', 'Photos']),

              // An object that could be one of many types
              optionalUnion: PropTypes.oneOfType([
                PropTypes.string,
                PropTypes.number,
                PropTypes.instanceOf(Message)
              ]),

              // An array of a certain type
              optionalArrayOf: PropTypes.arrayOf(PropTypes.number),

              // An object with property values of a certain type
              optionalObjectOf: PropTypes.objectOf(PropTypes.number),

              // An object taking on a particular shape
              optionalObjectWithShape: PropTypes.shape({
                color: PropTypes.string,
                fontSize: PropTypes.number
              }),

              // You can chain any of the above with \`isRequired\` to make sure a warning
              // is shown if the prop isn't provided.
              requiredFunc: PropTypes.func.isRequired,

              // A value of any data type
              requiredAny: PropTypes.any.isRequired,

              // You can also supply a custom validator.
              customArrayProp: PropTypes.string.validate(value => value === 'foo'),
            }
          }
        </script>
      `
    },
    expected: {
      props: [
        {
          default: undefined,
          describeModel: false,
          category: undefined,
          description: 'are all optional.',
          keywords: [],
          kind: 'prop',
          name: 'optional-array',
          required: false,
          type: 'array',
          visibility: 'public' },
        {
          default: undefined,
          describeModel: false,
          category: undefined,
          description: undefined,
          keywords: [],
          kind: 'prop',
          name: 'optional-bool',
          required: false,
          type: 'boolean',
          visibility: 'public' },
        {
          default: undefined,
          describeModel: false,
          category: undefined,
          description: undefined,
          keywords: [],
          kind: 'prop',
          name: 'optional-func',
          required: false,
          type: 'function',
          visibility: 'public' },
        {
          default: undefined,
          describeModel: false,
          category: undefined,
          description: undefined,
          keywords: [],
          kind: 'prop',
          name: 'optional-number',
          required: false,
          type: 'number',
          visibility: 'public' },
        {
          default: undefined,
          describeModel: false,
          category: undefined,
          description: undefined,
          keywords: [],
          kind: 'prop',
          name: 'optional-object',
          required: false,
          type: 'object',
          visibility: 'public' },
        {
          default: undefined,
          describeModel: false,
          category: undefined,
          description: undefined,
          keywords: [],
          kind: 'prop',
          name: 'optional-string',
          required: false,
          type: 'string',
          visibility: 'public' },
        {
          default: undefined,
          describeModel: false,
          category: undefined,
          description: undefined,
          keywords: [],
          kind: 'prop',
          name: 'optional-symbol',
          required: false,
          type: 'symbol',
          visibility: 'public' },
        {
          default: undefined,
          describeModel: false,
          category: undefined,
          description: 'JS\'s instanceof operator.',
          keywords: [],
          kind: 'prop',
          name: 'optional-message',
          required: false,
          type: 'Message',
          visibility: 'public' },
        {
          default: undefined,
          describeModel: false,
          category: undefined,
          description: 'it as an enum.',
          keywords: [],
          kind: 'prop',
          name: 'optional-enum',
          required: false,
          type: [
            '\'News\'',
            '\'Photos\''
          ],
          visibility: 'public' },
        {
          default: undefined,
          describeModel: false,
          category: undefined,
          description: 'An object that could be one of many types',
          keywords: [],
          kind: 'prop',
          name: 'optional-union',
          required: false,
          type: [
            'string',
            'number',
            'Message'
          ],
          visibility: 'public' },
        {
          default: undefined,
          describeModel: false,
          category: undefined,
          description: 'An array of a certain type',
          keywords: [],
          kind: 'prop',
          name: 'optional-array-of',
          required: false,
          type: 'number[]',
          visibility: 'public' },
        {
          default: undefined,
          describeModel: false,
          category: undefined,
          description: 'An object with property values of a certain type',
          keywords: [],
          kind: 'prop',
          name: 'optional-object-of',
          required: false,
          type: 'number',
          visibility: 'public' },
        {
          default: undefined,
          describeModel: false,
          category: undefined,
          description: 'An object taking on a particular shape',
          keywords: [],
          kind: 'prop',
          name: 'optional-object-with-shape',
          required: false,
          type: '{ color: string, fontSize: number }',
          visibility: 'public' },
        {
          default: undefined,
          describeModel: false,
          category: undefined,
          description: 'is shown if the prop isn\'t provided.',
          keywords: [],
          kind: 'prop',
          name: 'required-func',
          required: true,
          type: 'function',
          visibility: 'public' },
        {
          default: undefined,
          describeModel: false,
          category: undefined,
          description: 'A value of any data type',
          keywords: [],
          kind: 'prop',
          name: 'required-any',
          required: true,
          type: 'any',
          visibility: 'public' },
        {
          default: undefined,
          describeModel: false,
          category: undefined,
          description: 'You can also supply a custom validator.',
          keywords: [],
          kind: 'prop',
          name: 'custom-array-prop',
          required: false,
          type: 'unknown',
          visibility: 'public' },
      ]
    }
  });
});
