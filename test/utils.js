/* pattern taken from eslint-plugin-import */

import path from 'path';

const FILENAME = path.resolve(__dirname, './files/foo.js');

export function test (t) {
  return Object.assign({
    parserOptions: {
      sourceType: 'module',
      ecmaVersion: 6,
      ecmaFeatures: { jsx: true },
    },
    filename: FILENAME,
  }, t);
}
