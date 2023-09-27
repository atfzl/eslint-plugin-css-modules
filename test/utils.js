/* pattern taken from eslint-plugin-import */

import path from 'path';

/**
 * TODO:  Find a way to remove this.
 */
export function addFilenameOption(testCase) {
  return {
    ...testCase,
    filename: path.resolve(__dirname, './files/foo.js'),
  };
}
