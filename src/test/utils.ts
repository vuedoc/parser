import { parseComponent } from '../index.js';
import { beforeAll, describe, expect, it } from 'vitest';
import { merge } from '@b613/utils/lib/object.js';

export const ComponentTestCase = ({ name, description, only = false, expected, options }) => {
  const title = description ? `${name}: ${description}` : name;
  const executeTests = () => {
    let component = null;

    beforeAll(async () => {
      if (options.filecontent instanceof Promise) {
        options.filecontent = await options.filecontent;
      }

      if (globalThis.FAKE_NODEMODULES_PATHS) {
        if (!options.resolver) {
          options.resolver = {};
        }

        merge(options.resolver, {
          paths: globalThis.FAKE_NODEMODULES_PATHS,
        });
      }

      component = await parseComponent(options);
    });

    it.each(Object.entries(expected))('should successfully parse %j', (key, entries) => {
      expect(component[key]).toEqual(entries);
    });
  };

  if (only) {
    describe.only(title, executeTests);
  } else {
    describe.concurrent(title, executeTests);
  }
};
