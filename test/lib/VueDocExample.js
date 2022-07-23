import { join } from 'path';
import { readFile, stat, writeFile } from 'fs/promises';
import { beforeAll, describe, expect, it } from 'vitest';
import { parseComponent } from '../../src/index.ts';

async function loadFileContent(path) {
  try {
    const result = await stat(path);

    if (result.isFile()) {
      return readFile(path, { encoding: 'utf-8' });
    }
  } catch {
    // nothing
  }

  return null;
}

const features = [
  'name',
  'description',
  'keywords',
  'model',
  'data',
  'props',
  'computed',
  'methods',
  'events',
  'slots',
];

const compositionOptions = {
  data: [],
  methods: [
    'debounce',
  ],
  computed: [],
  props: [],
};

export const VueDocExample = {
  validate(path) {
    describe('should be parsed without errors', () => {
      let legacyResult;
      let compositionResult;

      beforeAll(async () => {
        const template = await loadFileContent(join(path, 'App/template.html'));
        const options = await loadFileContent(join(path, 'App/options.js'));
        const composition = await loadFileContent(join(path, 'App/composition.js'));
        const sfcLegacy = [];
        const sfcComposition = [];

        if (options) {
          const scriptHtml = `<script>${options}</script>`;

          sfcLegacy.push(scriptHtml);
        }

        if (options) {
          const scriptHtml = composition.includes('export default')
            ? `<script>${composition}</script>`
            : `<script setup>${composition}</script>`;

          sfcComposition.push(scriptHtml);
        }

        if (template) {
          const templateHtml = `<template>${template}</template>`;

          sfcLegacy.push(templateHtml);
          sfcComposition.push(templateHtml);
        }

        legacyResult = await parseComponent({
          composition: compositionOptions,
          filecontent: sfcLegacy.join('\n'),
        });

        compositionResult = await parseComponent({
          composition: compositionOptions,
          filecontent: sfcComposition.join('\n'),
        });
      });

      if (process.env.UPDATE_EXAMPLES_RESULTS) {
        it(`update example result for ${path}`, async () => {
          const resultPath = join(path, 'parsing-result.json');
          const resultString = JSON.stringify(compositionResult, null, 2);

          await writeFile(resultPath, resultString, 'utf-8');
        });
      } else {
        it.each(features)('should successfully parse %j', (feature) => {
          if (feature === 'computed') {
            for (const computed of legacyResult[feature]) {
              computed.dependencies = [];
            }
          }

          expect(compositionResult[feature]).toEqual(legacyResult[feature]);
        });
      }
    });
  },
};
