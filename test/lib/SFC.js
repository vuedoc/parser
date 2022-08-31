import { FAKE_NODEMODULES_PATHS } from '../../src/test/utils.ts';
import { VuedocParser } from '../../src/parsers/VuedocParser.ts';

export function loadSFC(sfc) {
  const root = new VuedocParser({
    filecontent: '',
    resolver: {
      paths: FAKE_NODEMODULES_PATHS,
    },
  });

  const file = root.fs.loadContent('vue', sfc);
  const parser = root.createScriptParser(file.script, file);

  parser.parse();

  return parser;
}
