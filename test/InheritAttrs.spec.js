import { parseComponent } from '../index.js';

/* global describe it expect */
/* eslint-disable max-len */
/* eslint-disable indent */

describe('#43 - InheritAttrs Field', () => {
  it('should successfully parse inheritAttrs === true', () => {
    const options = {
      filecontent: `
        <script>
          export default Vue.extends({
            inheritAttrs: true
          })
        </script>
      `,
    };

    const expected = true;

    return parseComponent(options).then(({ inheritAttrs }) => {
      expect(inheritAttrs).toEqual(expected);
    });
  });

  it('should successfully parse inheritAttrs === false', () => {
    const options = {
      filecontent: `
        <script>
          export default Vue.extends({
            inheritAttrs: false
          })
        </script>
      `,
    };

    const expected = false;

    return parseComponent(options).then(({ inheritAttrs }) => {
      expect(inheritAttrs).toEqual(expected);
    });
  });

  it('should successfully parse inheritAttrs === true', () => {
    const options = {
      filecontent: `
        <script>
          export default Vue.extends({
            inheritAttrs: true
          })
        </script>
      `,
    };

    const expected = true;

    return parseComponent(options).then(({ inheritAttrs }) => {
      expect(inheritAttrs).toEqual(expected);
    });
  });

  it('should successfully parse inheritAttrs === false', () => {
    const options = {
      filecontent: `
        <script>
          export default Vue.extends({
            inheritAttrs: false
          })
        </script>
      `,
    };

    const expected = false;

    return parseComponent(options).then(({ inheritAttrs }) => {
      expect(inheritAttrs).toEqual(expected);
    });
  });

  it('should successfully parse missing inheritAttrs', () => {
    const options = {
      filecontent: `
        <script>
          export default Vue.extends({})
        </script>
      `,
    };

    const expected = true;

    return parseComponent(options).then(({ inheritAttrs }) => {
      expect(inheritAttrs).toEqual(expected);
    });
  });
});
