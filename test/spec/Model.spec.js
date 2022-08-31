import { parseComponent } from '../../src/index.ts';
import { describe, expect, it } from 'vitest';

const filecontent = `
  <script>
    export default {
      name: 'my-checkbox',
      /**
       * Use v-model to define a reactive model
       */
      model: {
        prop: 'checked',
        event: 'change'
      }
      // ...
    }
  </script>
`;

describe('#42 - Model', () => {
  it('should successfully parse component with a model field', () => {
    const options = { filecontent };

    return parseComponent(options).then(({ props }) => {
      expect(props).toEqual([
        {
          kind: 'prop',
          visibility: 'public',
          description: 'Use v-model to define a reactive model',
          keywords: [],
          name: 'v-model',
          required: false,
          describeModel: true,
          type: 'unknown',
        },
      ]);
    });
  });

  it('should ignore the model feature', () => {
    const features = [];
    const options = { filecontent, features };

    return parseComponent(options).then(({ props }) => {
      expect(props).toEqual([]);
    });
  });
});
