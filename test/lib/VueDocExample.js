import { join } from 'path';
import { readFile, stat, writeFile } from 'fs/promises';
import { beforeAll, expect, it } from 'vitest';
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

const defaultOptions = {
  composition: {
    data: [],
    methods: [
      {
        fname: 'debounce',
        valueIndex: 0,
      },
    ],
    computed: [],
    props: [],
  },
  resolver: {
    paths: [
      join(__dirname, '../fake_node_modules'),
    ],
  },
};

export const VueDocExample = {
  validate(name, path) {
    let legacySfc;
    let legacyResult;
    let compositionResult;
    let compositionSfc;

    beforeAll(async () => {
      const style = await loadFileContent(join(path, 'App/style.css'));
      const template = await loadFileContent(join(path, 'App/template.html'));
      const options = await loadFileContent(join(path, 'App/options.js'));
      const composition = await loadFileContent(join(path, 'App/composition.js'));
      const sfcLegacy = [];
      const sfcComposition = [];

      if (options) {
        const scriptHtml = `<script>\n${options}\n</script>`;

        sfcLegacy.push(scriptHtml);
      }

      if (options) {
        const scriptHtml = composition.includes('export default')
          ? `<script>\n${composition}\n</script>`
          : `<script setup>\n${composition}\n</script>`;

        sfcComposition.push(scriptHtml);
      }

      if (template) {
        const templateHtml = `<template>\n${template}\n</template>`;

        sfcLegacy.push(templateHtml);
        sfcComposition.push(templateHtml);
      }

      if (style) {
        const styleHtml = `<style>\n${style}\n</style>`;

        sfcLegacy.push(styleHtml);
        sfcComposition.push(styleHtml);
      }

      legacySfc = sfcLegacy.join('\n\n');
      compositionSfc = sfcComposition.join('\n\n');

      legacyResult = await parseComponent({
        ...defaultOptions,
        filecontent: legacySfc,
      });

      compositionResult = await parseComponent({
        ...defaultOptions,
        filecontent: compositionSfc,
      });
    });

    if (process.env.UPDATE_EXAMPLES_RESULTS) {
      it('update example result file', async () => {
        const legacyPath = join(path, `${name}-legacy.vue`);
        const compositionPath = join(path, `${name}-composition.vue`);
        const resultPath = join(path, 'parsing-result.json');
        const resultString = JSON.stringify(compositionResult, null, 2);

        await writeFile(resultPath, resultString, 'utf-8');
        await writeFile(legacyPath, legacySfc, 'utf-8');
        await writeFile(compositionPath, compositionSfc, 'utf-8');
      });
    } else {
      it('should successfully parse without warnings', () => {
        expect(legacyResult.warnings).toEqual([]);
        expect(compositionResult.warnings).toEqual([]);
      });

      it('should successfully parse without errors', () => {
        expect(legacyResult.errors).toEqual([]);
        // expect(compositionResult.errors).toEqual([]);
      });

      it.each(features)('should successfully parse %j', (feature) => {
        if (feature === 'computed') {
          for (const computed of legacyResult[feature]) {
            computed.dependencies = [];
          }
        }

        expect(compositionResult[feature]).toEqual(legacyResult[feature]);
      });
    }
  },
};
