import { VuedocParser } from '../../src/parsers/VuedocParser.ts';

export function loadSFC(sfc) {
  const root = new VuedocParser({
    filecontent: '',
    resolver: {
      // eslint-disable-next-line no-undef
      paths: globalThis.VUEDOC_FAKE_NODEMODULES_PATHS,
    },
  });

  const file = root.fs.loadContent('vue', sfc);
  const parser = root.createScriptParser(file.script, file);

  root.file = file;
  parser.parse();

  return parser;
}
